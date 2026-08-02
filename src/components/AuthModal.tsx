import React, { useState } from 'react';
import type { User } from '../services/db';
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  X, 
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, habits: any[]) => void;
  onRegisterSuccess: (user: User, habits: any[]) => void;
  onLoginClick: (username: string, pass: string) => Promise<void>;
  onRegisterClick: (username: string, pass: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginClick,
  onRegisterClick
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    if (mode === 'register' && password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await onLoginClick(username.trim(), password);
      } else {
        await onRegisterClick(username.trim(), password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f17]/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-sm bg-[#131b28]/95 rounded-3xl shadow-2xl p-6 space-y-5 animate-fadeIn border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' ? 'Sign in to access your habit tracker' : 'Register a new account to save your habits'}
          </p>
        </div>

        {/* Minimal Tab Switcher (No Box Lines) */}
        <div className="flex items-center justify-center gap-4 border-b border-white/5 pb-3">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`text-xs font-bold transition-all cursor-pointer pb-1 relative ${
              mode === 'login'
                ? 'text-emerald-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`text-xs font-bold transition-all cursor-pointer pb-1 relative ${
              mode === 'register'
                ? 'text-emerald-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white/5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all border-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all border-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
