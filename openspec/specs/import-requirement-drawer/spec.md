## ADDED Requirements

### Requirement: New requirement button with dropdown
The system SHALL display a dropdown menu when the user clicks the new requirement button.

#### Scenario: Click new requirement button shows dropdown
- **WHEN** user clicks the new requirement button
- **THEN** a dropdown menu SHALL appear below the button

#### Scenario: Dropdown menu options
- **WHEN** dropdown is open
- **THEN** the menu SHALL show two options: "新建需求" and "导入需求"

#### Scenario: Click outside closes dropdown
- **WHEN** dropdown is open and user clicks outside of it
- **THEN** the dropdown SHALL close

### Requirement: Import requirement drawer
The system SHALL display a drawer when user clicks "导入需求" option.

#### Scenario: Open import drawer
- **WHEN** user clicks "导入需求" option
- **THEN** a drawer SHALL slide in from the right side of the screen

#### Scenario: Drawer close
- **WHEN** user clicks the close button or clicks outside the drawer
- **THEN** the drawer SHALL close

#### Scenario: Import drawer width
- **WHEN** user opens the import requirement drawer on desktop
- **THEN** the drawer width SHALL be 60% of viewport width

### Requirement: Import drawer tabs
The import drawer SHALL have two tabs: "URL 导入" and "从列表选择".

#### Scenario: URL import tab
- **WHEN** user selects "URL 导入" tab
- **THEN** the drawer SHALL show a URL input field

#### Scenario: List import tab
- **WHEN** user selects "从列表选择" tab
- **THEN** the drawer SHALL show space, iteration, and requirement selection controls

### Requirement: Space selection
The system SHALL allow user to select a space from a list of available spaces.

#### Scenario: Select space
- **WHEN** user clicks on a space option
- **THEN** the selected space SHALL be highlighted and the iteration list SHALL update

### Requirement: Iteration selection
The system SHALL allow user to select an iteration within the selected space.

#### Scenario: Select iteration
- **WHEN** user selects a space first, then clicks on an iteration
- **THEN** the selected iteration SHALL be highlighted and the requirement list SHALL update

### Requirement: Requirement list display
The system SHALL display a list of requirements for the selected space and iteration.

#### Scenario: Show requirements
- **WHEN** user has selected both space and iteration
- **THEN** a list of requirements SHALL be displayed

#### Scenario: Select requirement from list
- **WHEN** user clicks on a requirement in the list
- **THEN** the requirement SHALL be highlighted as selected
