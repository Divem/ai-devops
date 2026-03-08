## ADDED Requirements

### Requirement: Settings dropdown button on kanban page
The system SHALL display a settings icon button in the top-right corner of the kanban page.

#### Scenario: Settings button visible to logged-in user
- **WHEN** a logged-in user views the kanban page
- **THEN** a settings icon button SHALL be visible in the top-right corner

#### Scenario: Settings button not visible to logged-out user
- **WHEN** a logged-out user views the kanban page
- **THEN** the settings button SHALL not be displayed

### Requirement: Settings dropdown menu
When the settings button is clicked, the system SHALL display a dropdown menu with the following options:
- Account info (showing user avatar, name, email)
- Project settings (navigates to project settings page)
- Logout (clears login state and redirects to login page)

#### Scenario: Open settings dropdown
- **WHEN** user clicks the settings icon button
- **THEN** a dropdown menu SHALL appear below the button

#### Scenario: Display account info in dropdown
- **WHEN** user opens the settings dropdown
- **THEN** the dropdown SHALL show current user's avatar, name, and email

#### Scenario: Navigate to project settings
- **WHEN** user clicks "Project settings" option
- **THEN** the system SHALL navigate to the project settings page

#### Scenario: Logout
- **WHEN** user clicks "Logout" option
- **THEN** the system SHALL clear the login state and redirect to the login page

### Requirement: Close dropdown
The dropdown menu SHALL close when clicking outside of it.

#### Scenario: Close dropdown by clicking outside
- **WHEN** the dropdown is open and user clicks outside of it
- **THEN** the dropdown SHALL close
