

# Chat Enhancements: Push Notifications, Analytics Dashboard & Canned Responses

## Overview

Implementing three major enhancements to the live chat system:
1. **Browser Push Notifications** - Instant alerts for admins when visitors request support
2. **Chat Analytics Dashboard** - Comprehensive metrics for conversation performance
3. **Canned Responses** - Pre-defined templates for quick agent replies

---

## 1. Browser Push Notifications

### How It Works

When a visitor requests a live agent, admins who are online will receive a browser push notification with a sound alert. This works alongside the existing email notifications.

### Implementation

**New Hook: `src/hooks/usePushNotifications.ts`**
- Request notification permission from browser
- Play notification sound when new conversations arrive
- Show desktop notifications with visitor info and quick action button
- Track permission status (granted/denied/default)

**Updates to LiveChatDashboard**
- Integrate push notification hook
- Show permission request button if not granted
- Subscribe to realtime `chat_conversations` changes for `waiting_agent` status

**Notification Flow:**
```text
Visitor requests agent
        |
        v
Database updates status = 'waiting_agent'
        |
        v
Realtime subscription triggers in admin dashboard
        |
        v
If admin online + notifications enabled:
  - Play notification sound
  - Show browser notification with visitor name
  - Clicking notification focuses the chat window
```

**Browser Notification API Usage:**
```typescript
new Notification("New Chat Request", {
  body: `${visitorName} is waiting for support`,
  icon: "/logo.jpeg",
  tag: conversationId, // Prevents duplicate notifications
  requireInteraction: true
});
```

---

## 2. Chat Analytics Dashboard

### Metrics to Display

| Metric | Description | Data Source |
|--------|-------------|-------------|
| Total Conversations | All-time chat sessions | `chat_conversations` count |
| Conversations Today | Sessions started today | `chat_conversations` filtered by date |
| Average Response Time | Time from visitor message to agent reply | Calculated from `chat_messages` timestamps |
| Lead Conversion Rate | % of chats that captured lead data | `chat_leads` / `chat_conversations` |
| Agent vs Bot Handled | Split of who resolved chats | `is_agent_connected` field |
| Messages per Conversation | Average message count | `chat_messages` aggregation |
| Active Hours | Peak chat activity times | `chat_messages.created_at` distribution |

### New Components

**`src/components/admin/chat/ChatAnalytics.tsx`** - Main analytics container with:
- Stat cards for key metrics
- Time period selector (Today, 7 Days, 30 Days, All Time)
- Recharts visualizations

**`src/components/admin/chat/ConversationVolumeChart.tsx`**
- Line chart showing conversations over time
- Compare bot vs agent handled

**`src/components/admin/chat/ResponseTimeChart.tsx`**
- Bar chart showing average response times by day
- Target line for performance benchmarks

**`src/components/admin/chat/LeadConversionCard.tsx`**
- Circular progress showing conversion percentage
- Comparison with previous period

**`src/components/admin/chat/PeakHoursChart.tsx`**
- Heatmap or bar chart of activity by hour

### New Hook

**`src/hooks/useChatAnalytics.ts`**
```typescript
interface ChatAnalytics {
  totalConversations: number;
  conversationsToday: number;
  avgResponseTime: number; // in seconds
  leadConversionRate: number; // percentage
  agentHandledCount: number;
  botHandledCount: number;
  messagesPerConversation: number;
  hourlyDistribution: { hour: number; count: number }[];
  dailyTrend: { date: string; conversations: number; leads: number }[];
}
```

### Dashboard Integration

Add a new "Analytics" tab to the LiveChat page, or create a dedicated `/admin/chat-analytics` page accessible from the sidebar.

---

## 3. Canned Responses / Quick Reply Templates

### Database Schema

**New Table: `canned_responses`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Short label (e.g., "Greeting") |
| content | TEXT | Full response text |
| category | TEXT | Grouping (e.g., "Welcome", "Pricing", "Booking") |
| shortcut | TEXT | Keyboard shortcut (e.g., "/greet") |
| is_active | BOOLEAN | Enable/disable |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMPTZ | Timestamp |
| updated_at | TIMESTAMPTZ | Timestamp |

**RLS Policies:**
- Only admins can read/write canned responses

### Components

**`src/components/admin/chat/CannedResponsePicker.tsx`**
- Dropdown/popover with search functionality
- Grouped by category
- Triggered by clicking button or typing `/` in chat input
- Shows shortcut hints

**`src/components/admin/chat/CannedResponseManager.tsx`**
- CRUD interface for managing responses
- Category management
- Drag-and-drop reordering
- Import/export functionality

### Integration with Admin Chat Input

Modify `AdminChatInput.tsx`:
- Add canned response button next to send
- Detect `/` prefix to show autocomplete
- Insert selected response into input
- Support variable substitution (e.g., `{visitor_name}`)

### Default Templates

Pre-populate with common responses:
```text
/greet - "Hello! Thank you for reaching out. How can I assist you today?"
/wait - "Please give me a moment while I look into this for you."
/booking - "I'd be happy to help you with a booking. Could you share your preferred date and number of guests?"
/pricing - "Our packages start from AED X. You can view all options at [Tours Page]."
/thanks - "Thank you for choosing Luxury Dhow Escapes! Have a wonderful day."
/offline - "Our team is currently offline. Please leave your contact details and we'll get back to you shortly."
```

---

## File Changes Summary

### New Files

| File | Purpose |
|------|---------|
| `src/hooks/usePushNotifications.ts` | Browser notification logic |
| `src/hooks/useChatAnalytics.ts` | Analytics data fetching |
| `src/components/admin/chat/ChatAnalytics.tsx` | Analytics dashboard container |
| `src/components/admin/chat/ConversationVolumeChart.tsx` | Conversations over time |
| `src/components/admin/chat/ResponseTimeChart.tsx` | Response time visualization |
| `src/components/admin/chat/LeadConversionCard.tsx` | Conversion metric card |
| `src/components/admin/chat/PeakHoursChart.tsx` | Activity by hour |
| `src/components/admin/chat/CannedResponsePicker.tsx` | Response selector popup |
| `src/components/admin/chat/CannedResponseManager.tsx` | CRUD for templates |

### Modified Files

| File | Changes |
|------|---------|
| `src/components/admin/chat/LiveChatDashboard.tsx` | Add tabs for Conversations/Analytics, integrate notifications |
| `src/components/admin/chat/AdminChatInput.tsx` | Add canned response button and `/` detection |
| `src/components/admin/AdminSidebar.tsx` | Optional: Add Chat Analytics link |

### Database Migration

Create `canned_responses` table with RLS policies for admin access.

---

## Implementation Phases

### Phase 1: Browser Push Notifications
1. Create `usePushNotifications` hook
2. Add notification permission UI to LiveChatDashboard
3. Subscribe to realtime for new waiting conversations
4. Trigger notifications with sound

### Phase 2: Canned Responses
1. Create database migration for `canned_responses` table
2. Build CannedResponseManager CRUD interface
3. Create CannedResponsePicker component
4. Integrate with AdminChatInput
5. Seed default templates

### Phase 3: Chat Analytics
1. Create `useChatAnalytics` hook with data aggregation queries
2. Build individual chart components
3. Create ChatAnalytics container with period selector
4. Add Analytics tab to LiveChatDashboard

---

## Technical Considerations

### Push Notification Permissions
- Request permission on first online toggle
- Store preference in localStorage to avoid repeated prompts
- Gracefully handle denied permissions

### Analytics Performance
- Use database aggregation queries (GROUP BY) instead of fetching all records
- Cache results with React Query (5-minute stale time)
- Limit date range to prevent large data fetches

### Canned Response Variables
Support dynamic placeholders:
- `{visitor_name}` - From conversation data
- `{date}` - Current date
- `{agent_name}` - Current admin name

These get replaced when response is selected.

