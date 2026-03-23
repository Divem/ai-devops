# Spec: Skill Tab Integration

## ADDED Requirements

### Requirement: Skill management as navigation tab
The system SHALL display Skill management as a tab in the main top navigation, alongside "需求评审看板" and "数据概览".

#### Scenario: Tab visibility
- **WHEN** the main page is loaded
- **THEN** the top navigation SHALL show three tabs: 需求评审看板, 数据概览, Skill 管理

#### Scenario: Switch to Skill management tab
- **WHEN** user clicks "Skill 管理" tab
- **THEN** the top navigation remains unchanged and the Skill management content is shown below it

#### Scenario: Tab highlight
- **WHEN** user is on the Skill 管理 tab
- **THEN** the "Skill 管理" tab SHALL have the same active styling (white text + accent underline) as other tabs

#### Scenario: Switch away from Skill tab
- **WHEN** user clicks "需求评审看板" or "数据概览" while on Skill 管理 tab
- **THEN** the corresponding content replaces the Skill management content, navigation stays the same

### Requirement: No separate page shell for Skill management
The system SHALL NOT render a separate header or back button for the Skill management view.

#### Scenario: No back button
- **WHEN** Skill management content is displayed
- **THEN** there SHALL be no "返回" button or separate header bar — only the shared top navigation
