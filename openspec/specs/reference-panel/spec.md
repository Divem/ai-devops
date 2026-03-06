## ADDED Requirements

### Requirement: Reference panel availability
The system SHALL provide a Reference panel in the DesignStudio right sidebar.

#### Scenario: Reference tab is visible
- **WHEN** user opens DesignStudio for a requirement
- **THEN** Reference tab shall be visible in the right panel

#### Scenario: Switch to Reference tab
- **WHEN** user clicks the Reference tab
- **THEN** the ReferencePanel component shall be displayed

### Requirement: Similar requirement recommendation
The system SHALL display similar historical requirements based on matching algorithm.

#### Scenario: Calculate similarity score
- **WHEN** ReferencePanel loads for a requirement
- **THEN** system shall calculate similarity score for all other requirements
- **AND** each matching tag shall add 10 points
- **AND** matching priority shall add 5 points

#### Scenario: Display top 5 similar requirements
- **WHEN** similarity scores are calculated
- **THEN** system shall display top 5 requirements with positive scores

#### Scenario: Display requirement details
- **WHEN** similar requirement is displayed
- **THEN** system shall show requirement ID, priority, title, description, and tags
- **AND** system shall display similarity percentage

### Requirement: Empty state handling
The system SHALL display appropriate message when no similar requirements exist.

#### Scenario: No similar requirements
- **WHEN** no requirements have positive similarity scores
- **THEN** system shall display "暂无相关历史需求" message

### Requirement: Requirement card interaction
The system SHALL allow viewing similar requirement details.

#### Scenario: Hover effect
- **WHEN** user hovers over a similar requirement card
- **THEN** card shall show accent border and shadow

#### Scenario: Click to view
- **WHEN** user clicks on a similar requirement card
- **THEN** system shall navigate to that requirement's detail view

### Requirement: Status badge display
The system SHALL indicate approval status of similar requirements.

#### Scenario: Display approved badge
- **WHEN** similar requirement has "approved" status
- **THEN** system shall display "已通过" badge
