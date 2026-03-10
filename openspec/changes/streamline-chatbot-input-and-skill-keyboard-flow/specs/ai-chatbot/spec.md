## MODIFIED Requirements

### Requirement: AI conversation interface
The system SHALL provide a conversational interface for AI-assisted requirement analysis, and SHALL use a direct-edit input box without preview mode.

#### Scenario: Display welcome message
- **WHEN** user opens Chatbot panel
- **THEN** system shall display a welcome message explaining available features

#### Scenario: User sends message
- **WHEN** user types a message and clicks Send (or presses Enter)
- **THEN** system shall display the user message in the chat history
- **AND** system shall call Claude API with the message
- **AND** system shall display loading indicator

#### Scenario: Render clarification summary message
- **WHEN** chat history contains a `clarification_summary` message
- **THEN** system shall render it as a structured summary card instead of plain text

#### Scenario: AI responds
- **WHEN** Claude API returns a response
- **THEN** system shall display the AI response in the chat history
- **AND** loading indicator shall be removed

#### Scenario: Enter sends and Shift+Enter creates newline
- **WHEN** input box is focused and user presses Enter without Shift
- **THEN** system shall send the current message directly
- **AND** user shall not need to switch to any preview mode before sending

- **WHEN** input box is focused and user presses Shift+Enter
- **THEN** system shall insert a newline and shall NOT send the message

#### Scenario: Skill panel keyboard behavior
- **WHEN** slash skill panel is open and user presses Tab
- **THEN** system shall return focus to the input box
- **AND** system shall NOT send any message

- **WHEN** slash skill panel is open and user presses Enter
- **THEN** system shall execute the highlighted skill item
- **AND** system shall send one corresponding message to chat history
