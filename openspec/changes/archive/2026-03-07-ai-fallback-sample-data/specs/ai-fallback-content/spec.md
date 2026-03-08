## ADDED Requirements

### Requirement: AI fallback content display
When AI document generation request fails, the system SHALL display pre-configured fallback sample content instead of error message.

#### Scenario: AI request fails
- **GIVEN** the user clicks on a document type (PRD/Proposal/Design/Spec/Tasks) 
- **WHEN** the AI API request fails (network error, rate limit, invalid key, etc.)
- **THEN** the system SHALL display the fallback sample content for that document type
- **AND** display a warning message "⚠️ AI 暂时不可用，以下为示例内容" at the top

#### Scenario: Initial card has sample data
- **GIVEN** REQ-001 is displayed in the kanban
- **WHEN** the user clicks on REQ-001 to view details
- **THEN** the document tree SHALL show all document types with pre-filled content
- **AND** no AI API call is needed to view the content

### Requirement: Fallback content structure
The fallback content SHALL be structured according to OpenSpec format.

#### Scenario: PRD fallback content
- **GIVEN** AI request for PRD fails
- **WHEN** fallback content is displayed
- **THEN** the content SHALL include: 产品概述、功能需求、验收标准 sections

#### Scenario: Proposal fallback content
- **GIVEN** AI request for Proposal fails
- **WHEN** fallback content is displayed
- **THEN** the content SHALL include: Intent, Scope, Approach sections

#### Scenario: Design fallback content
- **GIVEN** AI request for Design fails
- **WHEN** fallback content is displayed
- **THEN** the content SHALL include: Technical Solution, API Definitions, Architecture sections

### Requirement: Fallback data constant
The system SHALL include a FALLBACK_DOCS constant containing sample content for all document types.

#### Scenario: Fallback constant defined
- **GIVEN** PMPlatform.jsx loads
- **WHEN** the component mounts
- **THEN** FALLBACK_DOCS object SHALL be available with keys: prd, proposal, design, spec, tasks

#### Scenario: Fallback content accessible
- **GIVEN** FALLBACK_DOCS is defined
- **WHEN** AI request fails
- **THEN** FALLBACK_DOCS[type] SHALL be returned as the result
