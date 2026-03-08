# Spec: Zhipu GLM Integration

## ADDED Requirements

### Requirement: Multiple AI model support
The system SHALL support multiple AI model providers (Anthropic Claude and Zhipu GLM) with a unified interface.

#### Scenario: Switch between Claude and GLM models
- **WHEN** user selects a different model in the settings panel
- **THEN** all subsequent AI requests use the selected model
- **AND** the selection persists across page refreshes

#### Scenario: Default model selection
- **WHEN** user accesses the application for the first time
- **THEN** Claude is selected as the default model

### Requirement: Zhipu GLM API integration
The system SHALL integrate with Zhipu GLM-4 API for AI-powered features.

#### Scenario: Generate PRD document using GLM
- **WHEN** user clicks "生成PRD" button with GLM model selected
- **THEN** system calls Zhipu GLM API with the appropriate prompt
- **AND** displays the generated content in the document editor

#### Scenario: AI review using GLM
- **WHEN** user triggers AI review with GLM model selected
- **THEN** system requests requirement analysis from GLM API
- **AND** displays the score and suggestions

### Requirement: Unified AI client interface
The system SHALL provide a unified client interface for all AI model providers.

#### Scenario: Consistent error handling
- **WHEN** any AI model API returns an error
- **THEN** system displays a user-friendly error message
- **AND** logs the technical error details to console

#### Scenario: Consistent response format
- **WHEN** AI model returns a successful response
- **THEN** system normalizes the response to a consistent format
- **AND** the UI components are agnostic to the underlying model

### Requirement: Zhipu API Key configuration
The system SHALL support multiple configuration methods for Zhipu API Key.

#### Scenario: Configure via environment variable
- **WHEN** developer sets `VITE_ZHIPU_API_KEY` in .env file
- **THEN** Vite applications use the configured API Key

#### Scenario: Configure via localStorage
- **WHEN** user sets API Key via browser console
- **THEN** system uses the localStorage value for all environments
- **AND** the value persists across sessions

#### Scenario: Configure via code constant
- **WHEN** developer sets `ZHIPU_API_KEY` constant in source code
- **THEN** system uses the constant as fallback

### Requirement: API Key security
The system SHALL protect API Keys from being committed to version control.

#### Scenario: .env files are ignored
- **WHEN** .env files exist in the project
- **THEN** .gitignore excludes them from version control

#### Scenario: Code constants are placeholder-only
- **WHEN** API Key constants are defined in source code
- **THEN** they contain empty strings or placeholder values
- **AND** documentation directs users to configure via .env or localStorage

### Requirement: Model-specific chat history
The system SHALL maintain separate chat history for each AI model.

#### Scenario: Independent conversations
- **WHEN** user switches from Claude to GLM
- **THEN** GLM chat history is displayed (empty if first use)
- **AND** Claude chat history is preserved for later use

#### Scenario: Model switching preserves context
- **WHEN** user switches back to a previously used model
- **THEN** the chat history from that session is restored
