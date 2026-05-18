'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Loader2, AlertCircle, CheckCircle, Copy } from 'lucide-react';

export default function AITestPage() {
  const [loading, setLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [testMessage, setTestMessage] = useState('What are the top news stories today?');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatResult, setchatResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Check AI Status
  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-status');
      const data = await response.json();
      setStatusResult(data);
    } catch (error) {
      setStatusResult({
        error: 'Failed to check status',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Test Chat
  const testChat = async () => {
    setChatLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: testMessage,
            },
          ],
          articles: [],
        }),
      });
      const data = await response.json();
      setchatResult(data);
    } catch (error) {
      setchatResult({
        error: 'Failed to test chat',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Service Diagnostics</h1>
          <p className="text-muted-foreground mb-8">Test and verify Groq API configuration and chatbot functionality</p>

          {/* Status Section */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">1. Check AI Service Status</h2>
            <button
              onClick={checkStatus}
              disabled={loading}
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors mb-6 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Status'
              )}
            </button>

            {statusResult && (
              <div
                className={`p-4 rounded-lg border ${
                  statusResult.configured
                    ? 'border-green-500/50 bg-green-50/10'
                    : 'border-red-500/50 bg-red-50/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {statusResult.configured ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">
                      {statusResult.configured ? 'AI Service Configured ✓' : 'AI Service Not Configured ✗'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {statusResult.message || statusResult.error}
                    </p>
                    {statusResult.details && (
                      <p className="text-xs text-muted-foreground mt-2 font-mono">
                        {statusResult.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Test Section */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">2. Test Chatbot</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Test Message</label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input text-foreground px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={3}
                />
              </div>

              <button
                onClick={testChat}
                disabled={chatLoading || !testMessage.trim()}
                className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {chatLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Chat'
                )}
              </button>
            </div>

            {chatResult && (
              <div
                className={`p-4 rounded-lg border ${
                  chatResult.success
                    ? 'border-green-500/50 bg-green-50/10'
                    : 'border-red-500/50 bg-red-50/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {chatResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">
                      {chatResult.success ? 'Response Received ✓' : 'Error'}
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {chatResult.message || chatResult.error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Setup Guide */}
          <div className="bg-card border border-border rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Setup Instructions</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground mb-2">1. Get Groq API Key</h3>
                <p>Visit https://console.groq.com/keys and create an API key</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">2. Add Environment Variable</h3>
                <p>Go to Vercel Project Settings → Variables → Add new variable</p>
                <div className="mt-2 flex items-center gap-2 bg-secondary/50 p-3 rounded font-mono text-xs">
                  <span>GROQ_API_KEY=your_api_key_here</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('GROQ_API_KEY=');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="ml-auto p-1 hover:bg-secondary rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">3. Redeploy</h3>
                <p>Redeploy your application for the environment variable to take effect</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">4. Test Here</h3>
                <p>Use this page to verify the configuration is working</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
