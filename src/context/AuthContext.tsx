'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => {},
  isDemoUser: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemoUser = false;

  // Initialize auth state
  useEffect(() => {
    // Purge any legacy mock user data from localStorage
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('orbit_user_profile');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.uid === 'user-aarav-sharma' || parsed.uid?.startsWith('demo-')) {
            localStorage.removeItem('orbit_user_profile');
            localStorage.removeItem('orbit_subjects');
            localStorage.removeItem('orbit_timetable');
            localStorage.removeItem('orbit_attendance');
            localStorage.removeItem('orbit_exams');
            localStorage.removeItem('orbit_tasks');
            localStorage.removeItem('orbit_deadlines');
            localStorage.removeItem('orbit_streaks');
            localStorage.removeItem('orbit_focus');
          } else {
            setUser(parsed);
          }
        } catch {
          localStorage.removeItem('orbit_user_profile');
        }
      }
    }

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setFirebaseUser(fbUser);
          try {
            const userRef = doc(db, 'users', fbUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data() as UserProfile;
              setUser(data);
              localStorage.setItem('orbit_user_profile', JSON.stringify(data));
            } else {
              // New user profile created in Firestore
              const newProfile: UserProfile = {
                uid: fbUser.uid,
                name: fbUser.displayName || '',
                email: fbUser.email || '',
                photoURL: fbUser.photoURL || undefined,
                college: '',
                branch: '',
                semester: 1,
                attendanceTarget: 75,
                semStart: new Date().toISOString().split('T')[0],
                semEnd: new Date(Date.now() + 86400000 * 120).toISOString().split('T')[0],
                isOnboarded: false,
              };
              await setDoc(userRef, newProfile);
              setUser(newProfile);
              localStorage.setItem('orbit_user_profile', JSON.stringify(newProfile));
            }
          } catch (err) {
            console.error('Error fetching user document:', err);
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setFirebaseUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('orbit_user_profile');
          }
          setLoading(false);
        }
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Format Firebase Auth error codes into human-readable messages
  const formatAuthError = (code?: string): string => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please verify your credentials.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
      default:
        return 'Authentication failed. Please check your credentials and try again.';
    }
  };

  // Sign In with Email & Password
  const signInWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !pass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const userRef = doc(db, 'users', cred.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUser(data);
        localStorage.setItem('orbit_user_profile', JSON.stringify(data));
      }
      return { success: true };
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code;
      return { success: false, error: formatAuthError(errorCode) };
    }
  };

  // Sign Up with Email, Password & Full Name
  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !pass) {
      return { success: false, error: 'Please provide email and password.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        await updateFirebaseProfile(cred.user, { displayName: name.trim() });
      }

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        name: name.trim() || cred.user.displayName || '',
        email: cred.user.email || email.trim(),
        college: '',
        branch: '',
        semester: 1,
        attendanceTarget: 75,
        semStart: new Date().toISOString().split('T')[0],
        semEnd: new Date(Date.now() + 86400000 * 120).toISOString().split('T')[0],
        isOnboarded: false,
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUser(newProfile);
      localStorage.setItem('orbit_user_profile', JSON.stringify(newProfile));
      return { success: true };
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code;
      return { success: false, error: formatAuthError(errorCode) };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
    setUser(null);
    setFirebaseUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('orbit_user_profile');
      localStorage.removeItem('orbit_subjects');
      localStorage.removeItem('orbit_timetable');
      localStorage.removeItem('orbit_attendance');
      localStorage.removeItem('orbit_exams');
      localStorage.removeItem('orbit_tasks');
      localStorage.removeItem('orbit_deadlines');
      localStorage.removeItem('orbit_streaks');
      localStorage.removeItem('orbit_focus');
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('orbit_user_profile', JSON.stringify(merged));

    if (isFirebaseConfigured) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, merged, { merge: true });
      } catch (err) {
        console.error('Failed to sync profile with Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateProfile,
        isDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
