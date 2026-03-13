## ADDED Requirements

### Requirement: Chatbo shows preview-only controls
The Chatbo interface SHALL not provide Markdown preview input mode and MUST keep a single direct-edit input area for composing messages.

#### Scenario: Open Chatbo workspace
- **WHEN** a user opens the Chatbo panel
- **THEN** the UI displays one editable input box for direct typing
- **AND** the UI does not show Edit/Preview switching controls

#### Scenario: Send from input directly
- **WHEN** a user types message content in the input box and presses Enter
- **THEN** system SHALL send the message immediately to conversation history
- **AND** no preview confirmation step SHALL be required

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
