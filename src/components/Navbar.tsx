import React, { useState } from 'react';
import type { ViewTab } from '../types/habit';
import type { User } from '../services/db';
import { 
  CheckSquare, 
  BarChart2, 
  Plus,
  Flame,
  CheckCircle2,
  User as UserIcon,
  LogOut,
  ChevronDown,
  KeyRound,
  Globe
} from 'lucide-react';

interface NavbarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
  completedTodayCount: number;
  totalHabitsCount: number;
  maxStreak: number;
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onOpenSyncKeyModal?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  completedTodayCount,
  totalHabitsCount,
  maxStreak,
  currentUser,
  onOpenAuthModal,
  onOpenSyncKeyModal,
  onLogout
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand & Date */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-base text-slate-100 tracking-tight leading-none">Habits</h1>
              <span className="hidden xs:flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400">
                <Globe className="w-2.5 h-2.5" />
                Synced
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium">{todayFormatted}</p>
          </div>
        </div>

        {/* Center: Minimal Segmented Control */}
        <nav className="flex items-center bg-[#131b28]/80 p-1 rounded-xl border border-white/5 shadow-inner">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>Today</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <BarChart2 className={`w-3.5 h-3.5 ${activeTab === 'analytics' ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span>Stats</span>
          </button>
        </nav>

        {/* Right: Quick Stats, User Account Profile & Add Habit */}
        <div className="flex items-center gap-2">
          
          {/* Completion Counter */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
            <span className="font-bold">{completedTodayCount}/{totalHabitsCount}</span>
            <span className="text-[10px] opacity-75">done</span>
          </div>

          {/* Streak Badge */}
          {maxStreak > 0 && (
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{maxStreak}d</span>
            </div>
          )}

          {/* User Account Badge / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 cursor-pointer transition-colors"
              >
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 uppercase"
                  style={{ backgroundColor: currentUser.avatarColor || '#10b981' }}
                >
                  {currentUser.username.charAt(0)}
                </div>
                <span className="hidden md:inline max-w-[80px] truncate">{currentUser.username}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Account Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#131b28] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn space-y-1">
                  <div className="px-2.5 py-2 border-b border-white/5">
                    <p className="text-xs font-bold text-slate-100 truncate">{currentUser.username}</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" />
                      Cross-Device Active
                    </p>
                  </div>
                  
                  {onOpenSyncKeyModal && (
                    <button
                      onClick={() => { setShowUserDropdown(false); onOpenSyncKeyModal(); }}
                      className="w-full px-2.5 py-1.5 text-left text-xs text-emerald-300 hover:bg-emerald-500/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Device Sync Key</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setShowUserDropdown(false); onLogout(); }}
                    className="w-full px-2.5 py-1.5 text-left text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Add Habit Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Habit</span>
          </button>
        </div>

      </div>
    </header>
  );
};




