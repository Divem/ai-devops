## 1. Data Structure Updates

- [x] 1.1 Update `mkDocs()` function to initialize `chatHistory` as empty array
- [x] 1.2 Add `chatHistory: []` to all cards in `INITIAL_CARDS`
- [x] 1.3 Update `AddCardModal` to initialize `chatHistory` for new cards

## 2. RightPanel Component

- [x] 2.1 Create `RightPanel` component with dual TAB (Chatbot / Reference)
- [x] 2.2 Add TAB state management and switching logic
- [x] 2.3 Style TAB bar with active/inactive states

## 3. ChatbotPanel Component

- [x] 3.1 Create `ChatbotPanel` component with header, messages area, and input
- [x] 3.2 Implement welcome message display
- [x] 3.3 Add message list rendering (user and assistant messages)
- [x] 3.4 Implement input field with Enter key support
- [x] 3.5 Add Send button with loading state handling
- [x] 3.6 Style chat messages (user right-aligned, assistant left-aligned)

## 4. ReferencePanel Component

- [x] 4.1 Create `ReferencePanel` component with header and list area
- [x] 4.2 Implement similarity scoring algorithm (tags +10, priority +5)
- [x] 4.3 Add Top 5 filtering and sorting logic
- [x] 4.4 Create requirement card item component with hover effect
- [x] 4.5 Display requirement ID, priority badge, title, description, tags
- [x] 4.6 Add similarity percentage display
- [x] 4.7 Show "已通过" badge for approved requirements
- [x] 4.8 Implement empty state ("暂无相关历史需求")

## 5. AI Integration

- [x] 5.1 Create `handleSendMessage` function in main component
- [x] 5.2 Implement Claude API call with requirement context
- [x] 5.3 Add prompt template with title, description, user story, acceptance criteria
- [x] 5.4 Update card with new messages in `chatHistory`
- [x] 5.5 Add error handling with toast notification
- [x] 5.6 Implement loading state (disable input, show spinner)

## 6. DesignStudio Integration

- [x] 6.1 Add `rightTab` state to DesignStudio component
- [x] 6.2 Integrate `RightPanel` into DesignStudio layout (right side)
- [x] 6.3 Pass `currentCard`, `allCards`, `onTabChange`, `onSendMessage` props to RightPanel
- [x] 6.4 Adjust layout to accommodate three-column design (doc tree, editor, right panel)

## 7. Import and Export

- [x] 7.1 Add `useRef` import for chat scroll-to-bottom functionality
- [x] 7.2 Export new components (if needed for testing)

## 8. Testing

- [ ] 8.1 Test ChatbotPanel: send message, receive response, view history
- [ ] 8.2 Test ReferencePanel: similarity calculation, empty state, card display
- [ ] 8.3 Test TAB switching between Chatbot and Reference
- [ ] 8.4 Test error handling (API failure scenario)
- [ ] 8.5 Test chat history persistence when switching requirements
