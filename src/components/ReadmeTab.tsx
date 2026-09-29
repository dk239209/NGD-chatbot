/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepoConfig } from '../types/repo';
import { generateReadme } from '../data/repoTemplates';
import {
  Copy,
  Check,
  Download,
  Eye,
  FileCode,
  Share2,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface ReadmeTabProps {
  config: RepoConfig;
  onCopy: (text: string, label: string) => void;
  onPostToChat?: (text: string) => void;
  isChatConnected: boolean;
}

export const ReadmeTab: React.FC<ReadmeTabProps> = ({
  config,
  onCopy,
  onPostToChat,
  isChatConnected,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const readmeContent = generateReadme(config);

  const handleCopy = () => {
    onCopy(readmeContent, 'README.md Content');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([readmeContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>README.md</span>
              <span className="text-xs font-mono font-normal text-zinc-400">
                ({readmeContent.split('\n').length} lines • Markdown formatted)
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Production-ready repository README tailored for GitHub star conversions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Formatted Preview</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Raw Markdown Source</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download .md</span>
          </button>

          {onPostToChat && (
            <button
              onClick={() =>
                onPostToChat(
                  `📄 *README.md Overview for ${config.repoName}*\n\n${config.tagline}\n\n*Features:*\n${config.features
                    .slice(0, 4)
                    .map((f) => `• ${f}`)
                    .join('\n')}\n\n*License:* ${config.licenseType}\n*Quickstart:* git clone https://github.com/${config.ownerName}/${config.repoName}.git`
                )
              }
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Post to Google Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        {viewMode === 'raw' ? (
          <div className="relative">
            <pre className="p-6 text-xs sm:text-sm font-mono text-zinc-300 bg-zinc-950 overflow-x-auto leading-relaxed select-all">
              {readmeContent}
            </pre>
          </div>
        ) : (
          <div className="p-6 sm:p-10 prose prose-invert max-w-none space-y-6 text-zinc-300">
            {/* Formatted Preview Rendering */}
            <div className="border-b border-zinc-800 pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">🎙️</span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {config.repoName}
                </h1>
              </div>
              <p className="text-base text-zinc-300 italic mb-4 font-serif">
                "{config.tagline}"
              </p>

              {/* Badges preview */}
              <div className="flex flex-wrap gap-2 pt-1">
                <img
                  src={`https://img.shields.io/badge/License-${config.licenseType}-blue.svg`}
                  alt="License"
                />
                <img
                  src={`https://img.shields.io/badge/python-3.10%2B-blue.svg`}
                  alt="Python"
                />
                <img
                  src={`https://img.shields.io/badge/version-v${config.version}-emerald.svg`}
                  alt="Version"
                />
                <img
                  src={`https://img.shields.io/badge/voice_latency-${encodeURIComponent(
                    config.latencyGoal
                  )}-orange.svg`}
                  alt="Latency"
                />
                <img
                  src="https://img.shields.io/badge/Google_Chat-Connected-4285F4.svg?logo=googlechat&logoColor=white"
                  alt="Google Chat"
                />
                <img
                  src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
                  alt="PRs Welcome"
                />
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🌟 Overview</span>
              </h2>
              <p className="text-sm leading-relaxed text-zinc-300">
                <strong>{config.repoName}</strong> (Aura) is an ambient, intelligent voice assistant built for developers, power users, and enterprise workspaces. It combines continuous streaming audio capture, local voice activity detection (VAD), lightning-fast speech-to-text, reasoning models, and expressive neural speech synthesis to deliver a hands-free conversational experience with sub-second turnaround times.
              </p>
            </div>

            {/* Key Capabilities */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>✨ Key Capabilities</span>
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm pl-0 list-none">
                {config.features.map((feat, i) => (
                  <li
                    key={i}
                    className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-start space-x-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture Diagram */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🏗️ Architecture & Voice Pipeline</span>
              </h2>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-indigo-300 overflow-x-auto">
{`+------------------+      +-------------------+      +-----------------------+
|  Microphone In   | ---> |  Silero VAD 4.0   | ---> | Streaming Whisper STT |
|  (48kHz / 16-bit)|      |  Voice Detection  |      | Chunked Audio Stream  |
+------------------+      +-------------------+      +-----------------------+
                                                                 |
                                                                 v
+------------------+      +-------------------+      +-----------------------+
|  Neural Speaker  | <--- | Fast Neural TTS   | <--- |   Orchestration Core  |
|  Audio Playback  |      | Piper / Kokoro    |      | Context Memory + LLM  |
+------------------+      +-------------------+      +-----------------------+
                                                                 |
                                                                 v
                                                     +-----------------------+
                                                     | Google Chat & Actions |
                                                     | Webhooks, Workspace   |
                                                     +-----------------------+`}
              </div>
            </div>

            {/* Quick Start */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⚡ Quick Start</span>
              </h2>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2">
                <p className="text-zinc-500"># 1. Clone & activate virtual environment</p>
                <p className="text-emerald-400">git clone https://github.com/{config.ownerName}/{config.repoName}.git</p>
                <p className="text-emerald-400">cd {config.repoName} && python -m venv .venv && source .venv/bin/activate</p>
                <p className="text-zinc-500"># 2. Install requirements & run audio test</p>
                <p className="text-emerald-400">pip install -r requirements.txt</p>
                <p className="text-emerald-400">python -m aura.cli start --wake-word "{config.wakeWord}"</p>
              </div>
            </div>

            {/* Python SDK */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>💻 Python SDK Embed Example</span>
              </h2>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
{`from aura import AuraAssistant, VoicePipelineConfig

assistant = AuraAssistant(VoicePipelineConfig(wake_word="${config.wakeWord}"))

@assistant.on_intent("broadcast_summary")
async def handle_broadcast(intent):
    await assistant.integrations.google_chat.send_message(
        space_id="spaces/YOUR_SPACE", text=intent.text
    )

await assistant.listen_forever()`}
              </div>
            </div>

            {/* License notice */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Licensed under {config.licenseType}</span>
              <span>© {config.year} {config.authorName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
