---
name: MOVE
description: A pomodoro timer where every break is an exercise, drawn as a painted sports court.
colors:
  floor: "#ccdbdc"
  floor-deep: "#b9cbcd"
  floor-raised: "#dae6e7"
  line: "#ffffff"
  line-soft: "rgb(255 255 255 / 0.6)"
  ink: "#13222a"
  ink-soft: "#33464e"
  ink-faint: "#45585f"
  work: "#1b47a0"
  work-ink: "#ffffff"
  work-wash: "rgb(27 71 160 / 0.13)"
  exercise: "#9c3b08"
  exercise-ink: "#ffffff"
  exercise-wash: "rgb(156 59 8 / 0.12)"
  danger: "#a3200f"
  focus: "#1b47a0"
  floor-dark: "#10141c"
  floor-deep-dark: "#0a0d13"
  floor-raised-dark: "#181e2a"
  line-dark: "#eef1f6"
  line-soft-dark: "rgb(238 241 246 / 0.22)"
  ink-dark: "#eef1f6"
  ink-soft-dark: "#b4bccb"
  ink-faint-dark: "#8a93a5"
  work-dark: "#4a8cff"
  work-ink-dark: "#06142e"
  work-wash-dark: "rgb(74 140 255 / 0.16)"
  exercise-dark: "#ff7a3d"
  exercise-ink-dark: "#2a0d00"
  exercise-wash-dark: "rgb(255 122 61 / 0.16)"
  danger-dark: "#ff6b5a"
  focus-dark: "#8fb6ff"
typography:
  display:
    fontFamily: "'Barlow Condensed', 'Barlow', sans-serif"
    fontSize: "25cqh"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  headline:
    fontFamily: "'Barlow Condensed', 'Barlow', sans-serif"
    fontSize: "clamp(30px, 5.2vw, 52px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.005em"
  title:
    fontFamily: "'Barlow Condensed', 'Barlow', sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.005em"
  body:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  body-lead:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
  label-signage:
    fontFamily: "'Barlow Condensed', 'Barlow', sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  label-field:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  court: "6px"
  pill: "999px"
spacing:
  hair: "2px"
  tight: "8px"
  control: "14px"
  stack: "16px"
  gutter: "24px"
components:
  button-primary-work:
    backgroundColor: "{colors.work}"
    textColor: "{colors.work-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.court}"
    padding: "10px 16px"
  button-primary-exercise:
    backgroundColor: "{colors.exercise}"
    textColor: "{colors.exercise-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.court}"
    padding: "10px 16px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.court}"
    padding: "10px 16px"
  button-line-hover:
    backgroundColor: "{colors.line-soft}"
  button-big:
    padding: "16px 26px"
    width: "170px"
  button-small:
    padding: "6px 10px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.court}"
    size: "34px"
  pill-work:
    backgroundColor: "{colors.work}"
    textColor: "{colors.work-ink}"
    typography: "{typography.label-signage}"
    rounded: "{rounded.pill}"
    padding: "7px 12px 6px"
  pill-exercise:
    backgroundColor: "{colors.exercise}"
    textColor: "{colors.exercise-ink}"
    typography: "{typography.label-signage}"
    rounded: "{rounded.pill}"
    padding: "7px 12px 6px"
  pill-idle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-signage}"
    rounded: "{rounded.pill}"
    padding: "7px 12px 6px"
  input:
    backgroundColor: "{colors.floor-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.court}"
    padding: "9px 10px"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.floor}"
    padding: "10px 14px"
  tab:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.court}"
    padding: "10px 14px"
  tab-active:
    textColor: "{colors.ink}"
---

# Design System: MOVE

## Overview

**Creative North Star: "The Painted Court"**

MOVE is a gymnasium floor. Light theme is a cool sport floor: a faint blue-gray ground with slightly deeper panels. Dark theme is a night court: a poured blue-black floor under the same white line paint. Time is not drawn as a widget. It is drawn as court markings: the centre circle is the radial timer, the half-court line runs through it edge to edge, the mini window is a lane stripe, and the sequence in Setup is a score of painted bars sized to each period's minutes.

Two paint colours carry every state. Court blue means work; key orange means exercise, and anything that asks you to act after an exercise (ready, finished). White boundary paint draws every neutral rule, outline and divider. Type is athletic signage: Barlow Condensed for numerals and headings, Barlow for UI text, tabular figures everywhere. The world is flat: no glass, no gradient fills, no texture. Depth is just paint over floor.

The system is built for a glance from across the room. One colour says which period you are in, one giant number says how long is left, and the exercise name says what to do. Everything else stays quiet on the floor.

**Key Characteristics:**
- Two paints (blue = work, orange = exercise) plus white line paint; no other accent.
- Flat, painted strokes with square (butt) ends; 2-4px lines, 30px paint arc.
- Condensed signage numerals at container-relative scale, tabular throughout.
- Light and dark are two real floors (blue-gray sport floor, night court), switched by `prefers-color-scheme`.
- One authored transition: the boundary repaint.

## Colors

Blue-gray sport floor or night poured floor, white line paint, and two saturated court paints; every token has a light and a dark value (dark keys carry the `-dark` suffix and map to the same CSS custom property).

### Primary
- **Court Blue** (`work` / `work-dark`): the work period. Ring paint, lane paint, Work pill, every Start work button, the work segment of the sequence score, text selection, input caret and the focus ring.

### Secondary
- **Key Orange** (`exercise` / `exercise-dark`): the exercise period and every after-exercise state (Up next, Sequence done). Ring paint, lane paint, pill, the drag chip, the exercise segment of the score, the lit "done" headline while waiting for Start work. Its wash (`exercise-wash`) tints the sequence panel on drag-over and the delete-confirm row.

### Tertiary
- **Whistle Red** (`danger` / `danger-dark`): destructive confirmation only (Delete button, trash-icon hover). Never a phase colour.

### Neutral
- **Sport Floor** (`floor`): the page ground. A faint, cool blue-gray, never white. Night: **Poured Night Court** (`floor-dark`).
- **Grain Panel** (`floor-deep`): the Setup sequence panel and sequence rows; one step deeper than the floor.
- **Sealed Top Coat** (`floor-raised`): input fills and the lifted (dragging) row.
- **Boundary Line Paint** (`line`): topbar rule, half-court line, ring boundary, line-button outlines, input borders, the Setup centre line, segmented control. `line-soft` is the same paint thinned: hover fills, inner ring, lane track, dividers.
- **Court Ink** (`ink`), **Worn Ink** (`ink-soft`), **Faded Ink** (`ink-faint`): primary text, secondary text and meta, placeholders and drag grips.

### Named Rules
**The Two Paints Rule.** Every phase state is court blue or key orange, nothing else. Ready and finished are orange because they follow an exercise and ask for action. Red is reserved for destroying data.

**The Paint Is Never Alone Rule.** A phase colour always travels with a word (the pill label, the exercise name, "Paused", "of work"). Colour never carries state by itself.

**The Orange Text Rule.** In the light theme key orange on the floor measures 4.8:1, enough for text at any size; keep it on the main floor, since on `floor-deep` it drops to 4.1:1 and should stay at headline size there. Small text on orange uses `exercise-ink`, never the reverse.

**The Line Is Not A Signal Rule.** White line paint on the light floor is a low-contrast (1.4:1) boundary by design. It frames and divides; it never alone marks a state, a selection or an error.

**The Blue-Gray Not White Rule.** The light floor stays a visible cool blue-gray (#ccdbdc). Do not lighten it toward white or warm it toward wood; white is reserved for line paint.

## Typography

**Display Font:** Barlow Condensed 600/700 (with Barlow, sans-serif)
**Body Font:** Barlow 400/500/600 (with system-ui, sans-serif)

**Character:** Gymnasium scoreboard and court signage: tall condensed numerals that read from across the room, set over a plain, sturdy grotesque for everything you operate. Both are bundled locally via @fontsource.

### Hierarchy
- **Display** (Barlow Condensed 600, 25% of the ring's height, line-height 0.9, -0.01em, tabular): the countdown inside the centre circle. Scales with the ring via container query units. The mini window uses the same face at 30px.
- **Headline** (Barlow Condensed 700, clamp 30-52px, line-height 1, balanced): the exercise name under the ring, and the "done" / "start over" line.
- **Title** (Barlow Condensed 700, 30px, line-height 1.05): panel headings in Setup (Settings uses 34px). Sequence step numbers use the same face at 22px.
- **Body** (Barlow 400, 15px, line-height 1.45, tabular): all running text. **Body Lead** (Barlow 500, 17px) for the "Then ..." line under the timer and setting names.
- **Label** (Barlow 600, 15px, line-height 1): buttons, tabs, segments. Big timer buttons step to 18px; mini buttons to 13px.
- **Signage Label** (Barlow Condensed 700, 14px, 0.14em, uppercase): the phase pill, and at 600 weight the step position ("Step 1 of 4") and ring note ("Paused", "of work"). Functional status only.
- **Field Label** (Barlow 600, 12px, 0.06em, uppercase): form field labels above inputs.

### Named Rules
**The Tabular Clock Rule.** Every number is tabular (`font-variant-numeric: tabular-nums` on body); the countdown never jitters as digits change.

**The Signage Is Status Rule.** Uppercase tracked condensed type labels live state or a field; it is never a decorative section heading.

## Layout

A fixed-chrome desktop window: a topbar (wordmark, tabs, mini toggle) ruled off by a 3px line, over a single scrolling page. The Timer page is a four-row grid (meta, court, copy at a fixed 128px, controls) so the ring never moves or resizes between phases; padding is 20px top, 24px sides, 32px bottom with 16px between rows. The ring fills its row up to 440px, square, and the half-court line extends 24px past the page padding to reach both window edges.

Setup is two equal halves divided by a 3px line, which is the grid gap showing the line paint beneath (22px / 24px panel padding). Settings is a single column capped at 640px with rows divided by 2px soft lines. The mini window is a three-row stack (label + time, lane, controls) at 12px / 14px padding with 10px gaps.

Spacing runs on a loose rhythm: 2px hairline gaps between list rows and score segments, 8px tight groupings, 14px between control buttons, 16px between stacked blocks, 24px page gutters. There are no responsive breakpoints; the ring and its numerals scale by container size, the headline by viewport width.

## Elevation & Depth

Flat by default. Depth comes from paint and floor tone: `floor-deep` sets a panel back, `floor-raised` brings a field forward, and paint sits on the floor rather than above it. A single soft shadow exists only for lift.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 1px 2px rgb(19 40 48 / 0.16), 0 8px 24px -12px rgb(19 40 48 / 0.32)`; night: `0 1px 2px rgb(0 0 0 / 0.4), 0 10px 28px -12px rgb(0 0 0 / 0.7)`): primary button hover, the drag chip, and a sequence row while dragged.

### Named Rules
**The Lift Only Rule.** Nothing casts a shadow at rest. A shadow means "this is in your hand or under your pointer".

## Shapes

Lines are the form language: flat painted strokes, square (butt) ends, in three weights: 2px for field and control outlines and soft dividers, 3px for the topbar rule, big buttons, the Setup centre line and the empty-sequence drop zone (dashed), and 4px for the half-court line and ring boundary. The timer's paint arc is a 30px stroke on a 172-unit radius that thins to 10px when paused; the mini lane hatches (45 degree, 6px on / 4px off) when paused.

Corners are gently eased at 6px on every button, field, row, chip and panel control. The phase pill is the one fully round shape (999px), like a painted jersey number badge. The centre circle is the only true circle in the layout.

## Components

### Buttons
Painted, flat and sure-footed.
- **Shape:** gently eased corners (6px), 2px border (3px on big buttons).
- **Primary:** solid paint in the period's tone: court blue for Start work and Start over, key orange for Add; ink is `work-ink` / `exercise-ink`. 10px 16px padding at 15px Barlow 600.
- **Line:** a boundary line you can press: transparent fill, white line-paint border, ink text. These carry the running controls (Pause, Skip, Done for now).
- **Hover / Focus / Active:** primary gains the Lift shadow; line fills with `line-soft`. Active nudges down 1px. 120ms ease-out. Focus is a 3px `focus` outline offset 2px. Disabled drops to 45% opacity.
- **Sizes:** Big (18px, 16px 26px, min 170px wide) for the timer; Small (13px, 6px 10px) for mini and inline confirm.
- **Icon button:** 34px square, no border, `ink-soft`, `line-soft` hover; destructive variants turn `danger` on hover. Icons are Lucide line icons, 20px at 2.5 stroke on big buttons.

### Phase Pill
- **Style:** Signage Label in a 999px pill with a 2px border. Work: blue fill. Exercise, Up next, Sequence done: orange fill. Idle: transparent with a white line border.
- Sits beside the step position above the ring, and at 12px at the start of the mini row.

### Inputs / Fields
- **Style:** `floor-raised` fill, 2px white line border, 6px corners, 9px 10px padding, Barlow 500 15px, blue caret. Number fields are right-aligned tabular, spinners removed.
- **Focus:** border shifts to `focus` blue; no glow.
- **Quiet variant:** inline-editable library rows: transparent and borderless until hover (soft line) and focus (raised fill).

### Navigation
- **Tabs:** Barlow 600 15px in `ink-soft`, ink on hover. The current tab is ink with a 3px ink bar that lands exactly on the topbar's line rule, like a painted marker on a sideline.
- **Wordmark:** "MOVE" in Barlow Condensed 700, 26px, 0.08em, split into the two paints.

### Segmented Control
- A 2px white-line box divided by 2px lines; segments are Barlow 600 14px `ink-soft`. Selected inverts to ink fill with floor-coloured text.

### Court Ring (signature)
The radial timer is the court's centre circle. A 4px white boundary circle, a 2px soft inner circle, and the remaining time painted over the boundary as a 30px butt-capped arc in the period colour, starting at 12 o'clock and receding clockwise (250ms linear per tick). The half-court line passes behind it; a floor-coloured disc masks the line inside. While waiting for Start work the full ring stays lit in orange.

### Lane (mini timer)
A 12px stripe of `line-soft` between two 2px white lines, painted from the left in the period colour; it scales on X with a 250ms linear tick and hatches when paused.

### Sequence Score
Each Setup row is a time score: a step number in condensed 22px, the exercise name and "25 + 5 min", and an 8px bar split by a 2px gap into a blue work segment and an orange exercise segment, each proportional to its minutes. Rows sit on `floor-deep` with 6px corners; dragging lifts a row onto `floor-raised` with the Lift shadow and shows an orange drag chip.

### Boundary Repaint (signature motion)
At each period boundary the incoming paint floods the window from the ring outward: a fixed overlay in the new period's colour expands as a circle from the ring's centre and fades out over 1100ms (`cubic-bezier(0.16, 1, 0.3, 1)`). It is removed entirely under `prefers-reduced-motion`, as is the ring's tick transition.

## Do's and Don'ts

### Do:
- **Do** colour every phase state with exactly one of the two paints: court blue (`work`) or key orange (`exercise`).
- **Do** pair every phase colour with a word: pill label, exercise name or ring note.
- **Do** draw rules, outlines and dividers as white line paint at 2, 3 or 4px with square ends.
- **Do** set numerals in Barlow Condensed with tabular figures, sized from the container, not fixed pixels.
- **Do** keep the timer grid rows fixed so the ring never moves between phases.
- **Do** keep light-theme orange text at 30px or larger; small text goes on orange, in `exercise-ink`.
- **Do** honour `prefers-reduced-motion` by dropping the repaint and the tick transition.

### Don't:
- **Don't** introduce a third accent or a gradient fill; the paused hatch is a stripe mask over paint, not a gradient.
- **Don't** add glass, blur, or texture imagery; the floor is a flat tone.
- **Don't** cast a shadow on anything at rest.
- **Don't** fade the light floor toward cream or paper.
- **Don't** use white line paint as the only signal of state, selection or error.
- **Don't** use red for anything but destroying data.
- **Don't** use uppercase tracked signage as a decorative heading over a section.
