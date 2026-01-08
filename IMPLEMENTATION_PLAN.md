# Side-by-Side Interface Implementation Plan

## Overview
Transform the current vertical layout (chat at top, browse below) into a side-by-side interface where:
- **Left Panel**: Chat interface (always visible)
- **Right Panel**: Tabbed interface (Workflow/Toolbox + Tool integration tabs)

---

## Phase 1: Layout & Structure Changes

### 1.1 Create New Split Layout Component
**File**: `packages/frontend/src/components/SplitLayout.tsx`
- Replace current vertical layout in `SolutionSearch.tsx`
- Left: ChatInterface (fixed width or flexible)
- Right: RightPanel component with tabs
- Responsive: Stack vertically on mobile (< 1024px)

### 1.2 Create Right Panel Component
**File**: `packages/frontend/src/components/RightPanel.tsx`
- Tab navigation at top (horizontal tabs like IDE)
- Default tab: "Workflow" (shows workflow/toolbox)
- Additional tabs: Individual tool integration flows
- Tab management:
  - Add/remove tabs
  - Close buttons on tabs (except default)
  - Active tab highlighting
  - Tab reordering (optional, nice-to-have)

### 1.3 Update App Layout
**File**: `packages/frontend/src/App.tsx`
- Remove `/tools/:toolId` route (tool guides now in tabs)
- Keep route for deep linking: `/tools/:toolId` opens in a new tab

---

## Phase 2: Workflow Tab Integration

### 2.1 Integrate WorkflowPanel into Right Panel
**File**: `packages/frontend/src/components/WorkflowTab.tsx`
- Move current `WorkflowPanel` logic here
- Remove slide-out behavior
- Always visible as first tab "Workflow"
- Show 5 workflow stages with tools
- "Add Tool" buttons that open tool tabs

### 2.2 Update WorkflowContext
**File**: `packages/frontend/src/context/WorkflowContext.tsx`
- Remove `isOpen`, `openPanel`, `closePanel`, `togglePanel` (no longer needed)
- Keep all other functionality (add/remove tools, persistence)

---

## Phase 3: Tool Tab System

### 3.1 Create Tab Context/State Management
**File**: `packages/frontend/src/context/TabContext.tsx`
- Manage active tab
- Manage open tabs array
- Tab structure:
  ```typescript
  interface ToolTab {
    id: string; // unique tab ID
    type: 'workflow' | 'tool';
    toolId?: string; // for tool tabs
    title: string;
    isActive: boolean;
    canClose: boolean; // workflow tab can't be closed
  }
  ```
- Functions:
  - `openToolTab(toolId: string)`
  - `closeTab(tabId: string)`
  - `setActiveTab(tabId: string)`
  - `getActiveTab()`

### 3.2 Update Chat Interface
**File**: `packages/frontend/src/components/ChatInterface.tsx`
- When AI recommends tool via `[[TOOL:tool-id]]`, clicking opens tool tab
- Tool cards in chat become clickable → open tool tab
- No navigation away from chat

### 3.3 Update ToolCard Component
**File**: `packages/frontend/src/components/ToolCard.tsx`
- Clicking opens tool tab (not navigation)
- "Add to Toolbox" button still works
- "View Setup" → opens tool tab

---

## Phase 4: Interactive Tool Integration Flow

### 4.1 Create ToolTab Component
**File**: `packages/frontend/src/components/ToolTab.tsx`
- Interactive step-by-step wizard
- Visual progress indicator (top bar)
- Step navigation (previous/next)
- Current step highlighted

### 4.2 Create Step Components
**File**: `packages/frontend/src/components/tool-integration/`
- `StepHeader.tsx` - Step title, number, progress
- `StepContent.tsx` - Wrapper for step content
- `StepActions.tsx` - Previous/Next/Complete buttons
- `VisualGuide.tsx` - Component for screenshots/images

### 4.3 Tool Setup Flow Structure
Each tool tab shows an interactive wizard:

**Step 1: Overview & Prerequisites**
- Tool info (name, description, pricing)
- Prerequisites checklist (interactive checkboxes)
- "I'm ready" button to proceed

**Step 2-N: Setup Steps** (from guides.ts)
- Each step from guide becomes wizard step
- Visual elements:
  - Screenshot placeholder (for now, later add actual images)
  - Step-by-step instructions with checkboxes
  - Embedded iframe for OAuth flows (where applicable)
  - "Mark as complete" checkbox
  - Code snippets in formatted blocks (if applicable)

**Final Step: Integration Complete**
- Success message
- "Add to Workflow" button (if not already added)
- "Test Connection" button (for OAuth tools)
- Links to tool's website/docs

### 4.4 Progress Tracking
- Track completed steps per tool (localStorage)
- Save progress when user closes tab
- Resume from last incomplete step when reopening tab

**File**: `packages/frontend/src/context/ToolProgressContext.tsx`
```typescript
interface ToolProgress {
  toolId: string;
  completedSteps: number[];
  lastActiveStep: number;
  completedAt?: string;
}
```

---

## Phase 5: Visual Enhancements

### 5.1 Screenshot Support
- Add screenshot/image support to guide steps
- Placeholder system for now:
  - Checkbox in guide data: `hasScreenshot: boolean`
  - Path: `assets/tool-screenshots/{toolId}/step-{n}.png`
- Later: Client provides actual screenshots

### 5.2 Interactive Elements
- **Checkboxes**: Mark steps as complete
- **Embedded OAuth flows**: Where possible, embed provider's OAuth page
- **Copy buttons**: For API keys, code snippets
- **Progress bars**: Visual progress through setup
- **Status indicators**: Success/error states

### 5.3 Visual Guide Component
**File**: `packages/frontend/src/components/tool-integration/VisualGuide.tsx`
- Supports:
  - Screenshots with annotations
  - Numbered steps overlay
  - Highlighted areas (future enhancement)
  - Animated transitions (optional)

---

## Phase 6: Browse Tools Integration

### 6.1 Move Browse to Chat or Toolbox
**Decision**: Keep "Browse All Tools" accessible but move it to:
- Option A: Chat suggestions (when user asks "show me all tools")
- Option B: Empty state in Workflow tab ("Browse tools to add to workflow")
- **Recommendation**: Option B - makes more sense contextually

### 6.2 Update SolutionSearch
**File**: `packages/frontend/src/components/SolutionSearch.tsx`
- Remove "Browse All Tools" section
- Show SplitLayout immediately
- Right panel shows empty Workflow tab initially

---

## Phase 7: Deep Linking & Navigation

### 7.1 Update Routes
**File**: `packages/frontend/src/App.tsx`
- `/` - Main interface (split layout)
- `/tools/:toolId` - Opens in tool tab (redirect to `/` with tab open)
- Use query params: `/?tool=freed-ai` to open specific tool tab

### 7.2 Navigation Handling
- Tool links in chat open tabs (no route change)
- Browser back/forward works with tab state (optional - can use URL state)
- Shareable links: `/?tool=freed-ai&step=3` (optional)

---

## Phase 8: Data Structure Updates

### 8.1 Update Guide Structure
**File**: `packages/frontend/src/data/guides.ts`
- Add optional fields to steps:
  ```typescript
  interface GuideStep {
    title: string;
    content: string;
    hasScreenshot?: boolean;
    screenshotPath?: string;
    requiresOAuth?: boolean;
    oauthProvider?: string;
    embeddedContent?: 'oauth' | 'form' | 'video';
    interactive?: boolean;
  }
  ```

### 8.2 Tool Progress Storage
- localStorage key: `athen-tool-progress`
- Structure:
  ```typescript
  {
    [toolId: string]: {
      completedSteps: number[];
      lastActiveStep: number;
      startedAt: string;
      completedAt?: string;
    }
  }
  ```

---

## Implementation Order & Priorities

### Priority 1 (Core Functionality)
1. ✅ Create SplitLayout component
2. ✅ Create RightPanel with tab system
3. ✅ Move WorkflowPanel to Workflow tab
4. ✅ Create TabContext for tab management
5. ✅ Update ChatInterface to open tool tabs

### Priority 2 (Tool Integration Flows)
6. ✅ Create ToolTab component with step wizard
7. ✅ Implement step navigation and progress tracking
8. ✅ Add interactive checkboxes and progress indicators
9. ✅ Update guide structure to support visual elements

### Priority 3 (Polish & Enhancements)
10. ✅ Add screenshot support (placeholders first)
11. ✅ Improve visual design of tool tabs
12. ✅ Add progress persistence
13. ✅ Handle deep linking for tool tabs

### Priority 4 (Nice-to-Have)
14. ⚪ Embedded OAuth flows
15. ⚪ Tab reordering
16. ⚪ Shareable tool setup links
17. ⚪ Animated transitions

---

## Technical Decisions

### Layout Responsiveness
- Desktop (≥ 1024px): Side-by-side (50/50 or 60/40 split)
- Tablet (768-1023px): Stacked, right panel below
- Mobile (< 768px): Full-width chat, right panel as overlay/modal

### Tab Width
- Minimum tab width: 120px
- Maximum tabs before scrolling: 8-10
- Tab overflow: Horizontal scroll or dropdown

### Right Panel Width
- Default: 50% of viewport (on desktop)
- Minimum: 400px
- Maximum: 60% (on large screens)
- Resizable: Optional future enhancement

### State Management
- Use React Context for tab state (TabContext)
- Use React Context for tool progress (ToolProgressContext)
- Persist tab state in localStorage (optional)
- Persist progress in localStorage (required)

---

## File Structure Changes

```
packages/frontend/src/
├── components/
│   ├── SplitLayout.tsx                    [NEW]
│   ├── RightPanel.tsx                     [NEW]
│   ├── WorkflowTab.tsx                    [NEW - refactor from WorkflowPanel]
│   ├── ToolTab.tsx                        [NEW]
│   ├── tool-integration/                  [NEW DIR]
│   │   ├── StepHeader.tsx
│   │   ├── StepContent.tsx
│   │   ├── StepActions.tsx
│   │   ├── VisualGuide.tsx
│   │   ├── PrerequisitesStep.tsx
│   │   └── CompletionStep.tsx
│   ├── ChatInterface.tsx                  [MODIFY - open tabs instead of navigate]
│   ├── ChatToolCard.tsx                   [MODIFY - click opens tab]
│   ├── ToolCard.tsx                       [MODIFY - click opens tab]
│   ├── WorkflowPanel.tsx                  [DEPRECATE - functionality moved to WorkflowTab]
│   └── SolutionSearch.tsx                 [MODIFY - use SplitLayout]
├── context/
│   ├── TabContext.tsx                     [NEW]
│   ├── ToolProgressContext.tsx            [NEW]
│   ├── WorkflowContext.tsx                [MODIFY - remove panel state]
│   └── ChatContext.tsx                    [NO CHANGE]
├── data/
│   └── guides.ts                          [MODIFY - add visual fields]
└── pages/
    └── ToolGuide.tsx                      [DEPRECATE - functionality in ToolTab]
```

---

## Migration Strategy

1. **Backward Compatibility**: Keep old routes working initially
   - `/tools/:toolId` redirects to new tab system
   - Show deprecation notice

2. **Gradual Rollout**:
   - Phase 1: Add SplitLayout alongside current layout (toggle)
   - Phase 2: Make SplitLayout default
   - Phase 3: Remove old layout components

3. **Data Migration**:
   - Toolbox data already in localStorage - no migration needed
   - Tool progress - new feature, no migration

---

## Testing Checklist

- [ ] Split layout renders correctly on all screen sizes
- [ ] Tab system works (open/close/switch)
- [ ] Workflow tab shows toolbox correctly
- [ ] Clicking tool card in chat opens tool tab
- [ ] Tool tab wizard navigation works
- [ ] Progress is saved and restored
- [ ] Multiple tool tabs can be open
- [ ] Deep linking works (`/tools/:toolId`)
- [ ] Responsive design works (mobile/tablet)
- [ ] No layout shifts or visual glitches

---

## Open Questions / Future Enhancements

1. **Tab Persistence**: Should tabs persist across page refresh? (Recommend: Yes for active tabs)
2. **Tab Limit**: Maximum number of tool tabs? (Recommend: 5-8)
3. **Auto-close Tabs**: Close tab after completing setup? (Recommend: Option to keep open)
4. **Screenshot Collection**: When/how will client provide screenshots?
5. **OAuth Embedding**: Which providers support embedded OAuth? (Need to test)
6. **Video Guides**: Should we support video tutorials in tool tabs? (Future enhancement)

---

## Success Criteria

✅ User can chat on left, see workflow/tools on right
✅ Never navigates away from chat interface
✅ Tool integration flows are visual and interactive
✅ Multiple tool tabs can be open simultaneously
✅ Progress is tracked and saved
✅ Responsive design works on all devices
✅ No regression in existing functionality

