# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Electron + TypeScript + React, decided by the owner in `docs/MOVE-app-spec.md`. Shipped as unsigned desktop installers for macOS, Windows and Linux.

## Users

People who work at a desk for long stretches and want short movement breaks built into their focus sessions. They are not necessarily technical: installing and opening the app has to be as easy as any other desktop app. The owner is the first user. *(Inferred: audience beyond the owner is anyone they share it with for free.)*

## Product Purpose

MOVE is a pomodoro timer where every break is a physical exercise. Users build a library of exercises (name + duration) and arrange them into a sequence; MOVE alternates a fixed work period with the next exercise in the sequence. Success: the user actually gets up and moves at each break, without having to think about what to do.

## Positioning

Breaks are not idle time. They are a named exercise with its own duration, chosen in advance and run in order.

## Operating Context

- The app runs beside the user's real work, often in a small "mini" window or minimised behind other apps.
- At the end of work it comes to the front, plays a sound and starts the exercise countdown immediately. The user is likely standing up, glancing at the screen from a distance.
- At the end of an exercise it plays a different sound and waits for the user to click Start work.

## Capabilities and Constraints

See `docs/MOVE-app-spec.md` § Design Decisions for the full behaviour. Key constraints: dark, light and system themes; full view with a radial timer; mini view with a bar timer and the same controls; everything stored locally.

## Evidence on Hand

None. No logo, brand assets, testimonials or user data exist. Do not fabricate any.

## Product Principles

1. Zero friction to start: one click begins a session.
2. Readable from across the room during an exercise.
3. The app gets out of the way during work and asks for attention only at boundaries.
4. Non-technical users never see a config file, terminal or error dump.

## Accessibility & Inclusion

*(Inferred)* Timer text and state must be legible at a distance and not rely on color alone to separate work from exercise. Respect reduced-motion settings.
