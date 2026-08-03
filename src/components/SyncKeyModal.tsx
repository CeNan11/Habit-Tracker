import React, { useState } from 'react';
import type { User } from '../services/db';
import type { Habit } from '../types/habit';
import { generateSyncKey } from '../services/db';
import { KeyRound, Copy, Check, X, Globe, Smartphone, Monitor } from 'lucide-react';

interface SyncKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  habits: Habit[];
}

export const SyncKeyModal: React.FC<SyncKeyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  habits
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !currentUser) return null;

  const syncKey = generateSyncKey(currentUser, habits);

  const handleCopy = () => {
    navigator.clipboard.writeText(syncKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f17]/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-[#131b28]/95 rounded-3xl shadow-2xl p-6 space-y-5 animate-fadeIn border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Globe className="w-4 h-4" />
            <span>Cross-Device Account Sync</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Device Sync Key
          </h2>
          <p className="text-xs text-slate-400">
            Use this key to link account <span className="text-slate-200 font-semibold">{currentUser.username}</span> to another phone, laptop, or browser.
          </p>
        </div>

        {/* Sync Key Box */}
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Your Portable Sync Key
          </label>
          <div className="relative">
            <textarea
              readOnly
              rows={3}
              value={syncKey}
              className="w-full p-3 pr-12 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs font-mono select-all focus:outline-none resize-none"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
              title="Copy Sync Key"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {copied && (
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Copied to clipboard!</span>
            </p>
          )}
        </div>

        {/* How to use */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 text-xs text-slate-300">
          <h4 className="font-bold text-slate-200 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            How to link to another device:
          </h4>
          <ol className="space-y-1.5 list-decimal list-inside text-slate-400 text-[11px] leading-relaxed">
            <li>Open HabitTracker on your second device (<Monitor className="w-3 h-3 inline mx-0.5 text-slate-300" /> or <Smartphone className="w-3 h-3 inline mx-0.5 text-slate-300" />).</li>
            <li>Click <strong className="text-slate-200">Sign In</strong>, then choose the <strong className="text-emerald-400">Sync Key</strong> tab.</li>
            <li>Paste this key and click <strong className="text-emerald-400">Import & Link Account</strong>.</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
