## ADDED Requirements

### Requirement: Vite dev server proxy for Anthropic API
The system SHALL configure a Vite dev server proxy that forwards all `/api/anthropic/*` requests to `https://api.anthropic.com/*`, enabling browser-side AI API calls without CORS errors.

#### Scenario: Proxy forwards request to Anthropic
- **WHEN** frontend sends a request to `/api/anthropic/v1/messages`
- **THEN** Vite proxy SHALL forward it to `https://api.anthropic.com/v1/messages` with correct headers

#### Scenario: No CORS error on AI review
- **WHEN** user clicks AI 智能评审
- **THEN** the request SHALL succeed without CORS preflight failure

### Requirement: ClaudeProvider uses relative API endpoint
The system SHALL use a relative URL `/api/anthropic/v1/messages` as the `ClaudeProvider.apiEndpoint`, so requests route through the Vite proxy rather than directly to Anthropic.

#### Scenario: API endpoint is relative
- **WHEN** ClaudeProvider is instantiated
- **THEN** `apiEndpoint` SHALL be `/api/anthropic/v1/messages`

#### Scenario: Request does not trigger CORS preflight
- **WHEN** ClaudeProvider sends a chat request
- **THEN** the request SHALL go to the same origin and not trigger browser CORS checks
