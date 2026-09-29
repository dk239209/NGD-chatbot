/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepoConfig } from '../types/repo';
import { generateInstallationGuide } from '../data/repoTemplates';
import {
  Copy,
  Check,
  Download,
  Share2,
  Terminal,
  Cpu,
  ShieldCheck,
  Apple,
  Boxes,
} from 'lucide-react';

interface InstallationTabProps {
  config: RepoConfig;
  onCopy: (text: string, label: string) => void;
  onPostToChat?: (text: string) => void;
  isChatConnected: boolean;
}

export const InstallationTab: React.FC<InstallationTabProps> = ({
  config,
  onCopy,
  onPostToChat,
  isChatConnected,
}) => {
  const [selectedOS, setSelectedOS] = useState<'macos' | 'linux' | 'windows' | 'docker'>('macos');
  const [copied, setCopied] = useState(false);

  const guideContent = generateInstallationGuide(config);

  const handleCopyGuide = () => {
    onCopy(guideContent, 'INSTALLATION.md Content');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadGuide = () => {
    const blob = new Blob([guideContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'INSTALLATION.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const osSteps = {
    macos: [
      {
        title: '1. Install audio & media packages via Homebrew',
        cmd: 'brew update && brew install portaudio ffmpeg git',
        note: 'Apple Silicon (M1/M2/M3/M4): Brew installs to /opt/homebrew',
      },
      {
        title: '2. Clone repository & initialize virtual environment',
        cmd: `git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}
python3 -m venv .venv
source .venv/bin/activate`,
      },
      {
        title: '3. Export PortAudio CFLAGS & install dependencies',
        cmd: `export CFLAGS="-I$(brew --prefix portaudio)/include"
export LDFLAGS="-L$(brew --prefix portaudio)/lib"
pip install --upgrade pip
pip install -r requirements.txt`,
      },
      {
        title: '4. Test microphone capture & voice loopback',
        cmd: 'python -m aura.cli test-audio',
      },
    ],
    linux: [
      {
        title: '1. Install ALSA, PortAudio development headers & FFmpeg',
        cmd: `sudo apt update && sudo apt install -y \\
  python3-dev python3-venv python3-pip build-essential \\
  libasound2-dev portaudio19-dev libportaudio2 libportaudiocpp0 ffmpeg git`,
        note: 'For Fedora/RHEL: sudo dnf install alsa-lib-devel portaudio-devel ffmpeg',
      },
      {
        title: '2. Ensure current user is in the "audio" group',
        cmd: 'sudo usermod -aG audio $USER',
        note: 'Log out and back in once for the group permission to take effect.',
      },
      {
        title: '3. Clone & install Python environment',
        cmd: `git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt`,
      },
      {
        title: '4. Launch Aura audio diagnostic tool',
        cmd: 'python -m aura.cli list-devices',
      },
    ],
    windows: [
      {
        title: '1. Install Visual C++ Build Tools & FFmpeg',
        cmd: 'choco install -y visualstudio2022buildtools visualstudio2022-workload-vctools ffmpeg git',
        note: 'Alternatively install Visual Studio Desktop C++ from microsoft.com',
      },
      {
        title: '2. Clone & setup PowerShell Virtualenv',
        cmd: `git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}
python -m venv .venv
.venv\\Scripts\\Activate.ps1`,
      },
      {
        title: '3. Install Python requirements (using pre-built wheels if needed)',
        cmd: `python -m pip install --upgrade pip
pip install -r requirements.txt`,
      },
      {
        title: '4. Verify Windows audio input with WASAPI driver',
        cmd: 'python -m aura.cli test-audio',
      },
    ],
    docker: [
      {
        title: '1. Clone repository & configure environment variables',
        cmd: `git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}
cp .env.example .env`,
      },
      {
        title: '2. Run with Docker Compose passing through host soundcard',
        cmd: 'docker compose up -d --build',
        note: 'Maps /dev/snd on Linux or connects to PulseAudio socket on macOS/Windows.',
      },
      {
        title: '3. Check container logs and wake word status',
        cmd: 'docker compose logs -f aura',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Exporter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>INSTALLATION.md</span>
              <span className="text-xs font-mono font-normal text-emerald-400">
                Multi-Platform Audio & Hardware Guide
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Clear steps for microphone permissions, PortAudio bindings, and neural model runners
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyGuide}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Full Guide!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy INSTALLATION.md</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadGuide}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download .md</span>
          </button>

          {onPostToChat && (
            <button
              onClick={() =>
                onPostToChat(
                  `📦 *Aura Installation Cheatsheet (${selectedOS.toUpperCase()})*\n\n1. Install PortAudio & FFmpeg\n2. git clone https://github.com/${config.ownerName}/${config.repoName}.git\n3. pip install -r requirements.txt\n4. python -m aura.cli start --wake-word "${config.wakeWord}"\n\nFull guide: https://github.com/${config.ownerName}/${config.repoName}/blob/main/INSTALLATION.md`
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

      {/* Interactive OS Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'macos', label: 'macOS (Apple Silicon & Intel)', icon: Apple },
          { id: 'linux', label: 'Linux (Ubuntu / Debian / Arch)', icon: Terminal },
          { id: 'windows', label: 'Windows (10 / 11)', icon: Cpu },
          { id: 'docker', label: 'Docker Container', icon: Boxes },
        ].map((os) => {
          const Icon = os.icon;
          const isSelected = selectedOS === os.id;
          return (
            <button
              key={os.id}
              onClick={() => setSelectedOS(os.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-800/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-2 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}
              />
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {os.label.split('(')[0]}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {os.label.includes('(') ? `(${os.label.split('(')[1]}` : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step by Step OS Commands */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              {selectedOS} Installation Walkthrough
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Execute these commands in your {selectedOS === 'windows' ? 'PowerShell' : 'Terminal'}
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
            Verified Pipeline
          </span>
        </div>

        <div className="space-y-5">
          {osSteps[selectedOS].map((step, idx) => (
            <div key={idx} className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                  {step.title}
                </span>
                <button
                  onClick={() => onCopy(step.cmd, `Step ${idx + 1} Command`)}
                  className="px-2 py-1 bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>

              <pre className="p-3 bg-zinc-950 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-zinc-900">
                {step.cmd}
              </pre>

              {step.note && (
                <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>{step.note}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
