import React from 'react';
import { BookOpen, Eye, Heart, Zap, CheckCircle2 } from 'lucide-react';

export const LawsOfBehavior: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Atomic Habits Framework</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            The 4 Laws of Behavior Change for Developers
          </h2>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            Derived from James Clear's book <em>Atomic Habits</em>, these four principles form a complete framework for creating good habits and breaking bad ones in your computer science journey.
          </p>
        </div>
      </div>

      {/* Grid of the 4 Laws */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Law 1 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-500/40 font-mono font-bold text-lg">
              1
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              The Cue
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>1st Law: Make It Obvious</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Most people think they lack motivation when what they really lack is clarity.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-cyan-400 block">Implementation Intentions:</span>
              <p className="text-gray-300 font-mono">"I will [BEHAVIOR] at [TIME] in [LOCATION]"</p>
              <p className="text-gray-500 italic text-[11px]">Example: "I will solve 1 DSA problem at 9:00 AM at my desk."</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-cyan-400 block">Habit Stacking:</span>
              <p className="text-gray-300 font-mono">"After [CURRENT HABIT], I will [NEW HABIT]"</p>
              <p className="text-gray-500 italic text-[11px]">Example: "After I power on my laptop, I will open VS Code."</p>
            </div>
          </div>
        </div>

        {/* Law 2 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-purple-500/30 hover:border-purple-500/60 shadow-lg space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-500/40 font-mono font-bold text-lg">
              2
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              The Craving
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-400" />
              <span>2nd Law: Make It Attractive</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              It is the anticipation of a reward that gets us to act.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-purple-400 block">Identity-Based Habits:</span>
              <p className="text-gray-300">Focus on WHO you want to become rather than WHAT you want to achieve.</p>
              <p className="text-gray-500 italic text-[11px]">Example: "I am a developer who writes robust, tested software."</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-purple-400 block">Temptation Bundling:</span>
              <p className="text-gray-300">Pair an action you NEED to do with an action you WANT to do.</p>
              <p className="text-gray-500 italic text-[11px]">Example: "Only listen to favorite tech podcast while stretching."</p>
            </div>
          </div>
        </div>

        {/* Law 3 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-500/40 font-mono font-bold text-lg">
              3
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              The Response
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>3rd Law: Make It Easy</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Optimize for starting, not perfection. Practice creates automaticity.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-emerald-400 block">The 2-Minute Rule:</span>
              <p className="text-gray-300">When starting a new habit, it should take less than two minutes to do.</p>
              <p className="text-gray-500 italic text-[11px]">Example: "Read 1 page of technical documentation" instead of 50 pages.</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-emerald-400 block">Reduce Friction:</span>
              <p className="text-gray-300">Prime your environment to make good actions frictionless.</p>
              <p className="text-gray-500 italic text-[11px]">Example: Keep terminal open with repo alias ready to code in 1 tap.</p>
            </div>
          </div>
        </div>

        {/* Law 4 */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-amber-500/30 hover:border-amber-500/60 shadow-lg space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-500/40 font-mono font-bold text-lg">
              4
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              The Reward
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span>4th Law: Make It Satisfying</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              What is immediately rewarded is repeated. What is immediately punished is avoided.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-amber-400 block">Habit Tracker & Visual Proof:</span>
              <p className="text-gray-300">Don't break the chain. Seeing green boxes creates instant dopamine reinforcement.</p>
              <p className="text-gray-500 italic text-[11px]">Example: GitHub contribution squares & AtomicHabits daily score.</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs space-y-1">
              <span className="font-bold text-amber-400 block">Never Miss Twice Rule:</span>
              <p className="text-gray-300">Missing once is an accident. Missing twice is the start of a new habit.</p>
              <p className="text-gray-500 italic text-[11px]">Example: If you miss a day due to exams, ensure you do the 2-minute version next day.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
