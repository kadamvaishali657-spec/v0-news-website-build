# Groq API Setup Guide

## Quick Start

The chatbot feature requires a Groq API key to function. Here's how to set it up:

## Step 1: Create a Groq Account

1. Visit [console.groq.com](https://console.groq.com)
2. Click "Sign up" or "Sign in" (if you already have an account)
3. Complete the registration/login process

## Step 2: Generate API Key

1. Once logged in, navigate to the **API Keys** section
2. Click **"Create New API Key"**
3. Give it a descriptive name (e.g., "News Website Chatbot")
4. Copy the generated API key

## Step 3: Add to Your Project

### For Local Development

1. Create or update `.env.local` in your project root:

```bash
# .env.local
GROQ_API_KEY=your_copied_api_key_here
```

2. Restart your dev server:
```bash
pnpm dev
```

### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your Groq API key
4. Select the environment (Production/Preview/Development)
5. Click **"Save"**

6. Redeploy your project to apply the changes

## Step 4: Verify Setup

1. Start your development server: `pnpm dev`
2. Navigate to your website
3. Click the chatbot button (💬) in the bottom-right corner
4. Type a message and send

If you see a response, the setup is successful! ✅

## Troubleshooting

### "Invalid API Key" Error
- Verify you copied the entire key correctly
- Make sure there are no extra spaces before/after the key
- Check the key hasn't expired in Groq console

### "401 Unauthorized"
- The API key is not being read by the application
- Verify `.env.local` file exists in the project root
- Restart your dev server after adding the key

### "Rate Limited"
- You've exceeded the API rate limit
- Check your usage in Groq console
- Upgrade your plan if needed

### Chatbot doesn't respond
- Check browser console for error messages
- Verify API route exists: `/app/api/chat/route.ts`
- Check Groq API status page

## API Key Security

⚠️ **Important**: Never commit your API key to version control!

- Add `.env.local` to `.gitignore`
- Always use environment variables
- Never paste the key in public repositories
- Rotate keys if accidentally exposed

## Usage Limits

Free tier Groq accounts include:
- API requests with rate limits
- Fast inference speeds
- Access to various LLMs including llama-3.3-70b-versatile

Check the [Groq pricing page](https://console.groq.com/docs/rate-limits) for current limits.

## Need Help?

- Check [Groq Documentation](https://console.groq.com/docs)
- Visit [Groq Community](https://www.together.ai/community)
- Review [API Reference](https://console.groq.com/docs/speech-text)

---

Once setup is complete, your news chatbot will be fully functional! 🚀
