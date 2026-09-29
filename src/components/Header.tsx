/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Mic,
  Github,
  Star,
  GitFork,
  MessageSquare,
  LogOut,
  Sparkles,
  ExternalLink,
  Bot,
  Dog,
  Smartphone,
} from 'lucide-react';
import { RepoConfig } from '../types/repo';

interface HeaderProps {
  repoConfig: RepoConfig;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  repoConfig,
  user,
  onLogin,
  onLogout,
  isLoggingIn,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-orange-500 shadow-lg shadow-orange-500/20 text-white font-bold">
              <Dog className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span className="text-zinc-400 font-normal">{repoConfig.ownerName}/</span>
                  <span
                    className="gradient-text-blue-orange font-bold"
                    style={{
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block',
                    }}
                  >
                    {repoConfig.repoName}
                  </span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-orange-300 bg-orange-950/70 border border-orange-500/40 rounded-full uppercase">
                  v{repoConfig.version}
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden md:block">
                NGD Voice Assistant & Multi-Task Bot Studio
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2.5">
            {/* Native App Installer for Windows & Android */}
            <PWAInstallButton onOpenPlatformsTab={() => onTabChange('platforms')} />

            {/* GitHub Stats Mockup */}
            <div className="hidden lg:flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300">
              <Github className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-zinc-400">Stars</span>
              <span className="font-semibold text-amber-400 flex items-center">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" /> 1.2k
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 font-mono flex items-center">
                <GitFork className="w-3 h-3 mr-0.5 text-zinc-400" /> 184
              </span>
            </div>

            {/* Google Chat Integration Status */}
            {user ? (
              <div className="flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/30 rounded-xl px-2.5 py-1.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-6 h-6 rounded-full border border-indigo-400/40 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
                    {user.email ? user.email[0].toUpperCase() : 'G'}
                  </div>
                )}
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-medium text-white flex items-center gap-1">
                    <span className="truncate max-w-[100px]">{user.displayName || 'Google User'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="text-[10px] text-indigo-300">Google Chat Connected</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out of Google"
                  className="text-zinc-400 hover:text-rose-400 p-1 rounded hover:bg-zinc-800/80 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <GoogleSignInButton
                  onClick={onLogin}
                  disabled={isLoggingIn}
                  label={isLoggingIn ? 'Connecting...' : 'Connect Google Chat'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1.5 overflow-x-auto py-2.5 border-t border-zinc-800/60 scrollbar-none text-xs sm:text-sm">
          {[
            { id: 'ngdchat', label: '🤖 NGD Chatbot & Tools', icon: Bot, isHighlight: true },
            { id: 'platforms', label: '📱 Windows & Android App', icon: Smartphone, isHighlight: true },
            { id: 'overview', label: 'Repository Description & Tags', icon: Github },
            { id: 'readme', label: 'README.md', icon: Sparkles },
            { id: 'installation', label: 'INSTALLATION.md', icon: ExternalLink },
            { id: 'license', label: 'License & Legal (Apache 2.0)', icon: Sparkles },
            { id: 'scaffolding', label: 'Repo Files & Config', icon: ExternalLink },
            { id: 'googlechat', label: 'Google Chat Hub', icon: MessageSquare },
            { id: 'playground', label: 'Voice Assistant Demo', icon: Mic },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 to-orange-500/25 text-orange-300 border border-orange-500/50 shadow-md shadow-orange-500/10'
                    : tab.isHighlight
                    ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-950/30 border border-orange-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : tab.isHighlight ? 'text-orange-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
