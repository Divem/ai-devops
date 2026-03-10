## 1. Chatbo Preview-First Controls

- [x] 1.1 Locate Chatbo mode toggle UI and remove Edit/Preview button rendering from the visible toolbar.
- [x] 1.2 Ensure Chatbo uses preview rendering path as default visible behavior without introducing mode-switch state regressions.
- [x] 1.3 Validate that existing chat content display and interactions remain unchanged after control removal.

## 2. Drag Divider Visual Refinement

- [x] 2.1 Update vertical drag divider style tokens (width, color/opacity, and state styles) to a thinner visual treatment.
- [x] 2.2 Keep cursor, hover, and active drag affordance clear so divider remains discoverable and usable.
- [x] 2.3 Verify divider drag behavior still resizes panels correctly on desktop and common viewport widths.

## 3. Dialog UI Simplification

- [x] 3.1 Audit dialog container/message line decorations and identify redundant border/line styles.
- [x] 3.2 Apply simplified border and spacing styles to reduce visual clutter while preserving message hierarchy.
- [x] 3.3 Review conversation readability (grouping, contrast, spacing) and tune style values for a clean but clear presentation.

## 4. Validation and Regression Check

- [x] 4.1 Run project lint/build checks relevant to the touched app and fix any style or runtime issues introduced by UI changes.
- [x] 4.2 Perform manual UI verification of Chatbo preview-first behavior, thinner divider, and simplified dialog styling.
- [x] 4.3 Document any follow-up polish items discovered during verification.

## Follow-up Notes

- Repository contains pre-existing lint errors in `pm-ai-app/src/PMPlatform.jsx` unrelated to this UI change; `npm run build` passes.
