/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ConfirmationModal } from './ConfirmationModal';
import { GoogleChatSpace, GoogleChatMessage } from '../types/chat';
import { listChatSpaces, listSpaceMessages, sendChatMessage } from '../services/googleChat';
import { RepoConfig } from '../types/repo';
import {
  MessageSquare,
  Send,
  RefreshCw,
  Users,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Hash,
} from 'lucide-react';

interface GoogleChatSectionProps {
  user: User | null;
  accessToken: string | null;
  repoConfig: RepoConfig;
  initialMessageText?: string;
  onLogin: () => void;
  isLoggingIn: boolean;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const GoogleChatSection: React.FC<GoogleChatSectionProps> = ({
  user,
  accessToken,
  repoConfig,
  initialMessageText = '',
  onLogin,
  isLoggingIn,
  onShowToast,
}) => {
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [messages, setMessages] = useState<GoogleChatMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState<string>(initialMessageText);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Confirmation Modal State (MANDATORY per Workspace Skill rules)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingText, setPendingText] = useState('');

  // Update draft if external trigger sent message text
  useEffect(() => {
    if (initialMessageText) {
      setMessageDraft(initialMessageText);
    }
  }, [initialMessageText]);

  // Fetch spaces on token availability
  useEffect(() => {
    if (accessToken) {
      loadSpaces();
    } else {
      setSpaces([]);
      setMessages([]);
      setSelectedSpace('');
    }
  }, [accessToken]);

  // Fetch messages when selected space changes
  useEffect(() => {
    if (accessToken && selectedSpace) {
      loadMessages(selectedSpace);
    }
  }, [selectedSpace, accessToken]);

  const loadSpaces = async () => {
    if (!accessToken) return;
    setLoadingSpaces(true);
    try {
      const fetched = await listChatSpaces(accessToken);
      setSpaces(fetched);
      if (fetched.length > 0 && !selectedSpace) {
        setSelectedSpace(fetched[0].name);
      }
    } catch (err: any) {
      console.error('Failed to load Google Chat spaces:', err);
      onShowToast(
        'error',
        'Could not load Google Chat spaces',
        err.message || 'Please verify Google Workspace permissions.'
      );
    } finally {
      setLoadingSpaces(false);
    }
  };

  const loadMessages = async (spaceName: string) => {
    if (!accessToken) return;
    setLoadingMessages(true);
    try {
      const fetched = await listSpaceMessages(accessToken, spaceName);
      setMessages(fetched);
    } catch (err: any) {
      console.error('Failed to load space messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // User clicked "Send" button -> First open confirmation modal
  const handleInitiateSend = (text: string) => {
    if (!text.trim()) {
      onShowToast('info', 'Please enter a message to send.');
      return;
    }
    if (!selectedSpace) {
      onShowToast('info', 'Please select a Google Chat space first.');
      return;
    }

    setPendingText(text);
    setShowConfirmModal(true);
  };

  // User confirmed action in the modal -> Execute API call
  const handleConfirmSend = async () => {
    if (!accessToken || !selectedSpace || !pendingText) return;

    setIsSending(true);
    try {
      await sendChatMessage(accessToken, selectedSpace, pendingText);
      setShowConfirmModal(false);
      setMessageDraft('');
      onShowToast('success', 'Message sent to Google Chat successfully!');
      // Reload messages
      loadMessages(selectedSpace);
    } catch (err: any) {
      console.error('Failed to send Google Chat message:', err);
      onShowToast('error', 'Failed to send message', err.message);
    } finally {
      setIsSending(false);
    }
  };

  const selectedSpaceObj = spaces.find((s) => s.name === selectedSpace);
  const selectedSpaceLabel =
    selectedSpaceObj?.displayName || selectedSpaceObj?.name || 'Selected Google Chat Space';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Google Chat Integration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Google Chat Broadcast & Workspace Hub
            </h2>
            <p className="text-sm text-zinc-300">
              Publish repository launches, README updates, installation cheatsheets, and voice assistant transcripts directly into your Google Chat spaces.
            </p>
          </div>

          {!user && (
            <div className="flex-shrink-0">
              <GoogleSignInButton onClick={onLogin} disabled={isLoggingIn} />
            </div>
          )}
        </div>
      </div>

      {!user ? (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Connect Your Google Account</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Sign in to view your Google Chat spaces and broadcast Aura documentation, release announcements, and voice transcripts to your team channels.
          </p>
          <div className="pt-2">
            <GoogleSignInButton
              onClick={onLogin}
              disabled={isLoggingIn}
              label={isLoggingIn ? 'Connecting...' : 'Sign in with Google to Connect Chat'}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Spaces Explorer */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Google Chat Spaces</h3>
              </div>
              <button
                onClick={loadSpaces}
                disabled={loadingSpaces}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                title="Refresh spaces"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSpaces ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingSpaces ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading your spaces...
              </div>
            ) : spaces.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400 space-y-2">
                <p>No Google Chat spaces found for your account.</p>
                <p className="text-[11px] text-zinc-500">
                  Create a space in Google Chat (chat.google.com) or join a room, then click refresh.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                {spaces.map((space) => {
                  const isSelected = selectedSpace === space.name;
                  const label = space.displayName || space.name.replace('spaces/', 'Space ');
                  return (
                    <button
                      key={space.name}
                      onClick={() => setSelectedSpace(space.name)}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 font-semibold'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Hash
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isSelected ? 'text-indigo-400' : 'text-zinc-500'
                          }`}
                        />
                        <span className="truncate">{label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {space.type || 'SPACE'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Permission granted: Read spaces & send messages</span>
            </div>
          </div>

          {/* Center & Right: Composer & Space Messages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compose Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">
                    Broadcast Message to: <span className="text-indigo-400 font-mono">{selectedSpaceLabel}</span>
                  </h3>
                </div>

                {/* Preset Snippets */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setMessageDraft(
                        `🚀 *Aura AI Voice Assistant Repository Ready!*\n\n${repoConfig.description}\n\n• Wake Word: "${repoConfig.wakeWord}"\n• License: ${repoConfig.licenseType}\n• Quickstart: git clone https://github.com/${repoConfig.ownerName}/${repoConfig.repoName}.git`
                      )
                    }
                    className="text-[11px] text-indigo-300 hover:text-indigo-200 bg-indigo-950/80 px-2 py-1 rounded-lg border border-indigo-700/40 cursor-pointer"
                  >
                    Insert Launch Announcement
                  </button>
                </div>
              </div>

              <textarea
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                placeholder="Type a message or select a template above to post into Google Chat..."
                rows={5}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-zinc-400">
                  Requires explicit confirmation before posting to your workspace.
                </span>
                <button
                  onClick={() => handleInitiateSend(messageDraft)}
                  disabled={!messageDraft.trim() || !selectedSpace}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Space</span>
                </button>
              </div>
            </div>

            {/* Space Messages Stream */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Recent Messages in Space</span>
                  {selectedSpace && (
                    <span className="text-xs font-mono font-normal text-zinc-500">
                      ({messages.length} fetched)
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => selectedSpace && loadMessages(selectedSpace)}
                  disabled={loadingMessages || !selectedSpace}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingMessages ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingMessages ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-1.5" />
                  Fetching messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  No recent messages found in this space. Send one above to test!
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg.name || idx}
                      className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-300">
                          {msg.sender?.displayName || 'User'}
                        </span>
                        <span className="text-zinc-500">
                          {msg.createTime
                            ? new Date(msg.createTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 whitespace-pre-wrap font-sans">
                        {msg.text || msg.formattedText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Google Chat Posting (Mandatory per Workspace Integration Skill) */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Google Chat Broadcast"
        description="Are you sure you want to post this message to Google Chat? It will be published to your space on your behalf."
        targetSpaceName={selectedSpaceLabel}
        payloadSummary={pendingText}
        confirmLabel="Confirm & Post to Space"
        isProcessing={isSending}
        onConfirm={handleConfirmSend}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
