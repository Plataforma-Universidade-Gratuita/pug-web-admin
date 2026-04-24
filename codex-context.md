# PUG Web Admin Context

## Core rules

- Use `@/` for internal imports.
- Keep raw constant values under `constants/`.
- Keep types and interfaces under `types/`.
- Keep Zod schemas under `schemas/`.
- Keep React provider contexts under `contexts/`.
- Keep reusable component helper functions in `components/utils.ts`.

## Component structure

- Primitives live in `components/` and are grouped by context:
  - `actions`
  - `display`
  - `forms`
  - `navigation`
  - `overlays`
  - `structure`
- Public primitive exports go through `components/index.ts`.
- When adding a primitive, keep the same folder pattern already used by the other components.

## Styling system

- Standardize styling under `app/styles/`.
- Reusable component styling belongs in `app/styles/utilities/*.css`.
- Components should consume utility classes instead of carrying long visual class contracts inline.
- Toasts are the special case: keep their Sonner-specific styling in the dedicated toast utility file and wrapper component.
- App-shell specific styling belongs in `app/styles/utilities/app-shell.css`.

## Data and validation

- API-layer schemas stay under `schemas/api`.
- Client-only schemas stay under `schemas/client`.
- UI and app types stay under `types/client`.
- API route bases are centralized in `constants/api.ts`.

## Primitive conventions

- Support disabled visuals and logic whenever the primitive exposes `disabled`.
- Prefer controlled/uncontrolled APIs that mirror Radix or native behavior cleanly.
- Keep helper logic out of component files when it is reusable or non-trivial.
- Keep public primitive APIs exported from the shared barrels.

## Docs conventions

- Every primitive should have a matching docs particle under `features/docs/particles`.
- New primitives should be exported from `features/docs/index.ts` and rendered on the docs page.
- Particles should demonstrate meaningful states, including disabled variants when relevant.

## Current patterns to preserve

- `sonner` is wrapped by the local toast primitive instead of being used directly in feature code.
- `Select` context is centralized in `contexts/select.tsx`.
- Login/auth page visuals use the shared app-shell utility classes.
- Navbar and sidebar visuals should keep using the shared shell utility classes instead of ad hoc inline styling.

## When extending the project

- Reuse existing utility classes before introducing new one-off class strings.
- If a new visual pattern repeats, promote it into `app/styles/utilities`.
- If a new static config appears, move it into `constants/` instead of leaving it in a feature or component file.
- If a new schema or type appears outside its folder, move it before building on top of it.
