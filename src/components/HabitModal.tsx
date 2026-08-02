import React, { useState, useEffect } from 'react';
import type { Habit } from '../types/habit';
import { X, Plus, Save } from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => void;
  editingHabit?: Habit | null;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHabit
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>('#10b981');

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name || '');
      setColor(editingHabit.color || '#10b981');
    } else {
      setName('');
      setColor('#10b981');
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(editingHabit ? { id: editingHabit.id } : {}),
      name: name.trim(),
      category: 'personal',
      color,
    });

    onClose();
  };

  // Curated premium color palette (rich vibrant tones)
  const calmColors = [
    { hex: '#10b981', label: 'Emerald' },
    { hex: '#06b6d4', label: 'Cyan' },
    { hex: '#6366f1', label: 'Indigo' },
    { hex: '#f59e0b', label: 'Amber' },
    { hex: '#f43f5e', label: 'Rose' },
    { hex: '#8b5cf6', label: 'Violet' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f17]/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-sm bg-[#131b28] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            {editingHabit ? <Save className="w-4 h-4 text-indigo-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
            <span>{editingHabit ? 'Edit Habit' : 'New Habit'}</span>
          </h2>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Habit Name Input */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Habit Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink water, Read 10 pages..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Color Accent Selection */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-3">
              {calmColors.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.label}
                  className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                    color === c.hex 
                      ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#131b28] shadow-md' 
                      : 'opacity-60 hover:opacity-100 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {editingHabit ? 'Save' : 'Add Habit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};



