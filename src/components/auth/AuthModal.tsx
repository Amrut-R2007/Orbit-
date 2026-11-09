'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, X, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
}) => {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        const res = await signInWithEmail(email, password);
        if (res.success) {
          onClose();
          router.push('/dashboard');
        } else {
          setError(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else {
        const res = await signUpWithEmail(email, password, name);
        if (res.success) {
          onClose();
          router.push('/onboarding');
        } else {
          setError(res.error || 'Failed to create account.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[var(--primary)]/15 flex items-center justify-center border border-[var(--primary)]/30">
              <MonsteraLeaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight">
                {mode === 'signin' ? 'Sign In to Orbit' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {mode === 'signin'
                  ? 'Access your subjects, attendance, and timetable'
                  : 'Track your semester calmly with Orbit'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amrut Patil"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                College / Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu or name@mail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[var(--primary)] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all"
            >
              <span>
                {submitting
                  ? 'Verifying...'
                  : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Free Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
