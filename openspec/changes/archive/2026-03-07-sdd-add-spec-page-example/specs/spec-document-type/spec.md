## ADDED Requirements

### Requirement: Spec document type definition
The system SHALL include `spec` as a document type in the `DOC_TYPES` array with the following properties:
- `key`: "spec"
- `label`: "需求规格说明"
- `icon`: "📝"
- `color`: "#8b5cf6"
- `group`: "product"

#### Scenario: DOC_TYPES array includes spec
- **WHEN** the application loads
- **THEN** the `DOC_TYPES` array contains 5 items including `spec`
- **AND** the spec item is positioned after `prd` and before `proposal`

### Requirement: Spec demo content constant
The system SHALL provide a `DEMO_SPEC_REVIEW` constant containing a complete specification document example based on the PRD's "提案评审与修改模块" (Proposal Review and Edit Module).

#### Scenario: Demo content is accessible
- **WHEN** the code references `DEMO_SPEC_REVIEW`
- **THEN** a valid markdown string is returned
- **AND** the content includes specification sections (概述、功能规格、UI规格、数据规格)
- **AND** the content covers review views (split-screen comparison, comments, version history) and editing tools (rich text editor, Markdown support, real-time preview)

### Requirement: Sample data includes spec content
At least one card in `INITIAL_CARDS` SHALL have `docs.spec` populated with demo content.

#### Scenario: Sample card has spec content
- **WHEN** REQ-005 card is rendered
- **THEN** `docs.spec` field contains the `DEMO_SPEC_REVIEW` content
- **AND** the spec document is viewable in the detail page

### Requirement: mkDocs function includes spec field
The `mkDocs()` helper function SHALL return an object with `spec: null` to initialize the docs object.

#### Scenario: Docs object includes spec field
- **WHEN** a new card is created using `mkDocs()`
- **THEN** the returned object contains `spec: null`
- **AND** all five document types (prd, spec, proposal, design, tasks) are present
