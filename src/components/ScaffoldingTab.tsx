/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SCAFFOLDING_FILES } from '../data/repoTemplates';
import { RepoConfig } from '../types/repo';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderGit2,
  Share2,
} from 'lucide-react';

interface ScaffoldingTabProps {
  config: RepoConfig;
  onCopy: (text: string, label: string) => void;
  onPostToChat?: (text: string) => void;
}

export const ScaffoldingTab: React.FC<ScaffoldingTabProps> = ({
  config,
  onCopy,
  onPostToChat,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedFile = SCAFFOLDING_FILES[selectedFileIndex] || SCAFFOLDING_FILES[0];

  const handleCopy = () => {
    onCopy(selectedFile.content, selectedFile.filename);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Repository Scaffolding Files</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Essential GitHub files for CI/CD, contributor standards, dependencies, and configuration
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
                <span>Copy {selectedFile.filename}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download File</span>
          </button>

          {onPostToChat && (
            <button
              onClick={() =>
                onPostToChat(
                  `📁 *Repository Scaffolding: ${selectedFile.filename}*\n\n${selectedFile.description}\n\nSnippet:\n\`\`\`\n${selectedFile.content
                    .split('\n')
                    .slice(0, 10)
                    .join('\n')}\n...\n\`\`\``
                )
              }
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to Google Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: File Explorer + Editor View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* File List */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2">
            Files in Repository
          </h3>
          <div className="space-y-1">
            {SCAFFOLDING_FILES.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected ? 'text-indigo-400' : 'text-zinc-500'
                      }`}
                    />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-sans">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* File Viewer */}
        <div className="md:col-span-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
            <div>
              <span className="font-mono text-sm font-bold text-white block">
                {selectedFile.path}
              </span>
              <span className="text-xs text-zinc-400">{selectedFile.description}</span>
            </div>
            <span className="text-xs text-indigo-400 font-mono">
              {selectedFile.content.split('\n').length} lines
            </span>
          </div>

          <pre className="p-5 bg-zinc-950 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto select-all scrollbar-thin">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
