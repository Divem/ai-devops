## ADDED Requirements

### Requirement: Volc ARK model provider support
The system SHALL support Volcengine ARK Code Latest as a selectable AI provider through the unified AI client interface.

#### Scenario: Route request to ARK provider
- **WHEN** user-selected model is `ark`
- **THEN** `AIClient` SHALL instantiate the ARK provider and send requests through ARK API endpoint

#### Scenario: Preserve existing model routing
- **WHEN** user-selected model is `claude` or `glm`
- **THEN** system SHALL keep using existing providers without behavior change

### Requirement: ARK API request and response normalization
The system SHALL send ARK requests with OpenAI Completions-compatible payload and normalize responses to plain text.

#### Scenario: Successful ARK chat completion
- **WHEN** ARK API returns a successful completion response
- **THEN** system SHALL extract text from `choices[0].message.content`
- **AND** return the normalized string to upper-layer UI

#### Scenario: ARK API error handling
- **WHEN** ARK API returns error response or network failure
- **THEN** system SHALL raise a normalized error with type and message
- **AND** UI SHALL continue using the unified AI error handling flow

### Requirement: ARK API key configuration and persistence
The system SHALL allow configuring ARK API Key and persist it locally for subsequent ARK requests.

#### Scenario: Read ARK API key from local storage
- **WHEN** user has previously saved ARK API Key
- **THEN** provider SHALL read key from localStorage key `ai_model_ark_key`

#### Scenario: Missing ARK API key
- **WHEN** selected model is `ark` and no ARK API Key is available
- **THEN** system SHALL return a `no_api_key` error
- **AND** UI SHALL prompt user to configure API Key
