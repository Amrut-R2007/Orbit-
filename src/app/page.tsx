'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  FileSpreadsheet,
  GraduationCap,
  Timer,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
  Mail,
  UserPlus,
} from 'lucide-react';
import { TropicalPatternHero } from '@/components/leaves/TropicalPatternHero';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { ThemeToggle } from '@/components/ThemeToggle';
import { InteractiveAttendanceDemo } from '@/components/demo/InteractiveAttendanceDemo';
import { ThemeRecolorPreview } from '@/components/demo/ThemeRecolorPreview';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const features = [
    {
      icon: CalendarDays,
      title: 'Attendance & Bunk Predictor',
      description:
        'Live buffer calculations ("You can still miss 3 classes") and instant recovery targets calculated against your university policy.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Exams & Syllabus Checklist',
      description:
        'Track CIE 1, CIE 2, and Semester End Exams with expected vs obtained marks. Dynamic green/red performance flags.',
    },
    {
      icon: GraduationCap,
      title: 'RVCE SGPA/CGPA Engine',
      description:
        'Automated autonomous RVCE grading scheme with W and F exclusions, What-if target planners, and transparent formulas.',
    },
    {
      icon: Timer,
      title: 'Focus Timer & Study Heatmaps',
      description:
        'Background-safe Pomodoro sessions with soothing nature chimes, subject linkage, and weekly analytics.',
    },
    {
      icon: Flame,
      title: 'Streaks & Leaf Confetti',
      description:
        'Stay motivated with attendance streaks, task completions, and celebratory tropical confetti celebrations.',
    },
    {
      icon: ShieldCheck,
      title: 'Offline Campus PWA',
      description:
        'Works seamlessly on spotty campus Wi-Fi. Mark classes offline and automatically sync when connected.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/15 flex items-center justify-center border border-[var(--primary)]/30">
              <MonsteraLeaf className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight">Orbit</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-[var(--muted-foreground)] font-medium">
                by ByteCraft Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={() => openAuth('signin')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Headline & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Designed for Academic Calm & Focus</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-[var(--foreground)]"
            >
              Orbit your <span className="text-[var(--primary)]">semester.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-[var(--muted-foreground)] leading-relaxed max-w-2xl"
            >
              Attendance, subjects, exams and daily focus, in one calm place. Stay above your 75%
              target without stress.
            </motion.p>

            {/* CTAs with Email & Password Credential Sign In & Account Creation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start"
            >
              <button
                onClick={() => openAuth('signin')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-bold text-sm shadow-xl hover:opacity-95 active:scale-95 transition-all"
              >
                <Mail className="w-4 h-4 text-[var(--primary)]" />
                <span>Sign In with Email</span>
              </button>

              <button
                onClick={() => openAuth('signup')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-bold text-sm shadow-sm hover:border-[var(--primary)] active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4 text-[var(--primary)]" />
                <span>Create Free Account</span>
              </button>
            </motion.div>

            {/* Social proof / badges */}
            <div className="pt-4 flex items-center gap-6 justify-center lg:justify-start text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free for students
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> RVCE Grading Scheme
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Offline Capable PWA
              </span>
            </div>
          </div>

          {/* Animated Botanical Hero Artwork with Parallax & Sway */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <TropicalPatternHero />
          </div>
        </div>
      </section>

      {/* Live Demos Section (Attendance Ring & Botanical Theme Switcher) */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[var(--border)]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            Experience the Motion
          </span>
          <h2 className="text-3xl font-extrabold text-[var(--foreground)]">
            Designed for instant clarity
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Test the live attendance calculator and botanical theme recoloring right here before signing in.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <InteractiveAttendanceDemo />
          <ThemeRecolorPreview />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[var(--border)]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            Comprehensive Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)]">
            Everything your semester demands
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="orbit-card p-6 bg-[var(--card)] hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 flex items-center justify-center text-[var(--primary)] mb-4 border border-[var(--primary)]/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{feat.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)] bg-[var(--card)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MonsteraLeaf className="w-5 h-5" />
            <span className="font-bold text-sm text-[var(--foreground)]">Orbit</span>
            <span className="text-xs text-[var(--muted-foreground)]">by ByteCraft Studio</span>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            Built for college students with tropical line-art design & RVCE grading scheme.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-[var(--muted-foreground)]">
            <Link href="/dashboard" className="hover:text-[var(--primary)]">Dashboard</Link>
            <Link href="/gpa" className="hover:text-[var(--primary)]">SGPA Calculator</Link>
            <Link href="/predictor" className="hover:text-[var(--primary)]">Bunk Predictor</Link>
          </div>
        </div>
      </footer>

      {/* Email & Password Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </div>
  );
}
