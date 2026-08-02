import type { Habit } from '../types/habit';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  avatarColor: string;
  createdAt: string;
}

const DB_NAME = 'HabitTrackerDB';
const DB_VERSION = 1;

// Helper: Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Users Store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('username', 'username', { unique: true });
      }

      // Habits Store
      if (!db.objectStoreNames.contains('habits')) {
        const habitStore = db.createObjectStore('habits', { keyPath: 'id' });
        habitStore.createIndex('userId', 'userId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Password hashing using Web Crypto API (SHA-256)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Register a new user in IndexedDB
export async function registerUserDB(username: string, password: string): Promise<{ user: User; habits: Habit[] }> {
  const db = await openDB();
  const passwordHash = await hashPassword(password);
  const cleanUsername = username.trim().toLowerCase();

  // Check if username already exists
  const existingUser = await getUserByUsernameDB(cleanUsername);
  if (existingUser) {
    throw new Error('Username already exists. Please choose a different one.');
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const colors = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newUser: User = {
    id: userId,
    username: cleanUsername,
    passwordHash,
    avatarColor,
    createdAt: new Date().toISOString()
  };

  // Default starter habits for new user
  const initialHabits: Habit[] = [
    {
      id: `habit_${Date.now()}_1`,
      userId: newUser.id,
      name: 'Morning Hydration',
      color: '#10b981',
      category: 'personal',
      identityStatement: '',
      twoMinuteVersion: '',
      cue: '',
      frequency: 'daily',
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: `habit_${Date.now()}_2`,
      userId: newUser.id,
      name: 'Read 15 Mins',
      color: '#6366f1',
      category: 'personal',
      identityStatement: '',
      twoMinuteVersion: '',
      cue: '',
      frequency: 'daily',
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: `habit_${Date.now()}_3`,
      userId: newUser.id,
      name: '30 Min Workout',
      color: '#f59e0b',
      category: 'personal',
      identityStatement: '',
      twoMinuteVersion: '',
      cue: '',
      frequency: 'daily',
      completedDates: [],
      createdAt: new Date().toISOString(),
    }
  ];

  // Transaction to save user & initial habits
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['users', 'habits'], 'readwrite');
    const userStore = tx.objectStore('users');
    const habitStore = tx.objectStore('habits');

    userStore.add(newUser);
    initialHabits.forEach(h => habitStore.add(h));

    tx.oncomplete = () => resolve({ user: newUser, habits: initialHabits });
    tx.onerror = () => reject(tx.error);
  });
}

// Get User by Username from IndexedDB
export async function getUserByUsernameDB(username: string): Promise<User | null> {
  const db = await openDB();
  const cleanUsername = username.trim().toLowerCase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const index = store.index('username');
    const request = index.get(cleanUsername);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// Login User via IndexedDB
export async function loginUserDB(username: string, password: string): Promise<{ user: User; habits: Habit[] }> {
  const cleanUsername = username.trim().toLowerCase();
  const user = await getUserByUsernameDB(cleanUsername);

  if (!user) {
    throw new Error('Account not found. Please register first.');
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    throw new Error('Incorrect password. Please try again.');
  }

  const habits = await getUserHabitsDB(user.id);
  return { user, habits };
}

// Get User Habits from IndexedDB
export async function getUserHabitsDB(userId: string): Promise<Habit[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('habits', 'readonly');
    const store = tx.objectStore('habits');
    const index = store.index('userId');
    const request = index.getAll(userId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// Save or Update Habit in IndexedDB
export async function saveHabitDB(userId: string, habit: Habit): Promise<void> {
  const db = await openDB();
  const habitToSave = { ...habit, userId };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('habits', 'readwrite');
    const store = tx.objectStore('habits');
    store.put(habitToSave);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Delete Habit from IndexedDB
export async function deleteHabitDB(habitId: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('habits', 'readwrite');
    const store = tx.objectStore('habits');
    store.delete(habitId);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Save All User Habits (bulk update)
export async function saveAllUserHabitsDB(userId: string, habits: Habit[]): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('habits', 'readwrite');
    const store = tx.objectStore('habits');
    
    habits.forEach(h => store.put({ ...h, userId }));

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Get User by ID
export async function getUserByIdDB(userId: string): Promise<User | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const request = store.get(userId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}
