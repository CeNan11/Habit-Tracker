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

// ----------------------------------------------------
// LOCAL INDEXEDDB OPERATIONS (Offline Fallback & Cache)
// ----------------------------------------------------

export async function saveUserLocally(user: User): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    store.put(user);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

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

export async function registerUserDB(username: string, password: string): Promise<{ user: User; habits: Habit[] }> {
  const db = await openDB();
  const passwordHash = await hashPassword(password);
  const cleanUsername = username.trim().toLowerCase();

  const existingUser = await getUserByUsernameDB(cleanUsername);
  if (existingUser) {
    throw new Error('Username already exists. Please choose a different one.');
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const colors = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newUser: User = {
    id: userId,
    username: cleanUsername,
    passwordHash,
    avatarColor,
    createdAt: new Date().toISOString()
  };

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

// ----------------------------------------------------
// HYBRID HYBRID API + LOCAL STORAGE OPERATIONS
// ----------------------------------------------------

export async function registerUser(username: string, password: string): Promise<{ user: User; habits: Habit[] }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register account on server');
    }

    // Cache to local IndexedDB
    await saveUserLocally(data.user);
    await saveAllUserHabitsDB(data.user.id, data.habits);

    return { user: data.user, habits: data.habits };
  } catch (err: any) {
    // If explicit user validation error from server (e.g. username exists), throw it directly
    if (err.message && err.message.includes('Username already exists')) {
      throw err;
    }
    // Fallback to local DB if server unreachable
    return registerUserDB(username, password);
  }
}

export async function loginUser(username: string, password: string): Promise<{ user: User; habits: Habit[] }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      // If server returned specific account/password error, check local DB fallback
      if (res.status === 404 || res.status === 401) {
        try {
          return await loginUserDB(username, password);
        } catch {
          throw new Error(data.error || 'Authentication failed');
        }
      }
      throw new Error(data.error || 'Failed to login to server');
    }

    // Save/update in local IndexedDB cache
    await saveUserLocally(data.user);
    await saveAllUserHabitsDB(data.user.id, data.habits);

    return { user: data.user, habits: data.habits };
  } catch (err: any) {
    if (err.message && (err.message.includes('Incorrect password') || err.message.includes('Account not found'))) {
      throw err;
    }
    // Network error fallback
    return loginUserDB(username, password);
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const res = await fetch(`/api/users/${userId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        await saveUserLocally(data.user);
        return data.user;
      }
    }
  } catch (e) {
    // fallback below
  }
  return getUserByIdDB(userId);
}

export async function getUserHabits(userId: string): Promise<Habit[]> {
  try {
    const res = await fetch(`/api/habits/${userId}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.habits)) {
        await saveAllUserHabitsDB(userId, data.habits);
        return data.habits;
      }
    }
  } catch (e) {
    // fallback below
  }
  return getUserHabitsDB(userId);
}

export async function saveHabit(userId: string, habit: Habit): Promise<void> {
  await saveHabitDB(userId, habit);
  try {
    await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habit: { ...habit, userId } })
    });
  } catch (e) {
    console.warn('Server sync failed, saved locally:', e);
  }
}

export async function deleteHabit(habitId: string): Promise<void> {
  await deleteHabitDB(habitId);
  try {
    await fetch(`/api/habits/${habitId}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Server delete sync failed, removed locally:', e);
  }
}

export async function syncLocalWithServer(user: User, habits: Habit[]): Promise<{ user: User; habits: Habit[] }> {
  try {
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, habits })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user && Array.isArray(data.habits)) {
        await saveUserLocally(data.user);
        await saveAllUserHabitsDB(data.user.id, data.habits);
        return { user: data.user, habits: data.habits };
      }
    }
  } catch (e) {
    console.warn('Server sync offline:', e);
  }
  return { user, habits };
}

// ----------------------------------------------------
// CROSS-DEVICE ACCOUNT SYNC KEY & EXPORT/IMPORT UTILS
// ----------------------------------------------------

export function generateSyncKey(user: User, habits: Habit[]): string {
  const payload = {
    version: 1,
    user,
    habits,
    createdAt: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(payload);
  return `HTSYNC_v1_${btoa(encodeURIComponent(jsonStr))}`;
}

export async function importSyncKey(syncKey: string): Promise<{ user: User; habits: Habit[] }> {
  let jsonStr = syncKey.trim();
  if (jsonStr.startsWith('HTSYNC_v1_')) {
    const base64Str = jsonStr.replace('HTSYNC_v1_', '');
    jsonStr = decodeURIComponent(atob(base64Str));
  }

  const data = JSON.parse(jsonStr);
  const user: User = data.user || data.currentUser;
  const habits: Habit[] = data.habits || [];

  if (!user || !user.id || !user.username) {
    throw new Error('Invalid Sync Key format: Missing user account data.');
  }

  // Save to local IndexedDB
  await saveUserLocally(user);
  await saveAllUserHabitsDB(user.id, habits);

  // Attempt server sync
  await syncLocalWithServer(user, habits);

  return { user, habits };
}

