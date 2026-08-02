import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Flame, UserPlus, LogIn } from 'lucide-react';

interface LandingHeroProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenRegister,
  onOpenLogin
}) => {
  return (
    <div className="py-8 sm:py-14 text-center space-y-8 animate-fadeIn max-w-2xl mx-auto">
      
      {/* Top Tag Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Atomic Habits System</span>
      </div>

      {/* Main Quote & Hero Title */}
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Atomic Habits <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            4th Law: Make It Satisfying
          </span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
          Small, immediate rewards build long-term consistency. Track your daily habits effortlessly with encrypted local storage.
        </p>
      </div>

      {/* CTA Button Group */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onOpenRegister}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Create an Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenLogin}
          className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-emerald-400" />
          <span>Sign In to Account</span>
        </button>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/5 text-left">
        
        <div className="p-4 rounded-2xl bg-[#131b28]/60 border border-white/5 space-y-1.5 backdrop-blur-md">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-200">Instant 1-Click Check</h3>
          <p className="text-[11px] text-slate-400 leading-snug">Minimalist daily tracking with zero friction or text bloat.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#131b28]/60 border border-white/5 space-y-1.5 backdrop-blur-md">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-200">IndexedDB Storage</h3>
          <p className="text-[11px] text-slate-400 leading-snug">Your account and habit history stay 100% private in browser DB.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#131b28]/60 border border-white/5 space-y-1.5 backdrop-blur-md">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-200">Streak Heatmaps</h3>
          <p className="text-[11px] text-slate-400 leading-snug">Visualize 84-day consistency matrix with live streak tracking.</p>
        </div>

      </div>

    </div>
  );
};
