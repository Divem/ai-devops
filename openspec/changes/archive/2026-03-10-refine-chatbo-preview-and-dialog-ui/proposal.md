## Why

The current Chatbo workspace includes mode-toggle controls that are not needed in the target workflow, and several visual details (drag divider thickness and dialog line treatment) make the interface feel heavy. This change improves clarity and perceived quality by simplifying interaction and reducing visual noise.

## What Changes

- Remove the Edit/Preview toggle buttons from Chatbo and show preview mode by default.
- Refine the draggable vertical divider to a thinner, lighter visual style while keeping drag usability.
- Simplify dialog UI styling by reducing overly complex line treatments and improving overall visual consistency.
- Preserve existing chat behavior and content rendering logic; this is a presentation-layer refinement.

## Capabilities

### New Capabilities
- `chatbo-preview-first-ui`: Defines a preview-first Chatbo interface with cleaner panel and dialog visuals.

### Modified Capabilities
- None.

## Impact

- Affected code: Chatbo view components, dialog container/panel styling, drag handle styles in the main frontend app.
- APIs: No backend or external API changes.
- Dependencies: No new dependencies required.
- Systems: Frontend-only UI/UX adjustment in existing React application.
