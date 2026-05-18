import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Status Check Endpoint
 * - Verifies Groq API key is configured
 * - Checks connectivity to Groq service
 * - Returns configuration status and diagnostics
 */
export async function GET(request: NextRequest) {
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
        message: 'Groq API key not configured',
        details: 'Set GROQ_API_KEY environment variable to enable AI chatbot',
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
        const errorData = await testResponse.json().catch(() => ({}));
        return NextResponse.json({
          status: 'error',
          message: 'Groq API connectivity check failed',
          details: `HTTP ${testResponse.status}: ${errorData?.error?.message || 'Unknown error'}`,
          ...status,
        }, { status: 503 });
      }

      // [3] SUCCESS
      return NextResponse.json({
        status: 'active',
        message: 'AI chatbot is fully operational',
        ...status,
      });
    } catch (connectError) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to connect to Groq API',
        details: connectError instanceof Error ? connectError.message : 'Network error',
        ...status,
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'AI status check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
