## MODIFIED Requirements

### Requirement: Chat history persistence
The system SHALL maintain chat history per requirement card.

#### Scenario: Store chat message
- **WHEN** a user sends a message or receives an AI response
- **THEN** system shall store the message in the card's `chatHistory` array

#### Scenario: Chat history persists
- **WHEN** user switches between requirements and returns
- **THEN** previous chat history shall be displayed

#### Scenario: Persist demo clarification summary
- **WHEN** user submits the PRD demo clarification dialog successfully
- **THEN** system shall append one `clarification_summary` message to current card chat history
- **THEN** the message source shall be marked as demo path (e.g., `source: clarification_demo`)

### Requirement: AI conversation interface
The system SHALL provide a conversational interface for AI-assisted requirement analysis.

#### Scenario: Display welcome message
- **WHEN** user opens Chatbot panel
- **THEN** system shall display a welcome message explaining available features

#### Scenario: User sends message
- **WHEN** user types a message and clicks Send (or presses Enter)
- **THEN** system shall display the user message in the chat history
- **AND** system shall call Claude API with the message
- **AND** system shall display loading indicator

#### Scenario: Render demo clarification summary
- **WHEN** chat history contains `clarification_summary` message created from demo dialog
- **THEN** system shall render it with the same structured Q/A summary card style used by review confirmation path
