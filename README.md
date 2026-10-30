# MOVE

A pomodoro timer where every break is an exercise. Build a list of exercises, arrange them into a sequence, and MOVE alternates a work period with the next exercise.

Download the Mac, Windows or Linux installer from [Releases](https://github.com/makahn64/move_pomodoro_timer/releases).

| Work | Exercise |
| --- | --- |
| ![Timer during a work period, light mode](docs/screenshots/timer-work-light.png) | ![Timer during an exercise, dark mode](docs/screenshots/timer-exercise-dark.png) |

**Setup:** drag exercises from your list into the sequence. Each bar shows that round's work and exercise time.

![Setup page with the exercise list and the sequence](docs/screenshots/setup-light.png)

**Mini window:** a small timer that stays out of the way while you work.

![Mini window during work, dark mode](docs/screenshots/mini-dark.png)
![Mini window waiting to start work, light mode](docs/screenshots/mini-light.png)

- Spec and design decisions: [docs/MOVE-app-spec.md](docs/MOVE-app-spec.md)
- Installing for non-technical users: [INSTALL.md](INSTALL.md)

## Development

```bash
npm install
npm run dev        # run with hot reload
npm test           # session state machine tests
npm run lint
npm run typecheck
```

## Building installers

Unsigned installers go to `dist/`:

```bash
npm run build:mac    # MOVE-<version>.dmg (universal, ad-hoc signed)
npm run build:win    # MOVE-<version>-setup.exe
npm run build:linux  # MOVE-<version>.AppImage
```

All three can be built from a Mac.

## Layout

- `src/main`: Electron main process (window sizing, bring-to-front, saving data as JSON in the user data folder)
- `src/preload`: the `window.api` bridge
- `src/shared`: types and first-run defaults
- `src/renderer/src/session.ts`: the timer as a pure state machine (tested in `session.test.ts`)
- `src/renderer/src/sounds.ts`: the two boundary sounds, synthesized with Web Audio
- `src/renderer/src/components`: Timer, Mini, Setup and Settings views
