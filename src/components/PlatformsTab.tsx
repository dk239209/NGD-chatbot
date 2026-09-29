/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  Layers,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Boxes,
  Cpu,
  Share2,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PlatformsTabProps {
  onCopy: (text: string, label: string) => void;
  onPostToChat?: (text: string) => void;
}

export const PlatformsTab: React.FC<PlatformsTabProps> = ({
  onCopy,
  onPostToChat,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'windows' | 'android'>('windows');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const { isInstallable, isInstalled, install, platform: userCurrentPlatform } = usePWAInstall();

  const copyWithFeedback = (text: string, label: string, key: string) => {
    onCopy(text, label);
    setCopiedFile(key);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  // Capacitor Configuration for Android
  const capacitorConfig = `{
  "appId": "com.ngd.multitaskbot",
  "appName": "NGD Multi-Task Bot",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1500,
      "backgroundColor": "#09090b",
      "showSpinner": false
    }
  }
}`;

  // Android Manifest permissions snippet
  const androidManifestSnippet = `<!-- Add inside app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`;

  // Electron Desktop Runner for Windows
  const electronRunnerScript = `/**
 * NGD Multi-Task Bot - Windows Desktop App Launcher
 * Electron Runner
 */
const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'NGD Multi-Task Bot',
    icon: path.join(__dirname, 'public/pwa-512x512.png'),
    backgroundColor: '#09090b',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  // Grant microphone and audio capture permission on Windows
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'geolocation', 'notifications'];
    if (allowed.includes(permission)) {
      return callback(true);
    }
    callback(false);
  });

  // Load app in dev or production
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  // Open external links in default Windows browser (Edge/Chrome)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`;

  // Bubblewrap (TWA) Configuration for Google Play Store APK
  const bubblewrapConfig = `{
  "packageId": "com.ngd.multitaskbot",
  "host": "ais-dev-yic64fcqcdx3radz37efjm-730791063093.asia-east1.run.app",
  "name": "NGD Multi-Task Bot",
  "launcherName": "NGDBot",
  "display": "standalone",
  "themeColor": "#f97316",
  "navigationColor": "#09090b",
  "backgroundColor": "#09090b",
  "enableNotifications": true,
  "startUrl": "/",
  "iconUrl": "/pwa-512x512.png",
  "maskableIconUrl": "/pwa-maskable-512x512.png",
  "appVersionCode": 1,
  "appVersionName": "1.0.0"
}`;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-zinc-900 to-orange-950/40 border border-blue-600/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20">
                <Boxes className="w-3.5 h-3.5" />
                Cross-Platform App Runner
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold">
                Windows Desktop Ready
              </span>
              <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-full text-xs font-semibold">
                Android APK Ready
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Run NGD as a Native App on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400">
                Windows & Android
              </span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              This project is built with Progressive Web App (PWA) standards, Capacitor Android SDK bindings, and Electron Windows packaging. Install it directly from your browser or compile into standalone APK/EXE binaries.
            </p>
          </div>

          {/* Quick Install Trigger */}
          <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
            {isInstalled ? (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Running in Standalone Mode</span>
              </div>
            ) : (
              <button
                onClick={install}
                className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 border border-orange-500/40 shadow-lg shadow-orange-500/25 flex items-center space-x-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install on {userCurrentPlatform === 'android' ? 'Android' : userCurrentPlatform === 'windows' ? 'Windows' : 'This Device'}</span>
              </button>
            )}

            {onPostToChat && (
              <button
                onClick={() =>
                  onPostToChat(
                    `📱 *NGD Multi-Task Bot is now available for Windows & Android!*\n\n• Windows: Installable via Edge/Chrome Desktop PWA or Electron EXE\n• Android: Installable via Chrome WebAPK or Capacitor Android APK\n• Features: Fullscreen standalone window, low-latency audio capture, offline cache!`
                  )
                }
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 border border-zinc-700 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-orange-400" />
                <span>Share Release to Google Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 flex space-x-3 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setSelectedPlatform('windows')}
            className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              selectedPlatform === 'windows'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-300" />
            <span>Windows App (10 / 11)</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('android')}
            className={`px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              selectedPlatform === 'android'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 border border-orange-400'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-orange-300" />
            <span>Android App (APK / WebAPK)</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. WINDOWS PLATFORM VIEW */}
      {/* ---------------------------------------------------- */}
      {selectedPlatform === 'windows' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Option A: 1-Click Desktop PWA */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-800">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Method 1: Instant Windows Desktop App (PWA)
                    </h3>
                    <p className="text-xs text-zinc-400">No developer tools needed • Takes 5 seconds</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Microsoft Edge and Google Chrome support installing NGD directly as a full desktop program on Windows 10 and 11. It gets its own Start Menu tile, taskbar icon, and runs in an isolated borderless window without address bars.
                </p>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2.5 text-xs">
                  <span className="font-bold text-blue-400 block uppercase tracking-wider">
                    How to install on Windows:
                  </span>
                  <div className="space-y-2 text-zinc-300">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">1</span>
                      <span>Click the <strong>"Install"</strong> button in your browser's address bar (icon with a monitor and down arrow) or click the install button above.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">2</span>
                      <span>Click <strong>"Install"</strong> when prompted by Windows.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">3</span>
                      <span>Check <strong>"Pin to taskbar"</strong> and <strong>"Pin to Start"</strong>. NGD will launch in its own native desktop window!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={install}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Launch Windows PWA Installation</span>
                </button>
              </div>
            </div>

            {/* Option B: Windows Native .EXE / MSIX Package */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-800">
                  <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Method 2: Standalone Windows .EXE / MSIX Package
                    </h3>
                    <p className="text-xs text-zinc-400">For building distributors, installers, and Microsoft Store</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  You can package NGD into a standalone Windows executable (`.exe`) or Windows Store package (`.msix`) using <strong>Electron</strong> or <strong>PWABuilder CLI</strong>.
                </p>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2 text-xs">
                  <span className="font-bold text-orange-400 block uppercase tracking-wider">
                    Quick CLI Build (PWABuilder for Windows):
                  </span>
                  <pre className="p-2.5 bg-zinc-900 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# 1. Install PWABuilder CLI
npm install -g @pwabuilder/cli

# 2. Package into Windows 10/11 MSIX installer
pwa-builder build -d windows --url http://localhost:3000`}
                  </pre>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() =>
                    copyWithFeedback(
                      `npm install -g @pwabuilder/cli && pwa-builder build -d windows`,
                      'PWABuilder command',
                      'pwa-cmd'
                    )
                  }
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 border border-zinc-700 cursor-pointer"
                >
                  {copiedFile === 'pwa-cmd' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied Build Command!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-orange-400" />
                      <span>Copy Windows Build Command</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Windows Electron Launcher Config */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white">
                  Windows Electron Launcher Configuration (`electron-main.cjs`)
                </h4>
              </div>
              <button
                onClick={() =>
                  copyWithFeedback(electronRunnerScript, 'Electron Runner Script', 'electron-code')
                }
                className="px-3 py-1.5 bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copiedFile === 'electron-code' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-zinc-950 rounded-2xl text-xs font-mono text-zinc-300 overflow-x-auto max-h-72 overflow-y-auto leading-relaxed border border-zinc-800/80">
              {electronRunnerScript}
            </pre>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. ANDROID PLATFORM VIEW */}
      {/* ---------------------------------------------------- */}
      {selectedPlatform === 'android' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Option A: Android WebAPK / PWA */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-800">
                  <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Method 1: Instant Android WebAPK (Google Chrome / Brave)
                    </h3>
                    <p className="text-xs text-zinc-400">Zero build tools • High performance</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  On Android, modern Chromium engines generate a true <strong>WebAPK</strong> when you install the app. It registers in Android Settings, appears in your App Drawer alongside native apps, and has system notification privileges.
                </p>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2.5 text-xs">
                  <span className="font-bold text-orange-400 block uppercase tracking-wider">
                    How to install on your Android device:
                  </span>
                  <div className="space-y-2 text-zinc-300">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">1</span>
                      <span>Open this URL in <strong>Google Chrome</strong> or <strong>Brave</strong> on your Android phone or tablet.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">2</span>
                      <span>Tap the <strong>three dots (⋮)</strong> at the top right of the browser.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">3</span>
                      <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> and tap <strong>Install</strong>.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={install}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install on Android Device</span>
                </button>
              </div>
            </div>

            {/* Option B: Native Android APK with Capacitor / TWA */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-800">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Method 2: Compile Standalone Android APK / AAB
                    </h3>
                    <p className="text-xs text-zinc-400">For Google Play Store & Sideloading via ADB</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Use <strong>Capacitor</strong> to generate a complete Android Studio project with native Java/Kotlin bindings and Android audio record permissions.
                </p>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2 text-xs">
                  <span className="font-bold text-blue-400 block uppercase tracking-wider">
                    Build Android APK in 3 Steps:
                  </span>
                  <pre className="p-2.5 bg-zinc-900 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# 1. Install Capacitor
npm install @capacitor/core @capacitor/android
npx cap init "NGD Multi-Task Bot" com.ngd.multitaskbot

# 2. Build web assets & add Android platform
npm run build
npx cap add android

# 3. Open in Android Studio to build APK
npx cap open android`}
                  </pre>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() =>
                    copyWithFeedback(
                      `npm install @capacitor/core @capacitor/android && npx cap add android && npm run build && npx cap copy`,
                      'Capacitor build sequence',
                      'cap-cmd'
                    )
                  }
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 border border-zinc-700 cursor-pointer"
                >
                  {copiedFile === 'cap-cmd' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied Commands!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-400" />
                      <span>Copy Android Build Commands</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Android Scaffolding Configs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* capacitor.config.json */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-bold text-white font-mono">capacitor.config.json</span>
                <button
                  onClick={() => copyWithFeedback(capacitorConfig, 'Capacitor Config', 'cap-config')}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedFile === 'cap-config' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-zinc-950 rounded-xl text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-56 leading-relaxed border border-zinc-800">
                {capacitorConfig}
              </pre>
            </div>

            {/* AndroidManifest.xml permissions */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-bold text-white font-mono">AndroidManifest.xml Permissions</span>
                <button
                  onClick={() =>
                    copyWithFeedback(androidManifestSnippet, 'AndroidManifest Permissions', 'manifest-code')
                  }
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedFile === 'manifest-code' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-zinc-950 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56 leading-relaxed border border-zinc-800">
                {androidManifestSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Feature Comparison Matrix */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-orange-400" />
          <h3 className="text-base font-bold text-white">
            Native Platform Capability Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="py-3 px-4 font-semibold">Capability</th>
                <th className="py-3 px-4 font-semibold text-blue-400">Windows Desktop App</th>
                <th className="py-3 px-4 font-semibold text-orange-400">Android App</th>
                <th className="py-3 px-4 font-semibold text-zinc-500">Regular Web Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {[
                {
                  cap: 'Offline Asset & Cache Support',
                  win: 'Full (Service Worker / Local)',
                  android: 'Full (WebAPK Cache)',
                  web: 'Partial (Browser dependent)',
                },
                {
                  cap: 'Microphone & Real-time Audio',
                  win: 'High Fidelity (Direct WASAPI/Wave)',
                  android: 'Hardware Mic with AGC/AEC',
                  web: 'Standard WebRTC',
                },
                {
                  cap: 'Home Screen / Desktop Shortcut',
                  win: 'Yes (Start Menu & Desktop Tile)',
                  android: 'Yes (App Drawer & Home Screen)',
                  web: 'No (Browser Bookmark only)',
                },
                {
                  cap: 'Standalone Fullscreen (No URL Bar)',
                  win: 'Yes (Custom Window Controls)',
                  android: 'Yes (Immersive Fullscreen)',
                  web: 'No (Inside Browser Tab)',
                },
                {
                  cap: 'Google Workspace & Chat Sync',
                  win: 'Instant Bi-directional OAuth',
                  android: 'Instant Bi-directional OAuth',
                  web: 'Standard OAuth Popup',
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-800/30">
                  <td className="py-3 px-4 font-semibold text-white">{row.cap}</td>
                  <td className="py-3 px-4 text-blue-300 font-medium">{row.win}</td>
                  <td className="py-3 px-4 text-orange-300 font-medium">{row.android}</td>
                  <td className="py-3 px-4 text-zinc-500">{row.web}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
