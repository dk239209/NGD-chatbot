/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepoConfig } from '../types/repo';
import {
  Copy,
  Check,
  Github,
  Tag,
  Share2,
  Sparkles,
  ExternalLink,
  Edit3,
  Flame,
  Terminal,
  Layers,
} from 'lucide-react';

interface RepoOverviewTabProps {
  config: RepoConfig;
  onChangeConfig: (newConfig: RepoConfig) => void;
  onCopy: (text: string, label: string) => void;
  onPostToChat?: (text: string) => void;
  isChatConnected: boolean;
}

export const RepoOverviewTab: React.FC<RepoOverviewTabProps> = ({
  config,
  onChangeConfig,
  onCopy,
  onPostToChat,
  isChatConnected,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const copyWithFeedback = (text: string, label: string, key: string) => {
    onCopy(text, label);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const quickDescriptions = [
    {
      style: 'Punchy & Star-Attracting (Recommended for GitHub About)',
      text: `${config.tagline}. Sub-180ms latency with streaming speech-to-text, neural TTS, edge wake words, and Google Chat integration.`,
    },
    {
      style: 'Developer & Technical Focus',
      text: `Open-source AI voice assistant engine in Python. Features continuous streaming VAD, local Faster-Whisper, Kokoro/Piper neural speech, and ambient workspace automation.`,
    },
    {
      style: 'Minimal & Clean',
      text: `Ambient, low-latency conversational AI voice assistant for smart desktops and developer workspaces.`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                GitHub Repository Kit
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold">
                Ready for GitHub.com/new
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Repository for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-white">
                Aura AI Voice Assistant
              </span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Everything required to launch a world-class open source repository on GitHub: optimized repository descriptions, topic tags, professional README, installation guide, and full legal licensing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>{isEditing ? 'Close Customizer' : 'Customize Metadata'}</span>
            </button>

            {onPostToChat && (
              <button
                onClick={() =>
                  onPostToChat(
                    `🚀 *New Repository Announcement: ${config.repoName}*\n\n${config.description}\n\n• License: ${config.licenseType}\n• Wake Word: "${config.wakeWord}"\n• Latency: ${config.latencyGoal}\n\nGitHub Repo: https://github.com/${config.ownerName}/${config.repoName}`
                  )
                }
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to Google Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Edit Drawer */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs animate-in slide-in-from-top duration-200">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Repository Name</label>
              <input
                type="text"
                value={config.repoName}
                onChange={(e) => onChangeConfig({ ...config, repoName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Owner / Organization</label>
              <input
                type="text"
                value={config.ownerName}
                onChange={(e) => onChangeConfig({ ...config, ownerName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Wake Word</label>
              <input
                type="text"
                value={config.wakeWord}
                onChange={(e) => onChangeConfig({ ...config, wakeWord: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-zinc-400 font-medium mb-1">Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => onChangeConfig({ ...config, tagline: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Latency Goal</label>
              <input
                type="text"
                value={config.latencyGoal}
                onChange={(e) => onChangeConfig({ ...config, latencyGoal: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* GitHub "About" Box Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* GitHub Repository Descriptions */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  GitHub "About" Repository Description Options
                </h3>
              </div>
              <span className="text-xs text-zinc-400">Click to copy</span>
            </div>

            <div className="space-y-3">
              {quickDescriptions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-zinc-950/70 border border-zinc-800/90 hover:border-indigo-500/50 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {item.style}
                    </span>
                    <button
                      onClick={() =>
                        copyWithFeedback(item.text, 'Repository Description', `desc-${idx}`)
                      }
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSection === `desc-${idx}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Description</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {item.text}
                  </p>
                  <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                    Length: {item.text.length} chars (within GitHub's 350-character limit)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Topics / Tags */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  GitHub Recommended Topics & Search Keywords
                </h3>
              </div>
              <button
                onClick={() =>
                  copyWithFeedback(config.topics.join(', '), 'GitHub Topics', 'all-topics')
                }
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 cursor-pointer"
              >
                {copiedSection === 'all-topics' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied all!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy all comma-separated</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Adding relevant GitHub topics boosts discovery across developer searches, GitHub Trending, and Open Source topics.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {config.topics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => copyWithFeedback(topic, `Topic "${topic}"`, `topic-${i}`)}
                  className="px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/40 hover:border-indigo-500 text-indigo-300 text-xs font-mono rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                  title="Click to copy single topic"
                >
                  <span>{topic}</span>
                  {copiedSection === `topic-${i}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-50 hover:opacity-100" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: GitHub Card Mockup & Quick CLI Setup */}
        <div className="space-y-6">
          {/* GitHub Repo Creation Quick Steps */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Create on GitHub in 30 Seconds</h3>
            </div>

            <ol className="text-xs text-zinc-300 space-y-3 pl-4 list-decimal marker:text-indigo-400">
              <li>
                Open{' '}
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 underline inline-flex items-center gap-0.5"
                >
                  github.com/new <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                Set repository name to{' '}
                <span className="font-mono text-indigo-300 bg-zinc-950 px-1 py-0.5 rounded">
                  {config.repoName}
                </span>
              </li>
              <li>Paste the recommended description above into the "Description" box.</li>
              <li>Select **Public** and check **Add a README file**.</li>
              <li>
                Select license: **{config.licenseType}** (or paste our custom-tuned full text from the License tab).
              </li>
            </ol>

            <div className="pt-2 border-t border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">Git CLI Init Command:</span>
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300 flex items-center justify-between">
                <span className="truncate">
                  gh repo create {config.repoName} --public --clone
                </span>
                <button
                  onClick={() =>
                    copyWithFeedback(
                      `gh repo create ${config.repoName} --public --description "${config.tagline}" --clone`,
                      'GitHub CLI command',
                      'gh-cli'
                    )
                  }
                  className="text-zinc-400 hover:text-white ml-2 flex-shrink-0"
                >
                  {copiedSection === 'gh-cli' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Social Preview / Badges Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Included Repository Badges</h3>
            </div>
            <div className="space-y-2 pt-1">
              <img
                src={`https://img.shields.io/badge/License-${config.licenseType}-blue.svg`}
                alt="License"
                className="h-5"
              />
              <img
                src="https://img.shields.io/badge/python-3.10%2B-blue.svg"
                alt="Python"
                className="h-5"
              />
              <img
                src={`https://img.shields.io/badge/voice_latency-${encodeURIComponent(config.latencyGoal)}-orange.svg`}
                alt="Latency"
                className="h-5"
              />
              <img
                src="https://img.shields.io/badge/Google_Chat-Connected-4285F4.svg?logo=googlechat&logoColor=white"
                alt="Google Chat"
                className="h-5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
