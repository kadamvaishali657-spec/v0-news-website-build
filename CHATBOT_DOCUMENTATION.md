# Chatbot Feature Documentation

## Overview

The news website now includes an AI-powered news assistant chatbot that appears as a floating button in the bottom-right corner of the page. The chatbot can answer questions about news articles, provide summaries, help with news search, and offer general conversation about news topics.

## Features

### ✨ Core Functionality
- **Article-Aware Responses**: The chatbot has context about current articles displayed on the site and can answer questions about them
- **Floating Interface**: Non-intrusive floating button in the bottom-right corner that expands into a chat panel
- **Persistent Chat History**: Conversations are saved to browser localStorage and persist across sessions
- **Real-time Responses**: Fast LLM inference powered by Groq's llama-3.3-70b-versatile model
- **Multi-purpose**: Can summarize articles, search for news, recommend content, and have general conversations

### 🎯 Capabilities
The chatbot can:
1. **Summarize news articles** - Get quick summaries of complex stories
2. **Answer questions about news** - Ask about current events and trending topics
3. **Search and recommend** - Find articles related to specific topics or interests
4. **General Q&A** - Discuss news-related topics and world events
5. **Chat history** - Access previous conversations from the same session

## Technical Implementation

### Architecture

```
/api/chat (POST)
├─ Receives: { messages, articles }
├─ Uses: Groq LLM (llama-3.3-70b-versatile)
└─ Returns: { success, message }

components/chatbot.tsx
├─ ChatBot (Main Component - Floating Button + Panel)
├─ ChatMessage (Individual Message Display)
└─ ChatInput (Message Input Field)

hooks/use-chat.ts
├─ State Management
├─ localStorage Integration
└─ Message History

lib/rss-parser.ts
├─ Provides Article Context
└─ Feeds articles to chatbot
```

### File Structure

```
app/
├─ api/
│  └─ chat/
│     └─ route.ts                 # Chat API endpoint
├─ page.tsx                        # Modified to include ChatBot
└─ layout.tsx

components/
├─ chatbot.tsx                     # Main chatbot component
├─ chat-message.tsx               # Message display component
└─ chat-input.tsx                 # Input field component

hooks/
├─ use-chat.ts                     # Chat management hook
└─ use-mobile.tsx                 # Existing

lib/
└─ rss-parser.ts                  # Existing (provides article context)
```

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from [console.groq.com](https://console.groq.com)

### 2. Dependencies

The following dependencies are required (already added to package.json):

```json
{
  "ai": "^6.4.0",
  "@ai-sdk/groq": "^1.1.11"
}
```

Run: `pnpm install` (or npm/yarn equivalent)

### 3. Verify Installation

- The chatbot floating button should appear in the bottom-right corner
- Click to open the chat panel
- Type a message and send to test the AI response

## Usage

### For Users

1. **Open Chat**: Click the blue floating button (💬) in the bottom-right corner
2. **Ask Questions**: Type any question about news, articles, or world events
3. **View History**: Previous messages appear in the chat (saved locally)
4. **Clear History**: Click the trash icon to clear chat history
5. **Close Chat**: Click the X button or the floating button to collapse

### For Developers

#### Integrating Article Context

The chatbot automatically receives the current articles from the page:

```tsx
<ChatBot articles={articles} />
```

The article context is used to inform the chatbot's responses about current news.

#### Customizing System Prompt

Edit the system prompt in `/app/api/chat/route.ts`:

```typescript
const systemPrompt = `You are a helpful news assistant...`
```

#### Adjusting LLM Parameters

Modify the model call in `/app/api/chat/route.ts`:

```typescript
const { text } = await generateText({
  model: groq('llama-3.3-70b-versatile'),
  system: systemPrompt,
  messages: conversationMessages,
  temperature: 0.7,        // Adjust creativity (0.0-1.0)
  maxTokens: 500,          // Adjust response length
});
```

## Component Details

### ChatBot Component
- **Location**: `components/chatbot.tsx`
- **Props**: `articles?: Article[]`
- **Features**: Floating button, expandable panel, message display, auto-scroll
- **State**: Open/closed, messages, loading, error

### Chat Message Component
- **Location**: `components/chat-message.tsx`
- **Props**: `message: ChatMessage`
- **Features**: Role-based styling (user vs assistant), timestamp display, avatar icons

### Chat Input Component
- **Location**: `components/chat-input.tsx`
- **Props**: `onSendMessage`, `isLoading`, `disabled`
- **Features**: Text input, send button, disabled state during loading

### useChat Hook
- **Location**: `hooks/use-chat.ts`
- **Functions**:
  - `sendMessage(message: string)` - Send a message to the API
  - `clearHistory()` - Clear all messages
- **State**:
  - `messages: ChatMessage[]` - Array of chat messages
  - `isLoading: boolean` - Loading state during API call
  - `error: string | null` - Error message if any

## Chat Message Storage

Chat messages are stored in browser localStorage under the key `newsbot-chat-history`. The system:

- Stores up to 50 messages
- Persists across page refreshes
- Automatically saves new messages
- Can be manually cleared via the UI or using `localStorage.removeItem('newsbot-chat-history')`

## Error Handling

The chatbot includes comprehensive error handling:

- **API Errors**: Displayed in red message box
- **Network Errors**: User-friendly error messages
- **Validation**: Input validation on send
- **Graceful Degradation**: Falls back to friendly messages if Groq API is unavailable

## Customization

### Change Floating Button Position

Modify the `fixed` classes in `components/chatbot.tsx`:

```tsx
className="fixed bottom-6 right-6 ..."  // Current: bottom-right
// Change to:
className="fixed bottom-6 left-6 ..."   // Bottom-left
className="fixed top-6 right-6 ..."     // Top-right
```

### Change Chat Panel Size

Modify the dimensions in `components/chatbot.tsx`:

```tsx
className="fixed bottom-24 right-6 w-96 h-96 max-h-96 ..."
// Change w-96 (384px) and h-96 (384px) to desired sizes
```

### Change Colors

The chatbot uses the existing design tokens. To change colors, modify:

- `bg-accent` - Primary button/message color
- `bg-muted` - Secondary/assistant message color
- Update in `tailwind.config.ts` or `globals.css`

## Performance Considerations

- **Message Limit**: Limited to 50 stored messages to prevent localStorage bloat
- **API Optimization**: Uses fast Groq inference (typically <1 second responses)
- **Auto-scroll**: Only scrolls when new messages arrive
- **Lazy Loading**: Chat panel only renders when opened

## Security Considerations

- **GROQ_API_KEY**: Keep secret - never expose in client code
- **Article Context**: Only sends article metadata, not sensitive user data
- **Input Validation**: User input is validated before sending to API
- **localStorage**: Only client-side, not sent to servers

## Troubleshooting

### Chatbot button not appearing
- Check that `<ChatBot />` component is imported and rendered in page.tsx
- Verify z-index conflicts with other fixed elements

### No response from chatbot
- Verify `GROQ_API_KEY` environment variable is set
- Check browser console for error messages
- Verify API route exists at `/app/api/chat/route.ts`
- Check Groq API status

### Chat history not persisting
- Verify browser localStorage is enabled
- Check if private/incognito mode is being used
- Check browser console for storage quota errors

### Slow responses
- This is normal with the Groq API (typically 0.5-2 seconds)
- Longer messages may take slightly longer
- Ensure internet connection is stable

## Future Enhancements

Potential improvements:
- [ ] Add typing indicator animation
- [ ] Support for markdown in responses
- [ ] Article link suggestions in responses
- [ ] User preferences (theme, position, size)
- [ ] Export chat history as JSON/PDF
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Conversation export feature

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Verify environment variables are set correctly
4. Check Groq API status and quotas
