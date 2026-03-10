## MODIFIED Requirements

### Requirement: Chat history persistence
The system SHALL maintain chat history per requirement card, including user/assistant messages and clarification summary messages generated after confirmation dialog submission.

#### Scenario: Store chat message
- **WHEN** a user sends a message or receives an AI response
- **THEN** system shall store the message in the card's `chatHistory` array

#### Scenario: Chat history persists
- **WHEN** user switches between requirements and returns
- **THEN** previous chat history shall be displayed

#### Scenario: Append clarification summary message
- **WHEN** user submits clarification dialog successfully
- **THEN** system shall append one clarification summary message to current card `chatHistory`
- **THEN** the summary shall include paired Q/A content for all answered questions in that submission

### Requirement: Clarification summary rendering style
The system SHALL render clarification summary messages in the Chatbot panel using a structured Q/A card style distinct from normal free-text messages.

#### Scenario: Render grouped Q/A card
- **WHEN** chatbot displays a clarification summary message
- **THEN** system shall render each question and answer as grouped blocks with clear visual hierarchy

#### Scenario: Preserve readability for long answers
- **WHEN** an answer contains long text or multiline content
- **THEN** system shall preserve line breaks and wrapping without breaking chat layout
