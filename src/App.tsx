/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './services/firebase';
import { DEFAULT_REPO_CONFIG } from './data/repoTemplates';
import { RepoConfig } from './types/repo';
import { Header } from './components/Header';
import { RepoOverviewTab } from './components/RepoOverviewTab';
import { ReadmeTab } from './components/ReadmeTab';
import { InstallationTab } from './components/InstallationTab';
import { LicenseTab } from './components/LicenseTab';
import { ScaffoldingTab } from './components/ScaffoldingTab';
import { GoogleChatSection } from './components/GoogleChatSection';
import { VoiceAssistantPlayground } from './components/VoiceAssistantPlayground';
import { NgdChatbotTab } from './components/NgdChatbotTab';
import { PlatformsTab } from './components/PlatformsTab';
import { OfflineIndicator } from './components/OfflineIndicator';
import { NgdHeroBanner, SubMode } from './components/NgdHeroBanner';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Github, Mic, Heart, Bot } from 'lucide-react';

export default function App() {
  const [repoConfig, setRepoConfig] = useState<RepoConfig>(DEFAULT_REPO_CONFIG);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ngdchat');
  const [subMode, setSubMode] = useState<SubMode>('chat');
  const [chatDraftText, setChatDraftText] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notification helper
  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Clipboard copy helper
  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('success', `Copied ${label}`, 'Ready to paste into your files or terminal.');
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('success', `Copied ${label}`, 'Ready to paste into your files or terminal.');
    }
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser: User, token: string) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Handle Google Sign In
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        showToast(
          'success',
          'Connected to Google Chat',
          `Signed in as ${result.user.displayName || result.user.email}`
        );
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      showToast(
        'error',
        'Google Sign-In Cancelled or Failed',
        err.message || 'Please check popup settings and try again.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Google Sign Out
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      showToast('info', 'Signed Out', 'Cleared Google Chat connection.');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Trigger Google Chat post transition from any tab
  const handlePostToChat = (text: string) => {
    setChatDraftText(text);
    setActiveTab('googlechat');
    showToast('info', 'Loaded Message into Google Chat', 'Review and confirm destination space.');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Top Studio Hero Banner matching screenshot */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <NgdHeroBanner
          activeSubMode={subMode}
          onSubModeChange={(m) => {
            setSubMode(m);
            setActiveTab('ngdchat');
          }}
          onPostToChat={handlePostToChat}
          onOpenPlatforms={() => setActiveTab('platforms')}
        />
      </div>

      {/* Main App Header */}
      <Header
        repoConfig={repoConfig}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'ngdchat' && (
          <NgdChatbotTab
            repoConfig={repoConfig}
            activeSubMode={subMode}
            onSubModeChange={setSubMode}
            hideHeroBanner={true}
            onPostToChat={handlePostToChat}
            onShowToast={showToast}
            isChatConnected={!!user}
          />
        )}

        {activeTab === 'platforms' && (
          <PlatformsTab
            onCopy={handleCopy}
            onPostToChat={handlePostToChat}
          />
        )}

        {activeTab === 'overview' && (
          <RepoOverviewTab
            config={repoConfig}
            onChangeConfig={setRepoConfig}
            onCopy={handleCopy}
            onPostToChat={handlePostToChat}
            isChatConnected={!!user}
          />
        )}

        {activeTab === 'readme' && (
          <ReadmeTab
            config={repoConfig}
            onCopy={handleCopy}
            onPostToChat={handlePostToChat}
            isChatConnected={!!user}
          />
        )}

        {activeTab === 'installation' && (
          <InstallationTab
            config={repoConfig}
            onCopy={handleCopy}
            onPostToChat={handlePostToChat}
            isChatConnected={!!user}
          />
        )}

        {activeTab === 'license' && (
          <LicenseTab
            config={repoConfig}
            onChangeConfig={setRepoConfig}
            onCopy={handleCopy}
          />
        )}

        {activeTab === 'scaffolding' && (
          <ScaffoldingTab
            config={repoConfig}
            onCopy={handleCopy}
            onPostToChat={handlePostToChat}
          />
        )}

        {activeTab === 'googlechat' && (
          <GoogleChatSection
            user={user}
            accessToken={accessToken}
            repoConfig={repoConfig}
            initialMessageText={chatDraftText}
            onLogin={handleLogin}
            isLoggingIn={isLoggingIn}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'playground' && (
          <VoiceAssistantPlayground
            repoConfig={repoConfig}
            onPostToChat={handlePostToChat}
            isChatConnected={!!user}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 mt-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-orange-400" />
            <span className="font-semibold text-zinc-300">NGD Voice & Multi-Modal Assistant</span>
            <span>— Open-Source GitHub Repository & Launch Studio</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">
              License: <strong className="text-orange-400 font-mono">{repoConfig.licenseType}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500 inline" /> in Blue & Orange Theme
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
