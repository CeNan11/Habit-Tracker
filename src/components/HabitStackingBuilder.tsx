import React, { useState } from 'react';
import type { HabitStack } from '../types/habit';
import { Layers, Plus, Trash2, ArrowRight, Sparkles, CheckCircle, Zap } from 'lucide-react';

interface HabitStackingBuilderProps {
  stacks: HabitStack[];
  onAddStack: (stack: Omit<HabitStack, 'id' | 'createdAt'>) => void;
  onDeleteStack: (id: string) => void;
}

export const HabitStackingBuilder: React.FC<HabitStackingBuilderProps> = ({
  stacks,
  onAddStack,
  onDeleteStack
}) => {
  const [anchorHabit, setAnchorHabit] = useState('');
  const [newHabit, setNewHabit] = useState('');
  const [locationAndTime, setLocationAndTime] = useState('');
  const [title, setTitle] = useState('');

  const handleCreateStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorHabit.trim() || !newHabit.trim()) return;

    onAddStack({
      title: title.trim() || `${newHabit.slice(0, 20)} Stack`,
      anchorHabit: anchorHabit.trim(),
      newHabit: newHabit.trim(),
      locationAndTime: locationAndTime.trim() || 'At my workspace'
    });

    setAnchorHabit('');
    setNewHabit('');
    setLocationAndTime('');
    setTitle('');
  };

  const loadPresetTemplate = (anchor: string, target: string, locationStr: string, name: string) => {
    setAnchorHabit(anchor);
    setNewHabit(target);
    setLocationAndTime(locationStr);
    setTitle(name);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Habit Stacking Formula</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            "After [Current Habit], I will [New Habit]"
          </h2>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            One of the best ways to build a new habit is to identify a current habit you already do each day and stack your new behavior on top. Your brain already has strong neural pathways for established routines!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stack Creator Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Create New Habit Stack</span>
            </h3>
            <p className="text-xs text-gray-400">Pair your new CS habit with an existing daily anchor trigger.</p>
          </div>

          <form onSubmit={handleCreateStack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Stack Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Morning Algorithm Ritual"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                1. Anchor Habit ("After I...") *
              </label>
              <input
                type="text"
                required
                value={anchorHabit}
                onChange={(e) => setAnchorHabit(e.target.value)}
                placeholder="e.g., Pour my morning coffee & boot up laptop"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-purple-500/40 text-purple-100 text-sm focus:outline-none focus:border-purple-400 placeholder-gray-500"
              />
            </div>

            <div className="flex justify-center my-1">
              <ArrowRight className="w-5 h-5 text-purple-400 rotate-90" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                2. New Target Habit ("I will...") *
              </label>
              <input
                type="text"
                required
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="e.g., Solve 1 LeetCode problem or read 1 problem statement"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-emerald-500/40 text-emerald-100 text-sm focus:outline-none focus:border-emerald-400 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                3. Location & Context
              </label>
              <input
                type="text"
                value={locationAndTime}
                onChange={(e) => setLocationAndTime(e.target.value)}
                placeholder="e.g., At developer desk at 09:00 AM"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:border-purple-500 placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save Habit Stack</span>
            </button>
          </form>

          {/* Preset Templates */}
          <div className="pt-4 border-t border-gray-800 space-y-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Developer Preset Stacks
            </span>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => loadPresetTemplate(
                  "Powering on laptop in the morning",
                  "Open IDE & draft solution for 1 DSA algorithm problem",
                  "Home office desk at 9:00 AM",
                  "Morning DSA Habit Stack"
                )}
                className="w-full text-left p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/60 text-xs text-gray-300 transition-colors flex items-center justify-between"
              >
                <span>Morning Laptop Boot → 1 DSA Problem</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => loadPresetTemplate(
                  "Finishing lunch and cleaning plate",
                  "Read 10 pages of CS Architecture / Systems book",
                  "Reading nook at 1:30 PM",
                  "Post-Lunch Tech Reading Stack"
                )}
                className="w-full text-left p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/60 text-xs text-gray-300 transition-colors flex items-center justify-between"
              >
                <span>Post-Lunch Plate Clear → 10 Tech Pages</span>
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Stacks List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Active Habit Stacks ({stacks.length})</span>
          </h3>

          {stacks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-gray-900/40 border border-gray-800 text-gray-500 space-y-2">
              <Layers className="w-10 h-10 mx-auto text-gray-600" />
              <p className="text-sm font-semibold">No habit stacks created yet.</p>
              <p className="text-xs">Use the form on the left or click a preset template to stack habits!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stacks.map((stack) => (
                <div 
                  key={stack.id}
                  className="p-5 rounded-2xl bg-gray-900/80 border border-purple-500/20 hover:border-purple-500/40 shadow-lg transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider">
                      {stack.title}
                    </span>
                    <button
                      onClick={() => onDeleteStack(stack.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete Stack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Flow chain visual */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs">
                    
                    <div className="flex-1 bg-purple-950/40 border border-purple-500/30 p-2.5 rounded-lg text-purple-200">
                      <span className="text-[10px] text-purple-400 uppercase font-bold block mb-0.5">AFTER (CURRENT HABIT)</span>
                      <span>{stack.anchorHabit}</span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-500 shrink-0 hidden sm:block" />

                    <div className="flex-1 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-lg text-emerald-200">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-0.5">I WILL (NEW HABIT)</span>
                      <span>{stack.newHabit}</span>
                    </div>

                  </div>

                  {stack.locationAndTime && (
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Context: {stack.locationAndTime}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
