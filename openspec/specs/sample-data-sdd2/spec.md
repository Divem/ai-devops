# sample-data-sdd2 Specification

## Purpose
TBD - created by archiving change add-sample-data-to-sdd2. Update Purpose after archive.
## Requirements
### Requirement: SDD2 sample data structure
The system SHALL include sample requirement data in the INITIAL_CARDS array of pm-ai-platform_sdd2.jsx file.

#### Scenario: Sample data loads correctly
- **WHEN** the SDD2 page loads
- **THEN** the INITIAL_CARDS array SHALL be rendered in the kanban board

### Requirement: Sample data contains 6 core function modules
The sample data SHALL contain requirements covering all 6 core function modules from PM_AI_Platform_PRD.md.

#### Scenario: All function modules represented
- **WHEN** sample data is loaded
- **THEN** the data SHALL include requirements for: Kanban view, AI clarification, Spec framework, Proposal generation, Proposal review, Git sync

### Requirement: Sample data has varied kanban column distribution
The sample requirements SHALL be distributed across different kanban columns.

#### Scenario: Requirements in different columns
- **WHEN** sample data is displayed
- **THEN** requirements SHALL appear in columns including: backlog, reviewing, ai_review, confirm, approved

### Requirement: Each sample card has complete fields
Each sample requirement card SHALL contain all required fields: id, col, priority, title, desc, tags, author, date, userStory, acceptanceCriteria.

#### Scenario: Complete card structure
- **WHEN** a card is rendered in the kanban
- **THEN** it SHALL display id, priority badge, title, tags, author, and date

### Requirement: Sample data uses unique titles
The sample data SHALL use new titles different from the original PRD document section names.

#### Scenario: Unique titles
- **WHEN** sample data is created
- **THEN** each title SHALL be rephrased to avoid direct copy from source document

