import { Router, Request, Response } from 'express';
import { streamChatCompletion, ChatMessage } from '../services/claudeAI';

const router = Router();

interface ChatRequest {
  messages: ChatMessage[];
}

// POST /api/v1/chat - Stream chat completion
router.post('/', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { messages } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Messages array is required and must not be empty',
        },
      });
      return;
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        res.status(400).json({
          error: {
            code: 'INVALID_MESSAGE_FORMAT',
            message: 'Each message must have a role and content',
          },
        });
        return;
      }
      if (!['user', 'assistant'].includes(msg.role)) {
        res.status(400).json({
          error: {
            code: 'INVALID_ROLE',
            message: 'Message role must be "user" or "assistant"',
          },
        });
        return;
      }
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Stream the response
    try {
      for await (const chunk of streamChatCompletion(messages)) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      // If headers already sent, just end the response
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
        res.end();
      } else {
        res.status(500).json({
          error: {
            code: 'STREAM_ERROR',
            message: 'Failed to stream response',
          },
        });
      }
    }
  } catch (error) {
    console.error('Chat endpoint error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    }
  }
});

// GET /api/v1/chat/health - Health check for chat service
router.get('/health', (_req: Request, res: Response) => {
  const hasCredentials = !!process.env.ANTHROPIC_FOUNDRY_API_KEY;

  res.json({
    status: hasCredentials ? 'configured' : 'missing_credentials',
    model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-5',
    resource: process.env.ANTHROPIC_FOUNDRY_RESOURCE || 'not_set',
  });
});

export default router;
