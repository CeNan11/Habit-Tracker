import confetti from 'canvas-confetti';
import type { Habit, HabitStack, HabitCategory } from '../types/habit';

export const CATEGORY_CONFIG: Record<HabitCategory, { label: string; color: string; bg: string; border: string; icon: string }> = {
  computer_science: {
    label: 'Coding',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-500/30',
    icon: 'Code'
  },
  health: {
    label: 'Health',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/30',
    icon: 'Activity'
  },
  mindset: {
    label: 'Focus',
    color: 'text-purple-400',
    bg: 'bg-purple-950/40',
    border: 'border-purple-500/30',
    icon: 'Brain'
  },
  productivity: {
    label: 'Productivity',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-500/30',
    icon: 'Zap'
  },
  learning: {
    label: 'Reading',
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/40',
    border: 'border-indigo-500/30',
    icon: 'BookOpen'
  },
  personal: {
    label: 'Personal',
    color: 'text-pink-400',
    bg: 'bg-pink-950/40',
    border: 'border-pink-500/30',
    icon: 'User'
  }
};

export const getTodayDateString = (): string => {
  const today = new Date();
  return formatDateString(today);
};

export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPastDates = (daysCount: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDateString(d));
  }
  return dates;
};

export const calculateStreak = (completedDates: string[]): { current: number; longest: number } => {
  if (!completedDates || completedDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  const sortedDates = Array.from(new Set(completedDates)).sort().reverse();
  const todayStr = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateString(yesterday);

  let currentStreak = 0;
  let checkDate = new Date();

  // If today is completed, start streak count from today
  if (sortedDates.includes(todayStr)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (sortedDates.includes(yesterdayStr)) {
    // If yesterday was completed, streak is active
    currentStreak = 1;
    checkDate = yesterday;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    currentStreak = 0;
  }

  if (currentStreak > 0) {
    while (true) {
      const targetStr = formatDateString(checkDate);
      if (sortedDates.includes(targetStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak in history
  let longest = 0;
  let tempStreak = 0;
  
  if (sortedDates.length > 0) {
    const dateObjs = sortedDates.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
    tempStreak = 1;
    longest = 1;

    for (let i = 1; i < dateObjs.length; i++) {
      const prev = dateObjs[i - 1];
      const curr = dateObjs[i];
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      if (tempStreak > longest) {
        longest = tempStreak;
      }
    }
  }

  return { current: currentStreak, longest: Math.max(currentStreak, longest) };
};

export const calculateAtomicScore = (habits: Habit[]): number => {
  if (habits.length === 0) return 1.0;
  const today = getTodayDateString();
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRatio = completedToday / habits.length;
  return 1 + 0.01 * completionRatio;
};

export const triggerAtomicCelebration = () => {
  confetti({
    particleCount: 50,
    spread: 50,
    origin: { y: 0.7 },
    colors: ['#10b981', '#6366f1', '#06b6d4', '#f59e0b']
  });
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Solve 1 DSA Problem',
    category: 'computer_science',
    identityStatement: '',
    twoMinuteVersion: '',
    cue: '',
    timeOfDay: '09:00 AM',
    frequency: 'daily',
    color: '#06b6d4',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedDates: [
      formatDateString(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
      formatDateString(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
      getTodayDateString(),
    ]
  },
  {
    id: 'habit-2',
    name: 'Read 10 Pages',
    category: 'learning',
    identityStatement: '',
    twoMinuteVersion: '',
    cue: '',
    timeOfDay: '01:30 PM',
    frequency: 'daily',
    color: '#6366f1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedDates: [
      formatDateString(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
      getTodayDateString(),
    ]
  },
  {
    id: 'habit-3',
    name: 'Push Clean Git Commit',
    category: 'computer_science',
    identityStatement: '',
    twoMinuteVersion: '',
    cue: '',
    timeOfDay: '05:30 PM',
    frequency: 'daily',
    color: '#10b981',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedDates: [
      getTodayDateString(),
    ]
  },
  {
    id: 'habit-4',
    name: '25-Min Deep Work Session',
    category: 'productivity',
    identityStatement: '',
    twoMinuteVersion: '',
    cue: '',
    timeOfDay: '10:00 AM',
    frequency: 'daily',
    color: '#f59e0b',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    completedDates: []
  },
  {
    id: 'habit-5',
    name: 'Physical Stretch & Walk',
    category: 'health',
    identityStatement: '',
    twoMinuteVersion: '',
    cue: '',
    timeOfDay: '11:30 AM',
    frequency: 'daily',
    color: '#ec4899',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    completedDates: [
      formatDateString(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
    ]
  }
];

export const INITIAL_STACKS: HabitStack[] = [
  {
    id: 'stack-1',
    title: 'Morning Developer Onboarding',
    anchorHabit: 'Powering on my laptop and opening terminal',
    newHabit: 'Solving 1 CS algorithm problem',
    locationAndTime: 'Home Office Desk at 9:00 AM',
    createdAt: new Date().toISOString()
  },
  {
    id: 'stack-2',
    title: 'Post-Lunch Knowledge Boost',
    anchorHabit: 'Finishing lunch and cleaning plate',
    newHabit: 'Reading 10 pages of CS architecture book',
    locationAndTime: 'Reading nook at 1:30 PM',
    createdAt: new Date().toISOString()
  }
];

const LOCAL_STORAGE_KEY_HABITS = 'atomic_habits_cs_v1';
const LOCAL_STORAGE_KEY_STACKS = 'atomic_stacks_cs_v1';

export const loadHabitsFromStorage = (): Habit[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_HABITS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load habits from localStorage', e);
  }
  return INITIAL_HABITS;
};

export const saveHabitsToStorage = (habits: Habit[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits to localStorage', e);
  }
};

export const loadStacksFromStorage = (): HabitStack[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_STACKS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load stacks from localStorage', e);
  }
  return INITIAL_STACKS;
};

export const saveStacksToStorage = (stacks: HabitStack[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_STACKS, JSON.stringify(stacks));
  } catch (e) {
    console.error('Failed to save stacks to localStorage', e);
  }
};
