export type HabitCategory = 
  | 'computer_science'
  | 'health'
  | 'mindset'
  | 'productivity'
  | 'learning'
  | 'personal';

export interface TargetGoal {
  value: number;
  unit: string;
}

export interface CompletionLog {
  completedAt: string; // ISO date YYYY-MM-DD
  timeSpentMinutes?: number;
  note?: string;
}

export interface Habit {
  id: string;
  userId?: string;
  name: string;
  category: HabitCategory;
  identityStatement: string; // "I am a master software engineer..."
  twoMinuteVersion: string;   // "Open VS Code and write 1 function"
  cue: string;                // "After I brew my morning tea"
  reward?: string;            // "Listen to favorite tech podcast"
  location?: string;          // "At desk in study"
  timeOfDay?: string;         // "08:30 AM"
  frequency: 'daily' | 'weekdays' | 'weekends';
  targetGoal?: TargetGoal;
  frictionScore?: number;
  color: string;
  createdAt: string;
  archived?: boolean;
  completedDates: string[];    // Array of YYYY-MM-DD
  logs?: Record<string, CompletionLog>; // YYYY-MM-DD -> CompletionLog
}

export interface HabitStack {
  id: string;
  title: string;
  anchorHabit: string;
  newHabit: string;
  locationAndTime: string;
  createdAt: string;
}

export type ViewTab = 'dashboard' | 'analytics';
