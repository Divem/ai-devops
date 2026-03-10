## ADDED Requirements

### Requirement: Chatbot panel availability
The system SHALL provide a Chatbot panel in the DesignStudio right sidebar.

#### Scenario: Chatbot tab is visible
- **WHEN** user opens DesignStudio for a requirement
- **THEN** Chatbot tab shall be visible in the right panel

#### Scenario: Switch to Chatbot tab
- **WHEN** user clicks the Chatbot tab
- **THEN** the ChatbotPanel component shall be displayed

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

#### Scenario: Render clarification summary message
- **WHEN** chat history contains a `clarification_summary` message
- **THEN** system shall render it as a structured summary card instead of plain text

#### Scenario: AI responds
- **WHEN** Claude API returns a response
- **THEN** system shall display the AI response in the chat history
- **AND** loading indicator shall be removed

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

### Requirement: Clarification summary rendering style
The system SHALL render clarification summary with grouped Q/A card style and long-text readability.

#### Scenario: Grouped Q/A card rendering
- **WHEN** a `clarification_summary` message is rendered in chat history
- **THEN** system shall group each question with its corresponding answer in card sections
- **AND** each grouped section shall preserve the original question and answer content

#### Scenario: Long text readability
- **WHEN** a question or answer contains long text
- **THEN** system shall keep text readable through wrapping and spacing without truncating core content

### Requirement: Context-aware AI prompts
The system SHALL include requirement context when calling Claude API.

#### Scenario: Include requirement details
- **WHEN** user sends a message
- **THEN** system shall include requirement title, description, user story, and acceptance criteria in the AI prompt

### Requirement: Error handling
The system SHALL handle API errors gracefully.

#### Scenario: API call fails
- **WHEN** Claude API call fails
- **THEN** system shall display an error toast notification
- **AND** user shall be able to retry

### Requirement: Loading state
The system SHALL show loading state during API calls.

#### Scenario: Disable input during loading
- **WHEN** API call is in progress
- **THEN** input field shall be disabled
- **AND** Send button shall be disabled
- **AND** loading spinner shall be displayed
