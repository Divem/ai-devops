## ADDED Requirements

### Requirement: Data structure for multiple proposals
The system SHALL support a new data structure `docs.proposals` array to store multiple OpenSpec proposals within a single requirement card.

#### Scenario: New proposal structure
- **WHEN** a requirement card contains multiple proposals
- **THEN** `docs.proposals` SHALL be an array of proposal objects
- **AND** each proposal object SHALL contain: `id`, `name`, `proposal`, `design`, `spec`, `tasks` fields
- **AND** `id` SHALL be a kebab-case unique identifier (e.g., "auth-system")
- **AND** `name` SHALL be a human-readable display name (e.g., "认证系统改造")

#### Scenario: Backward compatibility detection
- **WHEN** the system loads a card with legacy `docs.{spec,proposal,design,tasks}` structure
- **THEN** the system SHALL automatically normalize to the new structure
- **AND** the normalized structure SHALL create a single proposal with id="default"

### Requirement: Proposal folder rendering in document tree
The system SHALL render proposals as collapsible folders in the `DocTreeSidebar` component.

#### Scenario: Multi-proposal folder display
- **WHEN** a card has multiple proposals in `docs.proposals`
- **THEN** the document tree SHALL display:
  - 📋 产品需求 SPEC (at top level)
  - 📁 OpenSpec 提案 (expandable folder)
- **AND** each proposal SHALL be rendered as a sub-folder
- **AND** each proposal folder SHALL contain 4 document items

#### Scenario: Single-proposal fallback
- **WHEN** a card has only one proposal
- **THEN** the system SHALL render in flat mode (no folder)
- **AND** documents SHALL display directly under the requirement card

#### Scenario: Folder expand/collapse interaction
- **WHEN** user clicks on a proposal folder
- **THEN** the folder SHALL toggle between expanded (📂) and collapsed (📁) states
- **AND** the expanded state SHALL persist during the session

### Requirement: Document types within proposal folders
Each proposal folder SHALL display 4 document items with correct icons and labels.

#### Scenario: Proposal folder contents
- **WHEN** a proposal folder is expanded
- **THEN** the following items SHALL be visible:
  - 💡 Proposal
  - 🏗 Design
  - 📝 Delta Spec
  - ✅ Tasks

#### Scenario: Document selection
- **WHEN** user clicks on a document item within a proposal folder
- **THEN** the document editor SHALL display the content
- **AND** the document path SHALL reflect the proposal context (e.g., "auth-system / Proposal")

### Requirement: Proposal sorting and organization
The system SHALL support proposal organization with configurable sorting options.

#### Scenario: Default proposal order
- **WHEN** multiple proposals exist
- **THEN** proposals SHALL be displayed in array order
- **AND** the order SHALL match the `docs.proposals` array sequence

#### Scenario: Proposal metadata display
- **WHEN** a proposal folder is rendered
- **THEN** the folder label SHALL display the proposal `name`
- **AND** the proposal `id` MAY be displayed as a subtitle

### Requirement: Document content association
The system SHALL correctly associate document content with its proposal.

#### Scenario: Content retrieval by proposal and type
- **WHEN** user selects a document from a proposal
- **THEN** the system SHALL retrieve content from `docs.proposals[i][docType]`
- **WHERE** `i` is the proposal index and `docType` is one of: `proposal`, `design`, `spec`, `tasks`

#### Scenario: Empty document handling
- **WHEN** a proposal document field is `null` or `undefined`
- **THEN** the document item SHALL still be visible in the tree
- **AND** clicking it SHALL display empty state in the editor
