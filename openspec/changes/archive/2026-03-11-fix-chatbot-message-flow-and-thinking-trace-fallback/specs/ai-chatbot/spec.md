## MODIFIED Requirements

### Requirement: AI conversation interface
The system SHALL provide a conversational interface for AI-assisted requirement analysis.

#### Scenario: Display welcome message
- **WHEN** user opens Chatbot panel
- **THEN** system shall display a welcome message explaining available features

#### Scenario: User sends message
- **WHEN** user types a message and clicks Send (or presses Enter)
- **THEN** system shall immediately display the user message in the chat history before AI response returns
- **AND** system shall immediately clear the input value
- **AND** system shall insert an assistant "thinking" placeholder message in the same conversation
- **AND** system shall call Claude API with the message

#### Scenario: Render clarification summary message
- **WHEN** chat history contains a `clarification_summary` message
- **THEN** system shall render it as a structured summary card instead of plain text

#### Scenario: AI responds
- **WHEN** Claude API returns a response
- **THEN** system shall replace the related "thinking" placeholder with the final assistant response in-place
- **AND** system shall preserve message order for concurrent sends by matching message id/request id

### Requirement: Chat history persistence
The system SHALL maintain chat history per requirement card.

#### Scenario: Store chat message
- **WHEN** a user sends a message or receives an AI response
- **THEN** system shall store the message in the card's `chatHistory` array

#### Scenario: Chat history persists
- **WHEN** user switches between requirements and returns
- **THEN** previous chat history shall be displayed

#### Scenario: Persist clarification summary after successful submit
- **WHEN** user submits the clarification dialog successfully
- **THEN** system shall append one `clarification_summary` message to current card `chatHistory`
- **AND** the appended message order shall follow existing history order (append-only at tail)

#### Scenario: Persist message status and source
- **WHEN** system writes thinking, success, failure, or fallback messages
- **THEN** each message shall persist type/status/source metadata in chat history for rendering continuity

### Requirement: Error handling
The system SHALL handle API errors gracefully.

#### Scenario: API call fails
- **WHEN** Claude API call fails
- **THEN** system shall display an error toast notification
- **AND** system shall write a visible assistant fallback or error message into the conversation
- **AND** user shall be able to retry

### Requirement: Loading state
The system SHALL show loading state during API calls.

#### Scenario: Disable input during loading
- **WHEN** API call is in progress for the current send action
- **THEN** input field shall be disabled
- **AND** Send button shall be disabled
- **AND** loading spinner shall be displayed on the in-flight assistant placeholder
