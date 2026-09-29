/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  RotateCcw,
  Send,
  MessageSquare,
  Activity,
  Sliders,
  Check,
} from 'lucide-react';
import { RepoConfig } from '../types/repo';

interface VoiceAssistantPlaygroundProps {
  repoConfig: RepoConfig;
  onPostToChat?: (text: string) => void;
  isChatConnected: boolean;
}

interface ConversationMessage {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  timestamp: string;
}

export const VoiceAssistantPlayground: React.FC<VoiceAssistantPlaygroundProps> = ({
  repoConfig,
  onPostToChat,
  isChatConnected,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [wakeWordTriggered, setWakeWordTriggered] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      sender: 'aura',
      text: `Hello! I am NGD, your intelligent AI voice assistant. You can speak to me or select prompts below to generate GitHub documentation, test our live voice model, or broadcast repository announcements to Google Chat.`,
      timestamp: 'Just now',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          // Check wake word
          if (
            currentTranscript.toLowerCase().includes(repoConfig.wakeWord.toLowerCase()) ||
            currentTranscript.toLowerCase().includes('aura')
          ) {
            setWakeWordTriggered(true);
          }

          // If final result
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            handleUserQuery(currentTranscript);
            setTranscript('');
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [repoConfig.wakeWord]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setWakeWordTriggered(false);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled || !synthRef.current) return;

    synthRef.current.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;

    // Pick a natural voice if available
    const voices = synthRef.current.getVoices();
    const englishVoice =
      voices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleUserQuery = (userText: string) => {
    const cleanText = userText.trim();
    if (!cleanText) return;

    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Generate smart response based on NGD Voice Assistant knowledge base
    setTimeout(() => {
      const lower = cleanText.toLowerCase();
      let reply = '';

      if (lower.includes('license') || lower.includes('apache')) {
        reply = `NGD is licensed under the Apache 2.0 License. This allows both personal and commercial use, protects contributors with an explicit patent grant, and guarantees that our trademarks are respected while keeping the source open for everyone.`;
      } else if (lower.includes('install') || lower.includes('setup')) {
        reply = `To install NGD, clone the repository, create a virtual environment, install PortAudio and FFmpeg, and run 'pip install -r requirements.txt'. You can test your microphone with 'python -m aura.cli test-audio'.`;
      } else if (lower.includes('readme') || lower.includes('document')) {
        reply = `I have generated a complete, battle-tested README.md including our architecture diagram, quick start guide, YAML configuration, Python SDK snippet, and Google Chat integration badges.`;
      } else if (lower.includes('chat') || lower.includes('google')) {
        reply = `Google Chat integration is active! You can broadcast release announcements, repository summaries, and live transcripts directly to any Google Chat space.`;
      } else if (lower.includes('wake word') || lower.includes('wake')) {
        reply = `My default wake word is "${repoConfig.wakeWord}". You can customize sensitivity in 'aura.config.yaml' or adjust it for edge devices running ONNX OpenWakeWord.`;
      } else {
        reply = `Understood. NGD is tuned for sub-150ms latency audio pipelines. I've noted: "${cleanText}". You can copy this transcript or share it directly to your Google Chat workspace!`;
      }

      const auraMsg: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aura',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, auraMsg]);
      speakText(reply);
    }, 450);
  };

  const sampleVoicePrompts = [
    `Hey NGD, explain why Apache 2.0 is the best license for this voice assistant`,
    `NGD, what are the installation prerequisites on Ubuntu and macOS?`,
    `NGD, summarize the key features for our GitHub README hero banner`,
    `NGD, draft a repository launch announcement for our team on Google Chat`,
  ];

  return (
    <div className="space-y-6">
      {/* Voice Assistant Visualizer & Control Pod */}
      <div className="bg-gradient-to-b from-blue-950/40 via-zinc-900 to-zinc-950 border border-blue-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4">
            <Activity className="w-3.5 h-3.5 animate-pulse text-orange-400" />
            <span>Interactive Voice Pipeline Simulator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Talk with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400">NGD</span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mt-2">
            Speak aloud using your browser's microphone or trigger simulated voice commands to experience NGD's low-latency conversational audio flow.
          </p>

          {/* Animated Waveform Visualizer */}
          <div className="my-8 flex items-center justify-center space-x-1.5 h-20 w-full max-w-md bg-zinc-950/70 border border-zinc-800/80 rounded-2xl px-6">
            {[18, 35, 60, 85, 45, 95, 70, 30, 80, 50, 90, 65, 40, 75, 25, 55].map((height, i) => {
              const active = isListening || isSpeaking;
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    active
                      ? isSpeaking
                        ? 'bg-gradient-to-t from-orange-500 to-amber-400'
                        : 'bg-gradient-to-t from-blue-500 to-orange-400 animate-pulse'
                      : 'bg-zinc-800'
                  }`}
                  style={{
                    height: active ? `${Math.max(15, (height * (Math.sin(i + Date.now() / 200) + 1.3)) % 75)}px` : '8px',
                  }}
                />
              );
            })}
          </div>

          {/* Wake Word Indicator */}
          {wakeWordTriggered && (
            <div className="mb-4 inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-medium animate-bounce">
              <Check className="w-3.5 h-3.5" />
              <span>Wake Word Recognized: "{repoConfig.wakeWord}"</span>
            </div>
          )}

          {/* Live Transcript Bubble */}
          {transcript && (
            <div className="mb-4 max-w-lg bg-zinc-800/90 text-zinc-100 text-sm px-4 py-2 rounded-xl border border-zinc-700/60 shadow-lg">
              <span className="text-xs text-indigo-400 block font-semibold mb-0.5">Hearing you:</span>
              "{transcript}"
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={toggleListening}
              className={`px-6 py-3.5 rounded-2xl font-semibold flex items-center space-x-3 text-sm transition-all duration-200 shadow-xl cursor-pointer ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Activate Microphone</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                speechEnabled
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-indigo-400 border-zinc-700'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
              title={speechEnabled ? 'Mute Aura Voice' : 'Unmute Aura Voice'}
            >
              {speechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: 'aura',
                    text: `Conversation reset. I am ready for your next voice command or repository inquiry!`,
                    timestamp: 'Just now',
                  },
                ]);
                if (synthRef.current) synthRef.current.cancel();
              }}
              className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Voice Prompt Shortcuts */}
          <div className="mt-8 w-full max-w-2xl">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
              Try clicking a voice prompt:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {sampleVoicePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserQuery(prompt)}
                  className="p-2.5 bg-zinc-950/80 hover:bg-zinc-800/90 border border-zinc-800 rounded-xl text-xs text-zinc-300 hover:text-white transition-all text-left flex items-start space-x-2 group cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 mt-0.5 text-indigo-400 group-hover:text-indigo-300 flex-shrink-0" />
                  <span className="line-clamp-2">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant Chat Stream & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation History */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Aura Voice Transcript & Logs</h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Pipeline latency: ~140ms
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-2 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-zinc-800/90 text-zinc-200 border border-zinc-700/60 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center space-x-2 mt-1 px-1">
                  <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                  {msg.sender === 'aura' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Replay</span>
                    </button>
                  )}
                  {msg.sender === 'aura' && onPostToChat && (
                    <button
                      onClick={() => onPostToChat(msg.text)}
                      className="text-[10px] text-indigo-300 hover:text-white flex items-center space-x-0.5"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Share to Google Chat</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick text input fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem('customText') as HTMLInputElement);
              if (input && input.value) {
                handleUserQuery(input.value);
                input.value = '';
              }
            }}
            className="pt-3 border-t border-zinc-800 flex items-center space-x-2"
          >
            <input
              type="text"
              name="customText"
              placeholder="Or type a query to test Aura's response..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Audio Engine Configuration Panel */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Audio Engine Controls</h3>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Active Wake Word
                </label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 font-mono text-indigo-400 text-xs">
                  "{repoConfig.wakeWord}"
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-300 mb-1">
                  <span className="font-semibold">Speech Rate (TTS)</span>
                  <span className="text-zinc-500 font-mono">{voiceRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-zinc-300 mb-1">
                  <span className="font-semibold">Voice Pitch</span>
                  <span className="text-zinc-500 font-mono">{voicePitch}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 space-y-2">
                <span className="font-semibold text-zinc-300 block">Workspace Sync</span>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  {isChatConnected
                    ? 'Connected to Google Chat. Voice transcripts can be directly published to channels.'
                    : 'Google Chat is not connected. Use the top bar button to link your workspace.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
            Model: Faster-Whisper + Piper TTS v2
          </div>
        </div>
      </div>
    </div>
  );
};
