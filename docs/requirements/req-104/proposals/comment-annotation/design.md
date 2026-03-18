# Design: 评论批注系统

## 组件设计

### CommentOverlay
- 叠加在文档编辑器右侧
- 每条批注以卡片形式显示
- 与文档段落对齐（基于行号）

### CommentThread
- 支持多级回复（最多 3 级）
- 显示作者头像、时间、状态
- 状态切换：待解决 ↔ 已解决

## 数据模型

```typescript
interface Comment {
  id: string;
  proposalId: string;
  docType: "proposal" | "design" | "spec" | "tasks";
  lineStart: number;
  lineEnd: number;
  content: string;
  author: string;
  status: "pending" | "resolved";
  replies: Reply[];
  createdAt: string;
}
```

## API

- GET /api/proposals/:id/comments
- POST /api/proposals/:id/comments
- PATCH /api/comments/:id/status