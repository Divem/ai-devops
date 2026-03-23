# Spec: Skill Import

## ADDED Requirements

### Requirement: Import Skill from JSON file
The system SHALL allow users to import a Skill configuration from a local JSON file in the Skill management page.

#### Scenario: Import button visibility
- **WHEN** user is on the Skill management list page
- **THEN** there SHALL be an "导入" button next to the "导出全部" button

#### Scenario: Select file to import
- **WHEN** user clicks the "导入" button
- **THEN** a file picker dialog opens allowing selection of JSON files

#### Scenario: Successful import
- **WHEN** user selects a valid Skill JSON file
- **THEN** the Skill configuration is loaded and saved to localStorage
- **AND** the Skill list refreshes to show the imported Skill as "已自定义"

#### Scenario: Invalid file format
- **WHEN** user selects a file that is not valid JSON or missing required fields
- **THEN** an error message is displayed and no data is imported

#### Scenario: Duplicate Skill ID
- **WHEN** the imported Skill ID already exists
- **THEN** the existing Skill is overwritten with the imported configuration
