import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface User {
  id: string;
  username: string;
  passwordHash: string;
  avatarColor: string;
  createdAt: string;
}

interface Habit {
  id: string;
  userId?: string;
  name: string;
  color: string;
  category: string;
  identityStatement: string;
  twoMinuteVersion: string;
  cue: string;
  timeOfDay?: string;
  frequency: string;
  completedDates: string[];
  createdAt: string;
  frictionScore?: number;
  logs?: Record<string, any>;
}

interface DBData {
  users: User[];
  habits: Habit[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server-data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDB(): DBData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DBData = { users: [], habits: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DBData;
  } catch {
    const initialData: DBData = { users: [], habits: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDB(data: DBData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function hashPasswordNode(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function sendJSON(res: any, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}


function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err: any) => reject(err));
  });
}

export function apiPlugin(): Plugin {
  const handleApi = async (req: any, res: any, next: any) => {
    const url = req.url || '';

    if (!url.startsWith('/api')) {
      return next();
    }

    // CORS preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.end();
    }

    try {
      const dbData = ensureDB();

      // Health Check
      if (url === '/api/health' && req.method === 'GET') {
        return sendJSON(res, 200, { status: 'ok', online: true, serverTime: new Date().toISOString() });
      }

      // Register User
      if (url === '/api/auth/register' && req.method === 'POST') {
        const { username, password } = await readBody(req);
        if (!username || !password) {
          return sendJSON(res, 400, { error: 'Username and password are required' });
        }

        const cleanUsername = username.trim().toLowerCase();
        const existing = dbData.users.find(u => u.username.toLowerCase() === cleanUsername);
        if (existing) {
          return sendJSON(res, 400, { error: 'Username already exists. Please choose a different one.' });
        }

        const passwordHash = hashPasswordNode(password);
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

        dbData.users.push(newUser);
        dbData.habits.push(...initialHabits);
        saveDB(dbData);

        return sendJSON(res, 200, { user: newUser, habits: initialHabits });
      }

      // Login User
      if (url === '/api/auth/login' && req.method === 'POST') {
        const { username, password } = await readBody(req);
        if (!username || !password) {
          return sendJSON(res, 400, { error: 'Username and password are required' });
        }

        const cleanUsername = username.trim().toLowerCase();
        const user = dbData.users.find(u => u.username.toLowerCase() === cleanUsername);
        if (!user) {
          return sendJSON(res, 404, { error: 'Account not found on server. Please check your username or register.' });
        }

        const passwordHash = hashPasswordNode(password);
        if (user.passwordHash !== passwordHash) {
          return sendJSON(res, 401, { error: 'Incorrect password. Please try again.' });
        }

        const userHabits = dbData.habits.filter(h => h.userId === user.id);
        return sendJSON(res, 200, { user, habits: userHabits });
      }

      // Sync Account & Habits from local device to server
      if (url === '/api/auth/sync' && req.method === 'POST') {
        const { user, habits } = await readBody(req);
        if (!user || !user.id || !user.username) {
          return sendJSON(res, 400, { error: 'Invalid user payload' });
        }

        const cleanUsername = user.username.trim().toLowerCase();
        const existingIdx = dbData.users.findIndex(u => u.id === user.id || u.username.toLowerCase() === cleanUsername);

        if (existingIdx >= 0) {
          dbData.users[existingIdx] = { ...dbData.users[existingIdx], ...user, username: cleanUsername };
        } else {
          dbData.users.push({ ...user, username: cleanUsername });
        }

        if (Array.isArray(habits)) {
          dbData.habits = dbData.habits.filter(h => h.userId !== user.id);
          const formattedHabits = habits.map(h => ({ ...h, userId: user.id }));
          dbData.habits.push(...formattedHabits);
        }

        saveDB(dbData);

        const currentHabits = dbData.habits.filter(h => h.userId === user.id);
        return sendJSON(res, 200, { success: true, user: dbData.users.find(u => u.id === user.id) || user, habits: currentHabits });
      }

      // Get User by ID
      if (url.startsWith('/api/users/') && req.method === 'GET') {
        const userId = url.replace('/api/users/', '').split('?')[0];
        const user = dbData.users.find(u => u.id === userId);
        if (!user) {
          return sendJSON(res, 404, { error: 'User not found' });
        }
        return sendJSON(res, 200, { user });
      }

      // Get Habits by User ID
      if (url.startsWith('/api/habits/') && req.method === 'GET') {
        const userId = url.replace('/api/habits/', '').split('?')[0];
        const userHabits = dbData.habits.filter(h => h.userId === userId);
        return sendJSON(res, 200, { habits: userHabits });
      }

      // Save/Update Habit
      if (url === '/api/habits' && req.method === 'POST') {
        const { habit } = await readBody(req);
        if (!habit || !habit.id || !habit.userId) {
          return sendJSON(res, 400, { error: 'Valid habit payload with id and userId is required' });
        }

        const existingIdx = dbData.habits.findIndex(h => h.id === habit.id);
        if (existingIdx >= 0) {
          dbData.habits[existingIdx] = habit;
        } else {
          dbData.habits.push(habit);
        }

        saveDB(dbData);
        return sendJSON(res, 200, { success: true, habit });
      }

      // Delete Habit
      if (url.startsWith('/api/habits/') && req.method === 'DELETE') {
        const habitId = url.replace('/api/habits/', '').split('?')[0];
        dbData.habits = dbData.habits.filter(h => h.id !== habitId);
        saveDB(dbData);
        return sendJSON(res, 200, { success: true });
      }

      return next();
    } catch (err: any) {
      console.error('API Error:', err);
      return sendJSON(res, 500, { error: err.message || 'Internal server error' });
    }
  };

  return {
    name: 'api-server-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(handleApi);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handleApi);
    }
  };
}
