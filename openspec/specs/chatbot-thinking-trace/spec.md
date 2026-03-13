## ADDED Requirements

### Requirement: Chatbot thought-trace summary
The system SHALL provide a collapsible thought-trace summary for each assistant response in the Chatbot panel.

#### Scenario: Show collapsed trace summary
- **WHEN** assistant message is rendered with trace metadata
- **THEN** system shows a collapsed summary row with skill count, model name, and elapsed time

#### Scenario: Expand trace details
- **WHEN** user clicks the trace summary row
- **THEN** system expands and displays ordered execution steps including skill preparation, model request, and final result

### Requirement: Skill call visibility without reasoning disclosure
The system SHALL show skill execution metadata without exposing full internal reasoning content.

#### Scenario: Show skill metadata only
- **WHEN** trace includes a skill step
- **THEN** system displays skill id/name, template source, and variables used
- **AND** system MUST NOT display full prompt text or hidden reasoning transcript

### Requirement: Demo and failure trace clarity
The system SHALL label non-real-time responses and failed runs in the trace area.

#### Scenario: Demo fallback trace label
- **WHEN** assistant message source is fallback
- **THEN** trace summary shows a visible label indicating demo data is used

#### Scenario: Failure-to-fallback transition
- **WHEN** AI request fails and fallback response is written
- **THEN** trace detail records request failure and fallback generation as separate steps
