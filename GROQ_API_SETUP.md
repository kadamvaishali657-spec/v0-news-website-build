# Groq API Setup Guide

## Overview
The INFORMED news platform uses Groq's LLaMA 3.3 70B model for intelligent news chatbot responses. This guide walks through setup and verification.

## Quick Start

### 1. Get Your Groq API Key
1. Visit https://console.groq.com
2. Sign up or log in to your account
3. Navigate to "Keys" section
4. Click "Create API Key"
5. Copy your new API key (format: `sk-or-v1-...`)

### 2. Add Environment Variable to Vercel

**Option A: Via Vercel Dashboard**
1. Go to your project on vercel.com
2. Click "Settings" → "Environment Variables"
3. Click "Add New"
4. **Name**: `GROQ_API_KEY`
5. **Value**: Paste your API key from step 1
6. **Environments**: Select "Production", "Preview", and "Development"
7. Click "Save"
8. **Important**: Redeploy your application for changes to take effect

**Option B: Via Vercel CLI**
```bash
vercel env add GROQ_API_KEY
# Paste your key when prompted
vercel --prod
```

### 3. Verify Configuration

Visit your application at `/ai-test` page to:
- ✅ Check if GROQ_API_KEY is detected
- ✅ Test connection to Groq API
- ✅ Send a test message through the chatbot

### 4. Expected Results

**Success Indicators:**
- ✓ Green checkmark on status page
- ✓ Message "AI Service Configured"
- ✓ Chatbot responds to test messages
- ✓ Chat widget in news feed works

**If Not Working:**
1. Check that environment variable is correctly set
2. Wait 5 minutes after redeploy for changes to propagate
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check API key is valid at https://console.groq.com/keys
5. Verify API key hasn't expired or been revoked

## Technical Details

### Environment Variable Check
The application checks for `GROQ_API_KEY` in:
1. `app/api/chat/route.ts` - Chat API handler
2. `app/api/ai-status/route.ts` - Status check endpoint

### Error Handling
If GROQ_API_KEY is missing or invalid:
- Chatbot shows: "AI chatbot is not configured"
- Status page shows: Clear error message
- Chat API returns: 503 Service Unavailable

### Models Available
Currently configured: **llama-3.3-70b-versatile**

Alternative models available via Groq:
- `mixtral-8x7b-32768`
- `gemma-7b-it`
- `llama-2-70b-chat`

To change model, edit `/app/api/chat/route.ts` line with `model: 'llama-3.3-70b-versatile'`

## Rate Limits

Groq API has the following rate limits (may vary):
- **Free tier**: 30 requests/minute
- **Pro tier**: Higher limits
- Current implementation has 30-second timeout per request

## Troubleshooting

### "Invalid API Key" Error
- Double-check key is copied completely (includes `sk-or-v1-` prefix)
- Visit https://console.groq.com/keys to verify key is valid
- Create a new key if current one is expired

### "Service Unavailable" (503)
- Groq API may be temporarily down (check https://status.groq.com)
- Try again in a few minutes
- Check your API key has sufficient quota

### Chatbot Not Responding
- Visit `/ai-test` page to diagnose
- Check environment variable is set
- Verify API key is correct
- Check network connectivity

### Timeout Errors
- Groq API may be slow
- Configured timeout: 30 seconds
- Check your internet connection
- Try a shorter message

## Production Considerations

✅ **Security:**
- API key stored securely in Vercel environment variables
- Never exposed in client-side code
- Only called from backend API route
- Uses HTTPS for all requests

✅ **Performance:**
- Response cached briefly in chat context
- Articles stored in sessionStorage for context
- Streaming not yet implemented (can be added)

✅ **Monitoring:**
- Error logs include diagnostic information
- `/api/ai-status` endpoint for health checks
- Clear user-facing error messages

## Support

For issues with Groq API:
- Visit https://console.groq.com/support
- Check https://status.groq.com for service status

For issues with INFORMED application:
- Check `/ai-test` page for diagnostics
- Review console logs in browser DevTools
- Check Vercel project logs

## Next Steps

1. **Test the setup**: Visit `/ai-test` page
2. **Use the chatbot**: Chat widget appears in news feed
3. **Monitor usage**: Check Groq dashboard for API usage
4. **Explore context**: Chatbot uses current articles for responses
