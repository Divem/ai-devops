# Spec: Skill Inline Editor

## ADDED Requirements

### Requirement: Inline skill editing from management page
The system SHALL provide an inline editing view within the Skill management page, allowing users to edit a Skill's files without leaving the page.

#### Scenario: Open editor from card
- **WHEN** user clicks "编辑" on a Skill card in the management page
- **THEN** the card list is replaced by an editing panel for the selected Skill

#### Scenario: Editor layout
- **WHEN** the editing panel is shown
- **THEN** it SHALL display: file structure tree on the left (SKILL.md / references / scripts), file content editor on the right, and available placeholder tags above the editor

#### Scenario: Edit file content
- **WHEN** user modifies content in the editor textarea
- **THEN** changes are tracked in local state until explicitly saved

#### Scenario: Save changes
- **WHEN** user clicks "保存"
- **THEN** the Skill config is saved to `localStorage['ai_skill_prompts']` and a success indicator is shown

#### Scenario: Restore default
- **WHEN** user clicks "恢复默认" for a customized Skill
- **THEN** the Skill's files are reset to built-in defaults and the editor shows the default content

#### Scenario: Return to list
- **WHEN** user clicks the back button in the editing panel
- **THEN** the editing panel is hidden and the Skill card list is shown, preserving filter state

#### Scenario: Switch files within editor
- **WHEN** user clicks a different file in the file structure tree (e.g., from SKILL.md to references/context.md)
- **THEN** the editor displays the content of the newly selected file

### Requirement: Remove settings page redirect
The system SHALL NOT redirect to the project settings page when editing a Skill from the management page.

#### Scenario: Edit button behavior
- **WHEN** user clicks "编辑" on a Skill card
- **THEN** the inline editor opens within the same page (NOT navigating to project settings)
