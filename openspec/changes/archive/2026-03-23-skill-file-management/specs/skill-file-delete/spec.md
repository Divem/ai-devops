# Spec: Skill File Delete

## ADDED Requirements

### Requirement: Delete files in Skill editor
The system SHALL allow users to delete existing files from a Skill's file structure, except for SKILL.md.

#### Scenario: Delete button visibility for references/scripts
- **WHEN** user hovers over a reference or script file in the file tree
- **THEN** a delete (×) button appears next to the filename

#### Scenario: No delete for SKILL.md
- **WHEN** user views the SKILL.md file in the file tree
- **THEN** no delete button is shown

#### Scenario: Confirm deletion
- **WHEN** user clicks the delete button on a file
- **THEN** the file is immediately removed from the file structure
- **AND** if the deleted file was the active file, the view switches to SKILL.md

#### Scenario: Save after deletion
- **WHEN** user deletes a file and then clicks "保存"
- **THEN** the file is permanently removed from localStorage
