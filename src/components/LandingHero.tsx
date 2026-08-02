import React from 'react';
import { Sparkles, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface LandingHeroProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenRegister,
  onOpenLogin
}) => {
  return (
    <div className="py-12 sm:py-20 text-center space-y-8 animate-fadeIn max-w-2xl mx-auto my-auto flex flex-col justify-center items-center min-h-[70vh]">
      
      {/* Animated Top Tag Pill with Hover Zoom */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 shadow-sm animate-float-slow hover:scale-105 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-default">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Atomic Habits Framework</span>
      </div>

      {/* Main Animated Title with Text Hover Scale & Glow */}
      <div className="space-y-4 group">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight select-none">
          <span className="inline-block transition-transform duration-300 group-hover:scale-105 group-hover:text-white">
            Atomic Habits
          </span>
          <br />
          <span className="inline-block bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent animate-gradient-shimmer transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.7)]">
            4th Law: Make It Satisfying
          </span>
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 w-full max-w-md">
        <button
          onClick={onOpenRegister}
          className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-2xl font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span className="hover:tracking-wider transition-all">Create an Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenLogin}
          className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-emerald-400" />
          <span className="hover:text-emerald-300 transition-colors">Sign In</span>
        </button>
      </div>

    </div>
  );
};
