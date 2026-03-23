# Spec: Skill File Upload

## ADDED Requirements

### Requirement: Add new files in Skill editor
The system SHALL allow users to add new files to a Skill's file structure within the inline editor.

#### Scenario: Add file button
- **WHEN** user is in the Skill inline editor view
- **THEN** there SHALL be a "+ 添加文件" button below the file tree

#### Scenario: Add reference file
- **WHEN** user clicks "+ 添加文件" and enters a filename
- **AND** selects "references" as the location
- **THEN** a new empty file is created at `references/{filename}`

#### Scenario: Add script file
- **WHEN** user clicks "+ 添加文件" and enters a filename
- **AND** selects "scripts" as the location
- **THEN** a new empty file is created at `scripts/{filename}`

#### Scenario: Filename validation
- **WHEN** user enters a filename with invalid characters
- **THEN** the system displays a validation error and prevents creation
- **AND** only alphanumeric characters, hyphens, and dots are allowed
