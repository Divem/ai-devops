## ADDED Requirements

### Requirement: Chatbo shows preview-only controls
The Chatbo interface SHALL not display Edit/Preview toggle buttons and MUST present preview rendering as the default visible mode.

#### Scenario: Open Chatbo workspace
- **WHEN** a user opens the Chatbo panel
- **THEN** the UI displays preview content directly without showing Edit/Preview toggle controls

### Requirement: Drag divider uses refined thin visual style
The vertical drag divider between Chatbo panels SHALL use a thinner and visually lighter line than the previous style, while preserving drag functionality.

#### Scenario: Adjust panel width by dragging divider
- **WHEN** a user hovers and drags the vertical divider
- **THEN** the divider remains draggable and uses the refined thin-line style during idle, hover, and active states

### Requirement: Dialog framing is visually simplified
The chat dialog container and message framing SHALL reduce unnecessary line complexity and MUST keep readable visual hierarchy through spacing and subtle border contrast.

#### Scenario: View conversation thread
- **WHEN** a user views a conversation containing multiple dialog items
- **THEN** the dialog UI appears cleaner with reduced line clutter while message grouping and readability remain clear
