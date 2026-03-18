# Design: 提案评审与修改模块

## Components
- ReviewEditor: 在线 Markdown 编辑器
- VersionManager: 版本快照管理
- DiffEngine: 分屏对比引擎
- CommentService: 评论批注服务

## Data Model
- ProposalVersion: id, proposal_id, version, content, created_by
- Comment: id, proposal_id, line_start, line_end, content, author

## API
- GET /api/v1/proposals/:id/versions
- POST /api/v1/proposals/:id/versions
- GET /api/v1/proposals/:id/versions/:v1/diff/:v2