import React, { useState } from 'react';
import type { Habit } from '../types/habit';
import { getTodayDateString } from '../utils/habitUtils';
import { X, FileText, CheckCircle2 } from 'lucide-react';

interface QuickLogModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (habitId: string, note: string, timeSpentMinutes?: number) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  habit,
  isOpen,
  onClose,
  onSaveLog
}) => {
  const [note, setNote] = useState('');

  if (!isOpen || !habit) return null;

  const todayStr = getTodayDateString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog(habit.id, note.trim());
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f17]/80 backdrop-blur-md">
      <div 
        className="w-full max-w-sm bg-[#131b28] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">Add Note</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-100 mb-0.5">{habit.name}</h4>
            <p className="text-[11px] text-slate-400 font-medium">{todayStr}</p>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Note
            </label>
            <textarea
              rows={3}
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Felt great after finishing this today..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



