/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Send, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  targetSpaceName?: string;
  payloadSummary?: string;
  confirmLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  targetSpaceName,
  payloadSummary,
  confirmLabel = 'Confirm & Send',
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Google Chat API Action Confirmation</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-zinc-300 leading-relaxed">{description}</p>

          {targetSpaceName && (
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3">
              <span className="text-xs text-zinc-400 block font-medium">Destination Space:</span>
              <span className="text-sm font-semibold text-indigo-400 font-mono truncate block mt-0.5">
                {targetSpaceName}
              </span>
            </div>
          )}

          {payloadSummary && (
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3">
              <span className="text-xs text-zinc-400 block font-medium">Message Content Preview:</span>
              <p className="text-xs text-zinc-300 font-mono line-clamp-3 mt-1 bg-zinc-900/60 p-2 rounded border border-zinc-800/80 whitespace-pre-wrap">
                {payloadSummary}
              </p>
            </div>
          )}

          <p className="text-xs text-amber-400/90 bg-amber-950/30 border border-amber-900/40 rounded-lg p-2.5">
            ⚠️ This will post a live message into your Google Chat space with your account credentials. You can view or delete it inside Google Chat at any time.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
