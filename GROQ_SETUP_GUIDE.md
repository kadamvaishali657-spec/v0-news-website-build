# Chatbot Setup - Vercel AI Gateway (Zero Config)

## Overview

The chatbot uses the **Vercel AI Gateway** to access fast LLM models. This means **NO additional setup or API keys are required** - it works out of the box!

## How It Works

- ✅ Uses Vercel AI Gateway (zero-configuration)
- ✅ Model: `groq/llama-3.3-70b-versatile` via Vercel's infrastructure
- ✅ No API keys needed
- ✅ Automatic scaling
- ✅ Works locally and in production

## Quick Start

1. **Local Development:**
```bash
pnpm dev
```

2. **Open the website** and click the chatbot button (💬) in the bottom-right corner

3. **Start chatting!** The chatbot will respond immediately

That's it! No configuration needed.

## Features

The chatbot can:
- Answer questions about news articles on your site
- Provide summaries of stories
- Search and recommend articles
- Have general conversations about news
- Discuss current events

## Deployment

Simply deploy to Vercel as normal:

```bash
git push
```

The chatbot will work immediately in production without any additional setup.

## Architecture

**Files:**
- `app/api/chat/route.ts` - API endpoint using Vercel AI Gateway
- `hooks/use-chat.ts` - Chat state management
- `components/chatbot.tsx` - Main UI component
- `components/chat-message.tsx` - Message display
- `components/chat-input.tsx` - Message input

**Model Info:**
- **Provider:** Groq (via Vercel AI Gateway)
- **Model:** Llama 3.3 70B Versatile
- **Speed:** ~100 tokens/second
- **Perfect for:** News discussion, summarization, Q&A

## Troubleshooting

### Chatbot button not appearing
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for JavaScript errors (F12)
- Ensure JavaScript is enabled

### "Failed to generate response" error
- Check your internet connection
- Verify the website loads correctly
- Try sending a simpler message
- Wait a moment and try again (rate limit)

### No response from chatbot
1. Open DevTools (F12)
2. Go to Network tab
3. Send a message
4. Look for `/api/chat` request
5. Check the response for errors

### Chatbot not visible on mobile
- Check viewport width isn't too narrow
- Ensure CSS media queries are working
- Try rotating device to landscape

## Development

To modify the chatbot behavior, edit:

**System Prompt** (in `app/api/chat/route.ts`):
```typescript
const systemPrompt = `You are a helpful news assistant...`;
```

**Styling** (in `components/chatbot.tsx`):
- Modify Tailwind classes for appearance
- Change colors, sizing, or layout

**Model** (in `app/api/chat/route.ts`):
```typescript
model: 'groq/llama-3.3-70b-versatile' // Change here
```

## Performance

**Response Time:** 1-3 seconds typical
**Context:** Up to 10 recent articles included
**Token Limit:** 1024 tokens per response

## Need Help?

- **AI SDK Docs:** https://sdk.vercel.ai
- **Vercel Docs:** https://vercel.com/docs
- **Groq Info:** https://groq.com

---

Enjoy your fully functional AI-powered news chatbot! 🚀
