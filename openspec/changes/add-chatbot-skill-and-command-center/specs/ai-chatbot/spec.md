## MODIFIED Requirements

### Requirement: AI conversation interface
The system SHALL provide a conversational interface for AI-assisted requirement analysis, and SHALL support slash-triggered skill/command invocation.

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

#### Scenario: Slash trigger opens skill and command panel
- **WHEN** user input starts with `/`
- **THEN** system shall open a skill/command panel near the input area
- **AND** panel entries shall support keyboard selection and Enter confirm

#### Scenario: Selecting skill creates executable user request
- **WHEN** user selects a skill from the slash panel
- **THEN** system shall generate a structured user request from the selected skill template
- **AND** system shall submit it through the existing chatbot send pipeline
