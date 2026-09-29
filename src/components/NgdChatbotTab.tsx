/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  MapPin,
  Mic,
  MicOff,
  Image as ImageIcon,
  Music,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RefreshCw,
  ExternalLink,
  Upload,
  Play,
  Pause,
  Copy,
  Check,
  Share2,
  Sliders,
  Globe,
  Radio,
  Volume2,
} from 'lucide-react';
import { RepoConfig } from '../types/repo';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  citations?: Array<{ uri: string; title: string }>;
  mapLocations?: Array<{ uri: string; title: string }>;
}

interface NgdChatbotTabProps {
  repoConfig: RepoConfig;
  onPostToChat?: (text: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  isChatConnected: boolean;
}

export const NgdChatbotTab: React.FC<NgdChatbotTabProps> = ({
  repoConfig,
  onPostToChat,
  onShowToast,
  isChatConnected,
}) => {
  // Sub-feature modes
  const [activeSubMode, setActiveSubMode] = useState<
    'chat' | 'search' | 'maps' | 'transcribe' | 'live' | 'image' | 'music'
  >('chat');

  // --- 1. Multi-turn Chat State ---
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am **NGD** — your conversational voice assistant and multi-modal developer bot.\n\nI can help you build voice pipelines, search the live web, explore Google Maps, transcribe microphone recordings, generate and edit images, or compose AI music with Lyria!`,
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [systemRole, setSystemRole] = useState(
    'You are NGD, an ultra-fast, intelligent, and ambient AI voice assistant & full-stack software engineer. You specialize in ambient computing, voice pipelines, Python, and Google tools. Respond with crisp, structured, actionable advice.'
  );
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // --- 2. Google Search Grounding State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    reply: string;
    chunks: Array<{ web?: { uri: string; title: string } }>;
  } | null>(null);

  // --- 3. Google Maps Grounding State ---
  const [mapsQuery, setMapsQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [useCurrentGps, setUseCurrentGps] = useState(true);
  const [mapsResult, setMapsResult] = useState<{
    reply: string;
    chunks: any[];
  } | null>(null);

  // --- 4. Audio Transcription State ---
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- 5. Live Voice API State ---
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('Press Connect to start a live bidirectional voice conversation with NGD (Gemini 3.8 Live).');
  const liveWsRef = useRef<WebSocket | null>(null);
  const liveAudioCtxRef = useRef<AudioContext | null>(null);

  // --- 6. Image Studio State ---
  const [imagePrompt, setImagePrompt] = useState('Futuristic glowing robot assistant named NGD with cobalt blue holographic halo and neon orange core');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [sourceImageForEdit, setSourceImageForEdit] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('Add glowing orange particle sparks around the assistant');
  const [isEditingImage, setIsEditingImage] = useState(false);

  // --- 7. Lyria Music Generation State ---
  const [musicPrompt, setMusicPrompt] = useState('Upbeat energetic electronic synthwave track with punchy drums and bright orange arpeggio melodies');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<{ audioDataUrl: string; lyrics: string } | null>(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isGeneratingChat]);

  // Handle Multi-Turn Chat Submission
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text || isGeneratingChat) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsGeneratingChat(true);

    try {
      // Build conversation history for multi-turn thread
      const history = chatMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          model: selectedModel,
          systemInstruction: systemRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error generating reply');
      }

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel,
      };

      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      onShowToast('error', 'Chat Generation Error', err.message);
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `⚠️ *Error:* ${err.message || 'Could not connect to Gemini API. Please check your GEMINI_API_KEY in Secrets.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        },
      ]);
    } finally {
      setIsGeneratingChat(false);
    }
  };

  // Handle Google Search Grounding
  const handleSearchGrounding = async (queryText?: string) => {
    const q = (queryText || searchQuery).trim();
    if (!q || isSearching) return;

    setIsSearching(true);
    setSearchResult(null);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search grounding request failed');

      setSearchResult(data);
    } catch (err: any) {
      console.error('Search error:', err);
      onShowToast('error', 'Search Grounding Failed', err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Google Maps Grounding
  const handleMapsGrounding = async () => {
    const q = mapsQuery.trim();
    if (!q || isLocating) return;

    setIsLocating(true);
    setMapsResult(null);

    let lat: number | undefined;
    let lng: number | undefined;

    if (useCurrentGps && 'geolocation' in navigator) {
      try {
        const pos: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (locErr) {
        console.warn('Geolocation unavailable, continuing without GPS:', locErr);
      }
    }

    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, latitude: lat, longitude: lng }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Maps grounding request failed');

      setMapsResult(data);
    } catch (err: any) {
      console.error('Maps error:', err);
      onShowToast('error', 'Maps Grounding Failed', err.message);
    } finally {
      setIsLocating(false);
    }
  };

  // Audio Recording & Transcription
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioForTranscription(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingAudio(true);
      onShowToast('info', 'Recording started', 'Speak clearly into your microphone.');
    } catch (err: any) {
      console.error('Microphone error:', err);
      onShowToast('error', 'Microphone access denied', err.message);
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  const sendAudioForTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    setTranscribedText('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Transcription failed');

        setTranscribedText(data.transcript);
        onShowToast('success', 'Audio Transcribed', 'Transcription completed with Gemini 3.5 Transcribe.');
      };
    } catch (err: any) {
      console.error('Transcription error:', err);
      onShowToast('error', 'Transcription Failed', err.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle Image Generation
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageAspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate image');

      setGeneratedImage(data.imageUrl);
      onShowToast('success', 'Image Created', 'Rendered with Gemini 3.1 Flash Image.');
    } catch (err: any) {
      console.error('Image gen error:', err);
      onShowToast('error', 'Image Generation Failed', err.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle Image Editing
  const handleEditImage = async () => {
    if (!sourceImageForEdit || !editPrompt.trim() || isEditingImage) return;

    setIsEditingImage(true);
    try {
      const res = await fetch('/api/image/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sourceImageForEdit,
          prompt: editPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to edit image');

      setGeneratedImage(data.imageUrl);
      onShowToast('success', 'Image Edited', 'Modified with Gemini 3.1 Flash Image.');
    } catch (err: any) {
      console.error('Image edit error:', err);
      onShowToast('error', 'Image Editing Failed', err.message);
    } finally {
      setIsEditingImage(false);
    }
  };

  // Handle Lyria Music Generation
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim() || isGeneratingMusic) return;

    setIsGeneratingMusic(true);
    setGeneratedMusic(null);

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          model: 'lyria-3-clip-preview',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate music');

      setGeneratedMusic(data);
      onShowToast('success', 'Music Generated', 'Audio clip composed by Lyria-3-Clip.');
    } catch (err: any) {
      console.error('Music gen error:', err);
      onShowToast('error', 'Music Generation Failed', err.message);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // Live Voice API Connection (Gemini 3.8 Live)
  const toggleLiveVoice = () => {
    if (isLiveConnected) {
      if (liveWsRef.current) {
        liveWsRef.current.close();
      }
      setIsLiveConnected(false);
      setLiveTranscript('Disconnected from Live API session.');
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsLiveConnected(true);
        setLiveTranscript('Connected to NGD Live API (gemini-3.8-live). Listening...');
        onShowToast('success', 'Live Voice Connected', 'Gemini 3.8 Live session active.');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            onShowToast('error', 'Live API Error', data.error);
            setLiveTranscript(`Error: ${data.error}`);
          }
          if (data.audio) {
            setLiveTranscript('Receiving live voice audio response from NGD...');
          }
        } catch (err) {
          console.error('Live WS message error:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('Live WS error:', err);
        setIsLiveConnected(false);
        setLiveTranscript('Live API connection failed. Check your GEMINI_API_KEY.');
      };

      ws.onclose = () => {
        setIsLiveConnected(false);
      };

      liveWsRef.current = ws;
    } catch (err: any) {
      console.error('Failed to init live websocket:', err);
      onShowToast('error', 'Live Connection Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header with Vibrant Blue & Orange Theme */}
      <div className="bg-gradient-to-r from-blue-950 via-zinc-900 to-orange-950/40 border border-blue-600/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20">
                <Bot className="w-3.5 h-3.5" />
                NGD Intelligent Assistant
              </span>
              <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-full text-xs font-semibold">
                Multi-Turn & Grounded
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold">
                Blue & Orange Theme
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NGD Chatbot &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400">
                Multi-Modal Studio
              </span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Equipped with multi-turn reasoning, Google Search & Maps Grounding, Gemini 3.5 audio transcription, live bidirectional voice (Live API), Gemini 3.1 image studio, and Lyria music generation.
            </p>
          </div>

          {/* Quick Stats or Chat Link */}
          {onPostToChat && (
            <button
              onClick={() =>
                onPostToChat(
                  `🤖 *Update from NGD Assistant:*\n\nNGD is active with Multi-Turn Gemini 3, Search Grounding, Maps Navigation, Audio Transcription, and Creative Studios!`
                )
              }
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-lg shadow-orange-500/30 transition-all cursor-pointer flex-shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>Broadcast to Google Chat</span>
            </button>
          )}
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex space-x-2 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'chat', label: '💬 Multi-Turn Chat', icon: MessageSquare },
            { id: 'search', label: '🔍 Google Search', icon: Search },
            { id: 'maps', label: '🗺️ Google Maps', icon: MapPin },
            { id: 'transcribe', label: '🎙️ Transcribe Audio', icon: Mic },
            { id: 'live', label: '⚡ Live Voice (3.8 Live)', icon: Radio },
            { id: 'image', label: '🎨 Image Studio', icon: ImageIcon },
            { id: 'music', label: '🎵 Lyria Music', icon: Music },
          ].map((mode) => {
            const isSelected = activeSubMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveSubMode(mode.id as any)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md shadow-orange-500/20 font-bold'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. MULTI-TURN GEMINI CHAT */}
      {/* ---------------------------------------------------- */}
      {activeSubMode === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Thread */}
          <div className="lg:col-span-3 bg-zinc-900/90 border border-zinc-800 rounded-3xl shadow-xl flex flex-col h-[580px] overflow-hidden">
            {/* Chat Header Bar */}
            <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>NGD Conversational Thread</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Model: <strong className="text-orange-400">{selectedModel}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setChatMessages([
                    {
                      id: Date.now().toString(),
                      role: 'model',
                      text: `Conversation cleared. I am NGD, ready for your next request!`,
                      timestamp: 'Just now',
                      modelUsed: selectedModel,
                    },
                  ])
                }
                className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            </div>

            {/* Scrollable Message Thread */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-5 overflow-y-auto space-y-4 pr-3 scrollbar-thin"
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-md shadow-blue-600/30">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none shadow-md shadow-blue-600/20'
                          : 'bg-zinc-950/90 text-zinc-200 border border-zinc-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center space-x-2 px-1 text-[10px] text-zinc-500">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <span className="text-orange-400/90 font-mono">[{msg.modelUsed}]</span>
                      )}
                      {msg.role === 'model' && onPostToChat && (
                        <button
                          onClick={() => onPostToChat(`*NGD Assistant:*\n\n${msg.text}`)}
                          className="text-orange-400 hover:text-orange-300 flex items-center gap-0.5 ml-2 cursor-pointer"
                        >
                          <Share2 className="w-2.5 h-2.5" />
                          <span>Share to Google Chat</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-md shadow-orange-600/20">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isGeneratingChat && (
                <div className="flex items-center space-x-2 text-xs text-orange-400 p-3 bg-zinc-950/50 rounded-xl max-w-xs">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span>NGD is reasoning & generating...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-zinc-800/80 bg-zinc-950/80">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask NGD anything about voice architectures, code, or workspace tools..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isGeneratingChat}
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>

          {/* Model & System Role Controls Sidebar */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800">
                <Sliders className="w-4 h-4 text-orange-400" />
                <h4 className="text-sm font-bold text-white">Bot Personality & Model</h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Select Gemini Model
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    {
                      id: 'gemini-3.5-flash',
                      title: 'gemini-3.5-flash',
                      desc: 'Recommended for general tasks (balanced speed & intellect)',
                    },
                    {
                      id: 'gemini-3.1-pro-preview',
                      title: 'gemini-3.1-pro-preview',
                      desc: 'For particularly complex coding & deep reasoning',
                    },
                    {
                      id: 'gemini-3.1-flash-lite',
                      title: 'gemini-3.1-flash-lite',
                      desc: 'Tasks that should happen ultra-fast',
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id as any)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedModel === m.id
                          ? 'bg-blue-950/60 border-orange-500/60 text-white'
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-mono font-bold block text-blue-300">{m.title}</span>
                      <span className="text-[10px] text-zinc-400 leading-tight block mt-0.5">
                        {m.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  System Instruction / Role
                </label>
                <textarea
                  value={systemRole}
                  onChange={(e) => setSystemRole(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-orange-500 font-mono leading-relaxed"
                />
              </div>

              {/* Sample Quick Prompts */}
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-1.5">
                  Quick Prompt Starters:
                </span>
                <div className="space-y-1">
                  {[
                    'Explain the latency advantage of Silero VAD over WebRTC VAD',
                    'Write a Python decorator for registering voice skills in NGD',
                    'How does Apache 2.0 protect AI model contributors from patent claims?',
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputMessage(p)}
                      className="w-full text-left text-[11px] p-2 bg-zinc-950/70 hover:bg-blue-950/40 hover:text-orange-300 text-zinc-400 rounded-lg border border-zinc-800/60 truncate cursor-pointer transition-colors"
                    >
                      • {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
              Theme: Electric Blue & Flame Orange
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. GOOGLE SEARCH GROUNDING */}
      {/* ---------------------------------------------------- */}
      {activeSubMode === 'search' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Search Grounding</h3>
              <p className="text-xs text-zinc-400">
                Grounds NGD answers in real-time Google web data using model <strong className="text-orange-400">gemini-3.5-flash</strong> with the <code className="text-blue-300">googleSearch</code> tool.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search current events, latest Python releases, AI research papers..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearchGrounding()}
            />
            <button
              onClick={() => handleSearchGrounding()}
              disabled={!searchQuery.trim() || isSearching}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search Web</span>
            </button>
          </div>

          {/* Search Result Display */}
          {searchResult && (
            <div className="space-y-4 pt-2">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {searchResult.reply}
              </div>

              {/* Grounding Citations */}
              {searchResult.chunks && searchResult.chunks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Source Citations & Web Links
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {searchResult.chunks.map((c, i) => {
                      if (!c.web?.uri) return null;
                      return (
                        <a
                          key={i}
                          href={c.web.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-zinc-950/80 hover:bg-blue-950/50 border border-zinc-800 hover:border-blue-500/50 rounded-xl text-xs text-blue-300 hover:text-white flex items-center justify-between transition-colors group"
                        >
                          <span className="truncate pr-2 font-medium">{c.web.title || c.web.uri}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 flex-shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. GOOGLE MAPS GROUNDING */}
      {/* ---------------------------------------------------- */}
      {activeSubMode === 'maps' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Maps Grounding</h3>
              <p className="text-xs text-zinc-400">
                Grounds geospatial queries using model <strong className="text-orange-400">gemini-3.5-flash</strong> with the <code className="text-blue-300">googleMaps</code> tool and clickable Maps links.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={mapsQuery}
              onChange={(e) => setMapsQuery(e.target.value)}
              placeholder="Find nearby coffee shops, tech hubs in San Francisco, EV chargers..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
              onKeyDown={(e) => e.key === 'Enter' && handleMapsGrounding()}
            />
            <button
              onClick={handleMapsGrounding}
              disabled={!mapsQuery.trim() || isLocating}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-lg shadow-orange-500/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLocating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              <span>Explore Maps</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              id="gpsToggle"
              checked={useCurrentGps}
              onChange={(e) => setUseCurrentGps(e.target.checked)}
              className="accent-orange-500"
            />
            <label htmlFor="gpsToggle">Include my browser geolocation coordinates (latitude / longitude)</label>
          </div>

          {/* Maps Result */}
          {mapsResult && (
            <div className="space-y-4 pt-2">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {mapsResult.reply}
              </div>

              {mapsResult.chunks && mapsResult.chunks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Place Locations & Directions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {mapsResult.chunks.map((c: any, i: number) => {
                      const uri = c.maps?.uri;
                      const title = c.maps?.title || 'Open in Google Maps';
                      if (!uri) return null;
                      return (
                        <a
                          key={i}
                          href={uri}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-zinc-950/80 hover:bg-orange-950/40 border border-zinc-800 hover:border-orange-500/50 rounded-xl text-xs text-orange-300 hover:text-white flex items-center justify-between transition-colors group"
                        >
                          <span className="truncate pr-2 font-medium">{title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400 flex-shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. AUDIO TRANSCRIPTION (gemini-3.5-transcribe) */}
      {/* ---------------------------------------------------- */}
      {activeSubMode === 'transcribe' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Audio Transcription</h3>
              <p className="text-xs text-zinc-400">
                High-fidelity speech transcription powered by <strong className="text-orange-400">gemini-3.5-transcribe</strong>. Speak via microphone or upload an audio file.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
              className={`px-6 py-3.5 rounded-2xl font-bold flex items-center space-x-2.5 text-xs sm:text-sm transition-all shadow-xl cursor-pointer ${
                isRecordingAudio
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white shadow-orange-500/20'
              }`}
            >
              {isRecordingAudio ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecordingAudio ? 'Stop & Transcribe' : 'Record from Microphone'}</span>
            </button>

            {/* File Upload Option */}
            <label className="px-5 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 border border-zinc-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-orange-400" />
              <span>Upload Audio (.wav, .mp3, .webm)</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    sendAudioForTranscription(file);
                  }
                }}
              />
            </label>
          </div>

          {isTranscribing && (
            <div className="flex items-center space-x-2 text-xs text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Transcribing audio with gemini-3.5-transcribe...</span>
            </div>
          )}

          {transcribedText && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Transcription Result:
              </h4>
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed font-mono">
                {transcribedText}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transcribedText);
                    onShowToast('success', 'Copied transcript to clipboard');
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Transcript</span>
                </button>
                {onPostToChat && (
                  <button
                    onClick={() => onPostToChat(`🎙️ *Voice Transcription:*\n\n"${transcribedText}"`)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send to Google Chat</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. LIVE VOICE CONVERSATIONS (gemini-3.8-live) */}
      {/* ---------------------------------------------------- */}
      {activeSubMode === 'live' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gemini 3.8 Live API Voice Session</h3>
              <p className="text-xs text-zinc-400">
                Low-latency real-time voice conversations with <strong className="text-orange-400">gemini-3.8-live</strong> via bidirectional WebSocket audio streaming.
              </p>
            </div>
          </div>

          <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-4">
            {/* Visualizer Simulation */}
            <div className="flex items-center justify-center space-x-1.5 h-16 max-w-sm mx-auto">
              {[20, 45, 75, 90, 60, 85, 30, 95, 70, 40, 80, 50, 65, 35].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isLiveConnected
                      ? 'bg-gradient-to-t from-blue-600 to-orange-400 animate-pulse'
                      : 'bg-zinc-800'
                  }`}
                  style={{ height: isLiveConnected ? `${(h * 0.7) + 10}px` : '10px' }}
                />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 font-mono">{liveTranscript}</p>

            <button
              onClick={toggleLiveVoice}
              className={`px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center space-x-2 mx-auto shadow-xl transition-all cursor-pointer ${
                isLiveConnected
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white shadow-orange-500/25'
              }`}
            >
              {isLiveConnected ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isLiveConnected ? 'Disconnect Live Session' : 'Connect Live Voice Session'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. CREATE & EDIT IMAGES */}
      {/* ---------------------------------------------------- */}
      {activeSubMode === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Image */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-800">
              <ImageIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">Create Image (gemini-3.1-flash-image)</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Prompt:
              </label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Aspect Ratio:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setImageAspectRatio(ratio)}
                    className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      imageAspectRatio === ratio
                        ? 'bg-blue-600 text-white border-blue-500 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !imagePrompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isGeneratingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Image</span>
            </button>
          </div>

          {/* Edit Existing Image */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-800">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white">Edit Image with Text</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Select Base Image for Editing:
              </label>
              {sourceImageForEdit ? (
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-zinc-700">
                  <img src={sourceImageForEdit} alt="Source" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSourceImageForEdit(null)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-[10px] p-1 rounded"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-zinc-700 hover:border-orange-500 rounded-xl p-4 flex flex-col items-center justify-center text-xs text-zinc-400 cursor-pointer">
                  <Upload className="w-5 h-5 text-orange-400 mb-1" />
                  <span>Upload Image to edit</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setSourceImageForEdit(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Editing Instruction:
              </label>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                rows={2}
                placeholder="e.g., Add glowing blue neon headphones..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleEditImage}
              disabled={isEditingImage || !sourceImageForEdit || !editPrompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isEditingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Apply Image Edits</span>
            </button>
          </div>

          {/* Render Generated Image Artifact */}
          {generatedImage && (
            <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Generated / Edited Image Output:
              </h4>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full max-w-sm rounded-2xl border border-zinc-700 shadow-2xl"
                />
                <div className="space-y-3">
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    Rendered with Gemini 3.1 Flash Image. High-resolution canvas ready to use for GitHub social cards or avatar logos.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSourceImageForEdit(generatedImage)}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl"
                    >
                      Use as Input for Editing
                    </button>
                    <a
                      href={generatedImage}
                      download="ngd_assistant_art.png"
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                    >
                      Download PNG
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. GENERATE MUSIC (Lyria-3-Clip) */}
      {/* ---------------------------------------------------- */}
      {activeSubMode === 'music' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl text-white shadow-md shadow-orange-500/20">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Music Generation (Lyria-3-Clip)</h3>
              <p className="text-xs text-zinc-400">
                Generate high-energy music tracks up to 30s using model <strong className="text-orange-400">lyria-3-clip-preview</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Music Track Concept:
            </label>
            <textarea
              value={musicPrompt}
              onChange={(e) => setMusicPrompt(e.target.value)}
              rows={2}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            onClick={handleGenerateMusic}
            disabled={isGeneratingMusic || !musicPrompt.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-lg shadow-orange-500/30 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isGeneratingMusic ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
            <span>Compose Music Track</span>
          </button>

          {generatedMusic && (
            <div className="space-y-4 pt-2">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                  Composed Track Playback:
                </span>
                <audio controls src={generatedMusic.audioDataUrl} className="w-full accent-orange-500" />
                {generatedMusic.lyrics && (
                  <p className="text-xs text-zinc-400 italic pt-1 font-serif">
                    "{generatedMusic.lyrics}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
