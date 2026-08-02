import React, { useState } from 'react';
import type { Habit } from '../types/habit';
import { 
  calculateStreak, 
  triggerAtomicCelebration 
} from '../utils/habitUtils';
import { 
  Check, 
  Flame, 
  Clock, 
  Trash2, 
  Edit3, 
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  selectedDateStr: string;
  onToggleComplete: (habitId: string, dateStr: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onOpenQuickLog: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDateStr,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenQuickLog
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isCompleted = habit.completedDates.includes(selectedDateStr);
  const streak = calculateStreak(habit.completedDates);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      triggerAtomicCelebration();
    }
    onToggleComplete(habit.id, selectedDateStr);
  };

  const hasExtraDetails = Boolean(
    habit.identityStatement || habit.twoMinuteVersion || habit.cue || habit.targetGoal?.value
  );

  return (
    <div className={`group relative rounded-2xl transition-all duration-300 border overflow-hidden ${
      isCompleted 
        ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]' 
        : 'bg-[#131b28]/80 hover:bg-[#182335]/90 border-white/5 hover:border-white/10 shadow-lg'
    } p-3.5 sm:p-4`}>
      
      {/* Glow Left Accent Bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
        style={{ 
          backgroundColor: isCompleted ? '#10b981' : habit.color || '#10b981',
          boxShadow: isCompleted ? '0 0 12px #10b981' : 'none'
        }}
      />

      <div className="flex items-center justify-between gap-3 pl-2">
        
        {/* Left Side: Checkbox & Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          
          {/* Main Toggle Button */}
          <button
            onClick={handleCheckboxClick}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shrink-0 ${
              isCompleted 
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                : 'bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40'
            }`}
            title={isCompleted ? 'Completed! Click to uncheck' : 'Click to complete'}
          >
            {isCompleted ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition-colors" />
            )}
          </button>

          {/* Title & Time */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold tracking-tight transition-colors truncate ${
              isCompleted ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-slate-100'
            }`}>
              {habit.name}
            </h3>

            {/* Sub-info: Time */}
            {habit.timeOfDay && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{habit.timeOfDay}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Streak & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Streak Pill */}
          <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            streak.current > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-500'
          }`}>
            <Flame className={`w-3.5 h-3.5 ${streak.current > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            <span>{streak.current}d</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onOpenQuickLog(habit)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Add Note"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onEdit(habit)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Edit Habit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(habit.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Delete Habit"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Optional Expand Toggle */}
            {hasExtraDetails && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title={showDetails ? 'Hide details' : 'Show details'}
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Collapsible Details */}
      {showDetails && hasExtraDetails && (
        <div className="mt-3 pt-2.5 border-t border-white/5 pl-8 text-xs text-slate-400 space-y-1">
          {habit.identityStatement && (
            <p><span className="text-indigo-400 font-medium">Identity:</span> "{habit.identityStatement}"</p>
          )}
          {habit.twoMinuteVersion && (
            <p><span className="text-emerald-400 font-medium">2-Min Version:</span> {habit.twoMinuteVersion}</p>
          )}
          {habit.cue && (
            <p><span className="text-teal-400 font-medium">Trigger:</span> {habit.cue}</p>
          )}
        </div>
      )}

    </div>
  );
};




