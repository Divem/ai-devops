## MODIFIED Requirements

### Requirement: Proposal folder rendering in document tree
The system SHALL render documents in `DocTreeSidebar` with fixed top-level requirement context, then proposal structures.

#### Scenario: Multi-proposal folder display
- **WHEN** a card has multiple proposals in `docs.proposals`
- **THEN** the document tree SHALL display top-level documents in this order:
  - 🧾 原始需求
  - 📋 产品需求 SPEC
  - 📁 OpenSpec 提案 (expandable folder)
- **AND** each proposal SHALL be rendered as a sub-folder
- **AND** each proposal folder SHALL contain 4 document items

#### Scenario: Single-proposal fallback
- **WHEN** a card has only one proposal
- **THEN** the system SHALL render in flat mode (no folder)
- **AND** top-level documents SHALL still show `原始需求` before `产品需求 SPEC`
- **AND** proposal documents SHALL display under the requirement card

#### Scenario: Folder expand/collapse interaction
- **WHEN** user clicks on a proposal folder
- **THEN** the folder SHALL toggle between expanded (📂) and collapsed (📁) states
- **AND** the expanded state SHALL persist during the session
