/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 rounded-xl bg-orange-600/95 border border-orange-400 px-3.5 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Running with cached PWA assets</span>
    </div>
  );
};
