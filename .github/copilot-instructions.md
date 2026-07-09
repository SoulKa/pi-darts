# GitHub Copilot instructions — pi-darts

Custom instructions for GitHub Copilot when working in this repository.

## Project

**pi-darts** is a touch-first darts scoreboard that runs full-screen on a Raspberry Pi
touchscreen, scored entirely by tapping. Stack: **Vue 3** (`<script setup>`, composition API)
+ **Vite** + **TypeScript** (type-checked with `vue-tsc`). Client-side only, no backend.

## Commands

- `npm run dev` — dev server with hot reload
- `npm run type-check` — `vue-tsc --build`; the primary check (there is **no test runner**)
- `npm run build` — type-check + production build to `dist/`

Verify behavior by running `npm run dev` and exercising the UI in a browser.

## Where things live

- `src/game/useDartGame.ts` — core composable: game phase, players, options
  (`startScore`, `outMode`), turns, undo, and the `checkoutRoutes` computed. Constants
  `THROWS_PER_TURN`, `START_SCORES = [301, 501]`; `type OutMode = 'single' | 'double'`.
- `src/game/checkout.ts` — pure checkout solver (`suggestCheckouts`, `dartLabel`).
- `src/game/setupStorage.ts` — `localStorage` persistence (`loadSetup`/`saveSetup`,
  key `pi-darts.setup.v1`).
- `src/components/` — `App.vue` (root + overlays), `SetupScreen.vue`, `NumberPad.vue`,
  `PlayerBoard.vue`, `VirtualKeyboard.vue`.

Keep game logic in `src/game/` pure and UI-agnostic; keep components small and focused.

## Domain rules

- Up to 3 darts per turn; going below 0 busts (the whole turn reverts).
- Single-out: finish on exactly 0 with any dart.
- Double-out: finishing dart must be a double (bull 50 counts); finishing on a non-double, or
  leaving a score of 1, busts. A dart is a double when `multiplier === 2`; triple-25 is illegal.

## Conventions & constraints

- Follow the existing style: `<script setup lang="ts">`, composition API, dark slate/cyan
  theme, comments that explain *why*.
- This is a **touchscreen** app — keep tap targets ~44–48px minimum; don't shrink them.
- **Do not add dependencies** without approval. Pin **exact** versions (`1.2.3`) — no
  carets/tildes/ranges. Never hand-edit `package-lock.json`.
