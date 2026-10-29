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
