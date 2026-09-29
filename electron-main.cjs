/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NGD Multi-Task Bot - Windows Desktop App Launcher
 * Electron Native Runner
 */

const { app, BrowserWindow, shell } = require('electron');
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
