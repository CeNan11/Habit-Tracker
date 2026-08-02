import { useState, useEffect } from 'react';
import type { Habit, ViewTab } from './types/habit';
import { 
  calculateStreak, 
  getTodayDateString,
  loadHabitsFromStorage
} from './utils/habitUtils';

import type { User } from './services/db';
import { 
  getUserByIdDB, 
  getUserHabitsDB, 
  saveHabitDB, 
  deleteHabitDB, 
  loginUserDB, 
  registerUserDB 
} from './services/db';

import { Navbar } from './components/Navbar';
import { HabitCard } from './components/HabitCard';
import { HabitModal } from './components/HabitModal';
import { AnalyticsView } from './components/AnalyticsView';
import { QuickLogModal } from './components/QuickLogModal';
import { LandingHero } from './components/LandingHero';
import { AuthModal } from './components/AuthModal';

import { 
  Plus, 
  Search,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // User Account & Database State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Date selection state (defaults to Today YYYY-MM-DD)
  const todayStr = getTodayDateString();
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [quickLogHabit, setQuickLogHabit] = useState<Habit | null>(null);

  // Load user session & IndexedDB on mount
  useEffect(() => {
    async function initDB() {
      const activeUserId = localStorage.getItem('active_user_id');
      if (activeUserId) {
        try {
          const user = await getUserByIdDB(activeUserId);
          if (user) {
            setCurrentUser(user);
            const userHabits = await getUserHabitsDB(user.id);
            setHabits(userHabits);
            return;
          }
        } catch (e) {
          console.error('Failed to load user from IndexedDB:', e);
        }
      }
      
      // Fallback: local storage habits for guest session
      const fallback = loadHabitsFromStorage();
      setHabits(fallback);
    }

    initDB();
  }, []);

  // Auth Action Handlers
  const handleLoginClick = async (username: string, pass: string) => {
    const { user, habits: userHabits } = await loginUserDB(username, pass);
    setCurrentUser(user);
    setHabits(userHabits);
    localStorage.setItem('active_user_id', user.id);
  };

  const handleRegisterClick = async (username: string, pass: string) => {
    const { user, habits: userHabits } = await registerUserDB(username, pass);
    setCurrentUser(user);
    setHabits(userHabits);
    localStorage.setItem('active_user_id', user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('active_user_id');
    const fallback = loadHabitsFromStorage();
    setHabits(fallback);
  };

  // Toggle habit completion for the selected date
  const handleToggleComplete = async (habitId: string, dateStr: string = selectedDateStr) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;

      const dates = h.completedDates || [];
      const exists = dates.includes(dateStr);
      const newDates = exists
        ? dates.filter((d) => d !== dateStr)
        : [...dates, dateStr];

      const modifiedHabit = {
        ...h,
        completedDates: newDates,
      };

      if (currentUser) {
        saveHabitDB(currentUser.id, modifiedHabit);
      }
      return modifiedHabit;
    });

    setHabits(updated);
  };

  // Save or Edit Habit
  const handleSaveHabit = async (habitData: Partial<Habit>) => {
    if (editingHabit) {
      const updatedHabit = { ...editingHabit, ...habitData } as Habit;
      const updated = habits.map((h) => (h.id === editingHabit.id ? updatedHabit : h));
      setHabits(updated);
      if (currentUser) {
        await saveHabitDB(currentUser.id, updatedHabit);
      }
      setEditingHabit(null);
    } else {
      const newHabit: Habit = {
        id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: currentUser?.id,
        name: habitData.name || 'New Habit',
        category: 'personal',
        identityStatement: '',
        twoMinuteVersion: '',
        cue: '',
        timeOfDay: habitData.timeOfDay || '',
        frequency: 'daily',
        color: habitData.color || '#10b981',
        createdAt: new Date().toISOString(),
        completedDates: [],
        frictionScore: 1,
        logs: {},
      };
      const updated = [newHabit, ...habits];
      setHabits(updated);
      if (currentUser) {
        await saveHabitDB(currentUser.id, newHabit);
      }
    }
  };

  // Delete Habit
  const handleDeleteHabit = async (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    if (currentUser) {
      await deleteHabitDB(habitId);
    }
  };

  // Save Log Note
  const handleSaveLog = async (habitId: string, note: string, timeSpentMinutes?: number) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;
      const logs = h.logs || {};
      const updatedHabit = {
        ...h,
        logs: {
          ...logs,
          [selectedDateStr]: {
            completedAt: selectedDateStr,
            note,
            timeSpentMinutes,
          },
        },
      };

      if (currentUser) {
        saveHabitDB(currentUser.id, updatedHabit);
      }
      return updatedHabit;
    });

    setHabits(updated);
  };

  // Stats calculation for header
  const completedCountForSelectedDate = habits.filter((h) => h.completedDates.includes(selectedDateStr)).length;
  const progressPercentage = habits.length > 0 ? Math.round((completedCountForSelectedDate / habits.length) * 100) : 0;

  const maxStreak = habits.reduce((max, h) => {
    const s = calculateStreak(h.completedDates);
    return Math.max(max, s.current);
  }, 0);

  // Filter habits by search query
  const filteredHabits = habits.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Date Navigation Helpers
  const shiftSelectedDate = (days: number) => {
    const current = new Date(selectedDateStr);
    current.setDate(current.getDate() + days);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    setSelectedDateStr(`${year}-${month}-${day}`);
  };

  const isSelectedDateToday = selectedDateStr === todayStr;

  const formatDisplayDate = (dateStr: string) => {
    if (dateStr === todayStr) return 'Today';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] bg-ambient-glow text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Sleek Minimal Header - Only when logged in */}
      {currentUser && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={() => { setEditingHabit(null); setIsModalOpen(true); }}
          completedTodayCount={completedCountForSelectedDate}
          totalHabitsCount={habits.length}
          maxStreak={maxStreak}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-5">
        
        {/* LOGGED OUT LANDING HERO VIEW */}
        {!currentUser ? (
          <LandingHero
            onOpenRegister={() => setIsAuthModalOpen(true)}
            onOpenLogin={() => setIsAuthModalOpen(true)}
          />
        ) : (
          /* LOGGED IN DASHBOARD VIEW */
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-5">
                
                {/* Minimal Date & Progress Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#131b28]/80 border border-white/5 shadow-xl space-y-3.5 backdrop-blur-md">
                  
                  {/* Date Selector Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span className="text-base font-bold text-slate-100 tracking-tight">
                        {formatDisplayDate(selectedDateStr)}
                      </span>
                      {!isSelectedDateToday && (
                        <button 
                          onClick={() => setSelectedDateStr(todayStr)}
                          className="text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-semibold transition-colors cursor-pointer"
                        >
                          Today
                        </button>
                      )}
                    </div>

                    {/* Day Prev/Next Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => shiftSelectedDate(-1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        title="Previous Day"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => shiftSelectedDate(1)}
                        disabled={isSelectedDateToday}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSelectedDateToday 
                            ? 'text-slate-600 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        title="Next Day"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Daily Progress</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {completedCountForSelectedDate} / {habits.length} ({progressPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Quick Search & Add Bar */}
                {habits.length > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search habits..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#131b28]/60 border border-white/5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Minimal Habit List */}
                {filteredHabits.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl bg-[#131b28]/40 border border-white/5 shadow-lg text-slate-400 space-y-3">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs text-slate-400 font-medium">No habits added yet</p>
                    <button
                      onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 inline-flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add Habit</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredHabits.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        selectedDateStr={selectedDateStr}
                        onToggleComplete={handleToggleComplete}
                        onEdit={(h) => { setEditingHabit(h); setIsModalOpen(true); }}
                        onDelete={handleDeleteHabit}
                        onOpenQuickLog={(h) => setQuickLogHabit(h)}
                      />
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* STATS VIEW */}
            {activeTab === 'analytics' && <AnalyticsView habits={habits} />}
          </>
        )}

      </main>

      {/* Auth Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user, userHabits) => {
          setCurrentUser(user);
          setHabits(userHabits);
        }}
        onRegisterSuccess={(user, userHabits) => {
          setCurrentUser(user);
          setHabits(userHabits);
        }}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      {/* Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingHabit(null); }}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* Quick Reflection / Log Note Modal */}
      <QuickLogModal
        habit={quickLogHabit}
        isOpen={!!quickLogHabit}
        onClose={() => setQuickLogHabit(null)}
        onSaveLog={handleSaveLog}
      />

    </div>
  );
}

export default App;
