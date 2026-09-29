/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Monitor,
  CheckCircle2,
  X,
  Share,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  onOpenPlatformsTab?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  onOpenPlatformsTab,
}) => {
  const { isInstallable, isInstalled, platform, install } = usePWAInstall();
  const [showManualGuide, setShowManualGuide] = useState(false);

  const isAndroid = platform === 'android';
  const isWindows = platform === 'windows';

  // If already running inside standalone app
  if (isInstalled) {
    return (
      <div className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Running as App</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowManualGuide(true);
      }
    } else {
      setShowManualGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        type="button"
        className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 border border-orange-500/40 shadow-md shadow-orange-500/20 transition-all cursor-pointer ${className}`}
        title={`Install NGD Multi-Task Bot on ${isAndroid ? 'Android' : isWindows ? 'Windows' : 'Device'}`}
      >
        {isAndroid ? (
          <Smartphone className="w-3.5 h-3.5 text-orange-200" />
        ) : (
          <Monitor className="w-3.5 h-3.5 text-blue-200" />
        )}
        <span>
          {isAndroid
            ? 'Install on Android'
            : isWindows
            ? 'Install on Windows'
            : 'Install App'}
        </span>
      </button>

      {/* Manual Installation Guide Modal */}
      {showManualGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Install NGD on {isAndroid ? 'Android' : isWindows ? 'Windows' : 'Your Device'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Runs as a standalone desktop or mobile application
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowManualGuide(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm text-zinc-300">
              {isWindows && (
                <div className="space-y-3 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <Monitor className="w-4 h-4" />
                    <span>Windows 10 / 11 Installation (Edge or Chrome):</span>
                  </div>
                  <ol className="space-y-2 pl-4 list-decimal marker:text-orange-400 text-xs text-zinc-300">
                    <li>
                      Look at your browser's address bar (top right) and click the{' '}
                      <strong className="text-white">"Install app"</strong> icon (or monitor with down arrow).
                    </li>
                    <li>
                      Alternatively, click the browser menu <strong className="text-white">(...)</strong> &gt;{' '}
                      <strong className="text-white">"Apps"</strong> &gt;{' '}
                      <strong className="text-orange-400">"Install NGD Multi-Task Bot"</strong>.
                    </li>
                    <li>
                      Click <strong className="text-white">Install</strong>. A desktop shortcut and Start Menu icon will be created automatically!
                    </li>
                  </ol>
                </div>
              )}

              {isAndroid && (
                <div className="space-y-3 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center space-x-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
                    <Smartphone className="w-4 h-4" />
                    <span>Android Installation (Chrome, Brave, Samsung Internet):</span>
                  </div>
                  <ol className="space-y-2 pl-4 list-decimal marker:text-orange-400 text-xs text-zinc-300">
                    <li>
                      Tap the three dots menu <strong className="text-white">(⋮)</strong> in the top right corner of Chrome.
                    </li>
                    <li>
                      Tap <strong className="text-orange-400">"Install app"</strong> or{' '}
                      <strong className="text-white">"Add to Home screen"</strong>.
                    </li>
                    <li>
                      Confirm <strong className="text-white">"Install"</strong>. NGD will install to your app drawer and home screen with standalone launch!
                    </li>
                  </ol>
                </div>
              )}

              {!isWindows && !isAndroid && (
                <div className="space-y-3 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <Share className="w-4 h-4" />
                    <span>iPhone / iPad / Mac / Linux:</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    On Safari, tap the <strong>Share</strong> button and choose <strong>"Add to Home Screen"</strong>. On Chromium browsers, click the <strong>Install</strong> icon in the address bar.
                  </p>
                </div>
              )}

              <div className="p-3 bg-orange-950/30 border border-orange-500/30 rounded-xl text-xs text-orange-200">
                ✨ <strong>App Features:</strong> Fullscreen standalone window, low-latency microphone access, offline caching, and instant home screen / taskbar access.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              {onOpenPlatformsTab && (
                <button
                  onClick={() => {
                    setShowManualGuide(false);
                    onOpenPlatformsTab();
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Android APK & Windows EXE Packaging Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => setShowManualGuide(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
