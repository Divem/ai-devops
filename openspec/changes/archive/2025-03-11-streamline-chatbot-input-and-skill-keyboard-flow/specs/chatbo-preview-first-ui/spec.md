## MODIFIED Requirements

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
