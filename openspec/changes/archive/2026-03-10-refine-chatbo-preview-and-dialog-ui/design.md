## Context

The Chatbo experience currently exposes an Edit/Preview toggle and uses a relatively heavy visual style for the drag divider and dialog framing lines. Product direction is to simplify the interaction model (preview-first) and reduce visual complexity while keeping existing chat behavior and rendering pipeline unchanged.

This project uses a React + inline-style pattern in large JSX files, so the design should minimize structural churn and focus on controlled UI updates in existing components.

## Goals / Non-Goals

**Goals:**
- Make Chatbo preview-first by removing Edit/Preview mode switching controls from the visible UI.
- Improve drag divider aesthetics with a thinner, cleaner vertical line while preserving drag affordance.
- Simplify dialog visual treatment by reducing dense line/border elements and improving hierarchy.
- Keep behavior and data flow stable, with no API or state model changes.

**Non-Goals:**
- No changes to backend APIs, chat message schema, or model invocation logic.
- No redesign of unrelated pages or global theming system.
- No new component library or third-party styling dependency.

## Decisions

1. Keep preview rendering path as the only presented mode in Chatbo UI.
   - Rationale: The requested workflow does not need mode toggling, and removing the toggle lowers cognitive load.
   - Alternative considered: Keep toggle but default to Preview; rejected because it still leaves unnecessary controls and visual clutter.

2. Preserve current drag interaction mechanics and reduce divider visual weight via style-only changes.
   - Rationale: Functional behavior remains familiar while visual polish improves immediately.
   - Alternative considered: Replace with a larger custom drag handle; rejected because it increases component complexity and may conflict with current layout constraints.

3. Simplify dialog framing by reducing redundant lines and relying on spacing + subtle border contrast.
   - Rationale: Cleaner hierarchy with less noise, while maintaining clear conversation boundaries.
   - Alternative considered: Keep current multi-line decoration and only adjust colors; rejected because complexity remains and does not address the root issue.

## Risks / Trade-offs

- [Users accustomed to explicit Edit mode may look for it] -> Mitigation: keep underlying preview content parity and ensure no missing features in normal usage.
- [Thinner divider may reduce discoverability for drag] -> Mitigation: maintain hover/active visual feedback and cursor affordance.
- [Dialog simplification might appear too minimal] -> Mitigation: keep enough contrast and spacing to preserve readability and section boundaries.
