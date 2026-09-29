/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Bot,
  MessageSquare,
  Search,
  MapPin,
  Mic,
  Radio,
  Image as ImageIcon,
  Music,
  Share2,
  Smartphone,
} from 'lucide-react';

export type SubMode = 'chat' | 'search' | 'maps' | 'transcribe' | 'live' | 'image' | 'music';

interface NgdHeroBannerProps {
  activeSubMode: SubMode;
  onSubModeChange: (mode: SubMode) => void;
  onPostToChat?: (text: string) => void;
  onOpenPlatforms?: () => void;
}

export const NgdHeroBanner: React.FC<NgdHeroBannerProps> = ({
  activeSubMode,
  onSubModeChange,
  onPostToChat,
  onOpenPlatforms,
}) => {
  return (
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
            <span
              className="gradient-text-hero font-extrabold"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >
              Multi-Modal Studio
            </span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Equipped with multi-turn reasoning, Google Search & Maps Grounding, Gemini 3.5 audio transcription, live bidirectional voice (Live API), Gemini 3.1 image studio, and Lyria music generation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
          {onOpenPlatforms && (
            <button
              onClick={onOpenPlatforms}
              className="px-4 py-3 bg-blue-600/90 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border border-blue-400/40 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-blue-200" />
              <span>Windows & Android App</span>
            </button>
          )}

          {onPostToChat && (
            <button
              onClick={() =>
                onPostToChat(
                  `🤖 *Update from NGD Assistant:*\n\nNGD is active with Multi-Turn Gemini 3, Search Grounding, Maps Navigation, Audio Transcription, and Creative Studios!`
                )
              }
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Broadcast to Google Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature Sub-Navigation Tabs */}
      <div className="mt-6 pt-5 border-t border-zinc-800/80 flex space-x-2 overflow-x-auto scrollbar-none text-xs font-semibold">
        {[
          { id: 'chat' as SubMode, label: '💬 Multi-Turn Chat', icon: MessageSquare },
          { id: 'search' as SubMode, label: '🔍 Google Search', icon: Search },
          { id: 'maps' as SubMode, label: '🗺️ Google Maps', icon: MapPin },
          { id: 'transcribe' as SubMode, label: '🎙️ Transcribe Audio', icon: Mic },
          { id: 'live' as SubMode, label: '⚡ Live Voice (3.8 Live)', icon: Radio },
          { id: 'image' as SubMode, label: '🎨 Image Studio', icon: ImageIcon },
          { id: 'music' as SubMode, label: '🎵 Lyria Music', icon: Music },
        ].map((mode) => {
          const isSelected = activeSubMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSubModeChange(mode.id)}
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
  );
};
