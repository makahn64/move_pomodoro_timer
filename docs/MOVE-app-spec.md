# MOVE app spec

MOVE is an app that works like a traditional pomodoro timer with intervals between work and breaks. The difference is that each break is one or more physical exercises. Exercises can be of configurable length, however there are defaults. We'll come back to that.

## Pomodoro Background

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s that uses a timer to break work down into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are named pomodoros, the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo used as a university student. The technique is built on the psychological premise that frequent breaks improve mental agility, mitigate burnout, and sustain focus by creating a structured sense of urgency. After completing four consecutive focus sessions, individuals take a longer break of 15 to 30 minutes to fully recharge before starting the cycle again.

## MOVE App Goals

- Run on any desktop devices (Windows, Mac, Linux). Towards that end I lean towards using Electron with Typescript and React, but will entertain other options.
- It must be easy for non tech people to use. Starting a Vite server after installing a bunch of dependencies is decidedly NOT easy to use, so options like that are OUT.
- It must be attractive with options for dark and light modes. Use the impeccable design skill to chose colors and fonts.
- It must be configurable for break/exercise length and work period. Work period is of a single length, break/exercise periods have a default time, but the time can be changed per exercise.
- We do NOT need the long break feature, that is up to the user to configure one of their breaks.
- When running it needs to have a pause function in both the work and exercise segments.
- Users setup the exercises as a list of exercises to be performed in sequence. Example:
    - Work: 20 min
    - Exercise: Cat Cow Stretch, 5 minutes
    - Work: 20 min
    - Exercise: Child's Pose, 3 minutes
    - And so forth
- A page will exist in the app where the user can create an exercise and it's duration. No need to worry about "sets", this is handled by the user.
- At the end of each period, a loud noise will play to indicate it is a boundry. Work has one sound, Exercise another. We can either use system sounds if that makes sense, or embed WAV/MP3 from open source (or AI generated).
- The user's exercise list should be stored on the local machine along with any other preferences (dar/light/system)
- There will be two window sizes: full size and mini. Mini size just shows the timer and whether it is work or exercise. Time remaining is shown as a bar chart. In the larger size, time is shown as a radial time display.
- The user can edit the sequence of exercises by drag and drop. Available exercises are in the left column, the right column is the sequence.

## Design Decisions (2026-10-29)

Decisions from the design discussion. Items marked *(builder's call)* were defaults proposed by Claude and accepted, not explicitly requested.

### Stack and distribution

- Electron + TypeScript + React.
- Ship unsigned installers for Mac, Windows, and Linux. No code signing, no app store, no auto-update. This is a free tool, not a product.
- Include a short "how to open it the first time" note for each OS, since unsigned apps trigger a security warning on first launch.

### Session flow

1. User clicks **Start work**. Work countdown runs for the single configured work length.
2. When work ends: the **work sound** plays, MOVE comes to the front at its current size (mini or full, no resizing), and the next exercise countdown **starts immediately**. The screen shows the exercise name and its duration.
3. When an exercise ends: the **exercise sound** plays, MOVE comes to the front at its current size, and the app **waits**. Nothing runs until the user clicks **Start work**.
4. After the last exercise in the sequence, MOVE asks whether to start over. Yes loops back to the first exercise. No ends the session and returns to the idle screen *(builder's call)*.

### Controls while running

- **Pause / Resume** in both work and exercise periods. Pause freezes the countdown; resume continues from where it stopped.
- **Skip** in both work and exercise periods. It jumps to whatever would happen at the end of that period, without playing the sound *(builder's call)*: skipping work starts the exercise immediately; skipping an exercise goes to the "waiting for Start work" state.
- Closing the app mid-session ends the session; it does not resume where it left off *(builder's call)*.

### Exercises and duration

- An exercise is a **name and a duration**. No description, image, or sets.
- Settings holds a **default exercise length**. New exercises are pre-filled with it; the user can change it when creating the exercise or later by editing the exercise.
- Each exercise has **one duration** everywhere it appears in the sequence. No per-slot overrides.

### Setup page (exercise library + sequence)

- A **single Setup page**:
  - Left column: create exercises (name + minutes, pre-filled with the default) and the list of available exercises. Durations editable in place.
  - Right column: the sequence. Drag exercises from the left into the sequence; drag within the sequence to reorder. The same exercise can appear more than once.
- Every sequence step is: one work period (global work length) followed by that exercise.

### Settings page

- Work length
- Default exercise length
- Theme: light / dark / system

No sound or volume settings for now; the two sounds are built in *(builder's call)*.

### Timer views

- App navigation: **Timer | Setup | Settings**, plus a button to switch between full and mini. MOVE reopens at the size it was last in *(builder's call)*.
- **Full view:** radial countdown ring with time remaining and total; mode label (WORK / EXERCISE) and position in the sequence, e.g. "2 of 6" *(builder's call)*; exercise name during exercises; an "Up next" line *(builder's call)*; Pause, Skip, and Start work (when waiting).
- **Mini view:** one line with mode (and exercise name), time remaining, and a button to expand; a horizontal progress bar; the **same controls** as full (Pause, Skip, Start work). Mini is a **normal window**, not always-on-top.

### Storage

- Exercises, sequence, and settings are saved locally on the user's machine and persist across restarts.

### Left to the builder

- Colors, fonts, and overall visual style (use the impeccable design skill, light and dark themes).
- The two sounds: embedded open-source (CC0) or generated WAV/MP3, one for work-end and one for exercise-end. Loud enough to notice.

### Edge cases *(builder's calls, from design review)*

- Editing Setup or Settings during a session takes effect from the next period onward.
- Deleting an exercise that's in the sequence removes it from the sequence too, after a confirmation prompt.
- With an empty sequence, **Start work** is disabled.
- First run ships with sensible defaults: work length, default exercise length, and a short starter exercise list.
- Linux builds: AppImage only (a .deb needs a project homepage URL, which doesn't exist yet). Mac: universal build (Apple Silicon + Intel).
- Mac builds are ad-hoc signed (free) so they launch on Apple Silicon at all. The "how to open it" note covers the current macOS first-launch steps (System Settings → Privacy & Security → Open Anyway).
