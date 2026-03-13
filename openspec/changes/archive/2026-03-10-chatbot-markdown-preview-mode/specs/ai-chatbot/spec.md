## ADDED Requirements

### Requirement: Chatbot 输入区 Markdown 预览模式
The system SHALL provide edit/preview modes for composing Chatbot messages in Markdown.

#### Scenario: Switch to preview mode
- **WHEN** user clicks the preview toggle in Chatbot input area
- **THEN** system shall render current draft content as Markdown preview

#### Scenario: Switch back to edit mode
- **WHEN** user clicks the edit toggle from preview mode
- **THEN** system shall restore editable textarea with the same draft content

#### Scenario: Empty preview content
- **WHEN** draft content is empty in preview mode
- **THEN** system shall show an empty-state hint instead of blank area

### Requirement: Assistant message Markdown rendering
The system SHALL render assistant Chatbot messages with Markdown formatting.

#### Scenario: Render markdown syntax
- **WHEN** assistant message content includes markdown syntax (heading/list/code block)
- **THEN** system shall render formatted output in the message bubble

#### Scenario: Markdown render fallback
- **WHEN** markdown rendering fails for a message
- **THEN** system shall fall back to plain text rendering without breaking the conversation panel

### Requirement: Send behavior with preview mode
The system SHALL keep send behavior consistent when preview mode is enabled.

#### Scenario: Send from preview mode
- **WHEN** user sends message while preview mode is active
- **THEN** system shall send the original draft markdown text as message content
- **THEN** system shall clear draft input after send
- **THEN** system shall switch input mode back to edit mode

#### Scenario: Keyboard behavior in edit mode
- **WHEN** user is in edit mode and presses Enter
- **THEN** system shall follow defined send shortcut behavior and preserve multiline input capability
