/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Increase JSON payload limit for base64 audio and image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI client (User-Agent header required by AI Studio guidelines)
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function checkApiKey(res: Response): boolean {
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the environment. Please check the Secrets panel.',
    });
    return false;
  }
  return true;
}

// ----------------------------------------------------
// 1. Multi-Turn Gemini Chatbot (NGD Bot)
// Models: gemini-3.5-flash (default), gemini-3.1-pro-preview (complex), gemini-3.1-flash-lite (fast)
// ----------------------------------------------------
app.post('/api/chat', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const {
      message,
      history = [],
      model = 'gemini-3.5-flash',
      systemInstruction = 'You are NGD, an ultra-intelligent, fast, ambient voice and developer AI assistant. You specialize in voice computing, code architecture, ambient computing, and Google Workspace automation. Be concise, sharp, and helpful.',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    // Format contents with multi-turn history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history) {
        contents.push({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'No response generated.',
      model,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate chat response.',
    });
  }
});

// ----------------------------------------------------
// 2. Google Search Grounding
// Model: gemini-3.5-flash with googleSearch tool
// ----------------------------------------------------
app.post('/api/search-grounding', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are NGD Search Agent. Use Google Search to find current, authoritative information and summarize it clearly with citations.',
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    res.json({
      reply: response.text || 'No results found.',
      chunks,
    });
  } catch (error: any) {
    console.error('Search Grounding error:', error);
    res.status(500).json({
      error: error.message || 'Google Search Grounding failed.',
    });
  }
});

// ----------------------------------------------------
// 3. Google Maps Grounding
// Model: gemini-3.5-flash with googleMaps tool
// ----------------------------------------------------
app.post('/api/maps-grounding', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { query, latitude, longitude } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Location search query is required.' });
    }

    const toolConfig =
      latitude && longitude
        ? {
            retrievalConfig: {
              latLng: {
                latitude: Number(latitude),
                longitude: Number(longitude),
              },
            },
          }
        : undefined;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig,
        systemInstruction:
          'You are NGD Maps Navigator. Use Google Maps to find specific places, routes, addresses, and details.',
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    res.json({
      reply: response.text || 'No location details found.',
      chunks,
    });
  } catch (error: any) {
    console.error('Maps Grounding error:', error);
    res.status(500).json({
      error: error.message || 'Google Maps Grounding failed.',
    });
  }
});

// ----------------------------------------------------
// 4. Audio Transcription
// Model: gemini-3.5-transcribe
// ----------------------------------------------------
app.post('/api/transcribe', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Base64 audio data is required.' });
    }

    // Strip data URL header if included
    const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '');

    const audioPart = {
      inlineData: {
        mimeType: mimeType.split(';')[0],
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Please transcribe the speech in this audio accurately. Return only the transcription text.' },
        ],
      },
    });

    res.json({
      transcript: response.text || '',
    });
  } catch (error: any) {
    console.error('Audio Transcription error:', error);
    res.status(500).json({
      error: error.message || 'Failed to transcribe audio.',
    });
  }
});

// ----------------------------------------------------
// 5. Create & Edit Images
// Models: gemini-3.1-flash-image (default), gemini-3.1-flash-lite-image
// ----------------------------------------------------
app.post('/api/image/generate', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { prompt, aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: '1K',
          },
        },
      });
    } catch (primaryErr) {
      console.warn('Falling back to gemini-3.1-flash-lite-image:', primaryErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });
    }

    let imageUrl = '';
    let textReply = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textReply = part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: textReply || 'No image was generated by the model.' });
    }

    res.json({
      imageUrl,
      description: textReply || 'Generated with NGD Image Studio',
    });
  } catch (error: any) {
    console.error('Image Generation error:', error);
    res.status(500).json({
      error: error.message || 'Image generation failed.',
    });
  }
});

app.post('/api/image/edit', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { prompt, imageBase64, mimeType = 'image/png' } = req.body;
    if (!prompt || !imageBase64) {
      return res.status(400).json({ error: 'Prompt and source image are required.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType.split(';')[0],
            },
          },
          { text: prompt },
        ],
      },
    });

    let imageUrl = '';
    let textReply = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textReply = part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: textReply || 'Could not produce edited image.' });
    }

    res.json({
      imageUrl,
      description: textReply || 'Edited with NGD Image Studio',
    });
  } catch (error: any) {
    console.error('Image Edit error:', error);
    res.status(500).json({
      error: error.message || 'Image editing failed.',
    });
  }
});

// ----------------------------------------------------
// 6. Generate Music
// Models: lyria-3-clip-preview (up to 30s clips), lyria-3-pro-preview (full tracks)
// ----------------------------------------------------
app.post('/api/music/generate', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { prompt, model = 'lyria-3-clip-preview' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Music prompt is required.' });
    }

    const responseStream = await ai.models.generateContentStream({
      model: model || 'lyria-3-clip-preview',
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({ error: 'No audio data was produced by the music model.' });
    }

    res.json({
      audioDataUrl: `data:${mimeType};base64,${audioBase64}`,
      lyrics: lyrics || 'Music track composed by NGD Lyria Audio Core.',
      model,
    });
  } catch (error: any) {
    console.error('Music Generation error:', error);
    res.status(500).json({
      error: error.message || 'Music generation failed.',
    });
  }
});

// ----------------------------------------------------
// 7. Live Voice Conversations (Live API via WebSocket)
// Model: gemini-3.8-live
// ----------------------------------------------------
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  let session: any = null;

  try {
    if (!process.env.GEMINI_API_KEY) {
      clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY missing on server.' }));
      clientWs.close();
      return;
    }

    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction:
          'You are NGD, an ultra-fast, intelligent, and friendly AI voice assistant. Converse naturally with the user.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Error handling live client message:', err);
      }
    });

    clientWs.on('close', () => {
      if (session && typeof session.close === 'function') {
        session.close();
      }
    });
  } catch (liveErr: any) {
    console.error('Live API connection error:', liveErr);
    clientWs.send(JSON.stringify({ error: liveErr.message || 'Live session failed' }));
    clientWs.close();
  }
});

// Handle WebSocket upgrade
httpServer.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// ----------------------------------------------------
// Setup Vite in Dev or Static files in Production
// ----------------------------------------------------
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[NGD Assistant Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
  process.exit(1);
});
