import { NextResponse } from 'next/server';

/**
 * AI Status Check Endpoint
 * - Verifies Groq API key is configured
 * - Checks connectivity to Groq service
 * - Returns configuration status and diagnostics
 */
export async function GET() {
  try {
    // [1] CHECK GROQ API KEY
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    
    const status = {
      configured: !!groqApiKey,
      service: 'Groq LLM',
      model: 'llama-3.3-70b-versatile',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      timestamp: new Date().toISOString(),
    };

    if (!groqApiKey) {
      return NextResponse.json({
        status: 'unconfigured',
        message: 'AI service is not configured.',
        details: 'Configure GROQ_API_KEY to enable the AI assistant.',
        ...status,
      }, { status: 503 });
    }

    // [2] TEST GROQ CONNECTIVITY
    try {
      const testResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: 'Hello',
            },
          ],
          max_tokens: 10,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!testResponse.ok) {
        return NextResponse.json({
          status: 'error',
          message: 'AI service connectivity check failed.',
          details: `Provider returned HTTP ${testResponse.status}.`,
          ...status,
        }, { status: 503 });
      }

      // [3] SUCCESS
      return NextResponse.json({
        status: 'active',
        message: 'AI service is operational.',
        ...status,
      });
    } catch (connectError) {
      return NextResponse.json({
        status: 'error',
        message: 'Unable to connect to the AI provider.',
        details: connectError instanceof Error && connectError.name === 'AbortError'
          ? 'Connection timed out.'
          : connectError instanceof Error
            ? `Request failed (${connectError.name || 'UnknownError'}).`
            : 'Network request failed.',
        ...status,
      }, { status: 503 });
    }
  } catch (_error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unable to complete AI status check.',
      details: 'An unexpected server error occurred.',
    }, { status: 500 });
  }
}
