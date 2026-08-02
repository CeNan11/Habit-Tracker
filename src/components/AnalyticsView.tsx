import React from 'react';
import type { Habit } from '../types/habit';
import { getPastDates, calculateStreak, getTodayDateString } from '../utils/habitUtils';
import { Calendar, Flame, CheckCircle2, Award } from 'lucide-react';

interface AnalyticsViewProps {
  habits: Habit[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ habits }) => {
  const past84Days = getPastDates(84);

  const dailyCompletionsMap: Record<string, number> = {};
  habits.forEach(h => {
    h.completedDates.forEach(dateStr => {
      dailyCompletionsMap[dateStr] = (dailyCompletionsMap[dateStr] || 0) + 1;
    });
  });

  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);

  const overallMaxStreak = habits.reduce((max, h) => {
    const s = calculateStreak(h.completedDates);
    return Math.max(max, s.longest);
  }, 0);

  const todayStr = getTodayDateString();
  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const completionRateToday = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const getHeatmapColorClass = (count: number) => {
    if (!count) return 'bg-white/5 border-white/5';
    if (count === 1) return 'bg-emerald-500/30 border-emerald-500/40 text-emerald-300';
    if (count === 2) return 'bg-emerald-500/60 border-emerald-500/70 text-emerald-200';
    if (count >= 3) return 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131b28]/80 border border-white/5 shadow-lg flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold text-slate-100 font-mono">{totalCompletions}</span>
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Check-ins</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131b28]/80 border border-white/5 shadow-lg flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold text-amber-400 font-mono">{overallMaxStreak}d</span>
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Best Streak</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131b28]/80 border border-white/5 shadow-lg flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold text-indigo-300 font-mono">{completionRateToday}%</span>
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Today's Rate</span>
          </div>
        </div>
      </div>

      {/* Consistency Matrix Heatmap (84 Days) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#131b28]/80 border border-white/5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Consistency Matrix (Last 12 Weeks)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-white/5 border border-white/5" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/40" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/60 border border-emerald-500/70" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="w-full overflow-x-auto pb-1 no-scrollbar">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[540px] pt-1">
            {past84Days.map((dateStr) => {
              const count = dailyCompletionsMap[dateStr] || 0;
              const dateObj = new Date(dateStr);
              const dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div
                  key={dateStr}
                  title={`${dayLabel}: ${count} habit(s) completed`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${getHeatmapColorClass(count)}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Habit Streaks List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#131b28]/80 border border-white/5 shadow-lg space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-100">Habit Streaks</h3>

        <div className="space-y-2">
          {habits.map((h) => {
            const streak = calculateStreak(h.completedDates);

            return (
              <div key={h.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 flex items-center justify-between transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: h.color || '#10b981' }} />
                  <div>
                    <span className="text-xs font-semibold text-slate-100 block">{h.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{h.completedDates.length} total check-ins</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{streak.current}d</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};




