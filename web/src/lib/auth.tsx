"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, type DocumentSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { Role, SignInInput, User } from "./types";

const ONBOARDED_KEY = "tma_onboarded";

export const ADMIN_SECRET = "ADMIN2026";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  onboarded: boolean;
  signIn: (input: SignInInput) => Promise<User>;
  signUp: (input: SignInInput) => Promise<User>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  setOnboarded: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readOnboarded(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ONBOARDED_KEY) === "1";
}

function toUser(fb: FirebaseUser, snapshot?: DocumentSnapshot | null): User {
  const data = snapshot?.exists() ? (snapshot.data() as Record<string, unknown>) : {};
  return {
    id: fb.uid,
    name:
      (typeof data.name === "string" && data.name.trim()) ||
      fb.displayName ||
      fb.email?.split("@")[0] ||
      "Student",
    email: fb.email ?? "",
    role: data.role === "admin" ? "admin" : "student",
    premium: data.premium === true,
    stream: typeof data.stream === "string" ? data.stream : undefined,
  };
}

async function loadProfile(fb: FirebaseUser): Promise<User> {
  try {
    const snapshot = await getDoc(doc(db, "users", fb.uid));
    return toUser(fb, snapshot);
  } catch {
    return toUser(fb, null);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboardedState] = useState<boolean>(() => readOnboarded());
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fb) => {
      if (!fb) {
        userRef.current = null;
        setUser(null);
        setLoading(false);
        setHydrated(true);
        return;
      }
      const profile = await loadProfile(fb);
      userRef.current = profile;
      setUser(profile);
      setLoading(false);
      setHydrated(true);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (input: SignInInput): Promise<User> => {
    const cred = await signInWithEmailAndPassword(auth, input.email, input.password);
    const profile = await loadProfile(cred.user);
    if (profile.role !== input.role) {
      throw new Error(input.role === "admin" ? "This account is not an admin." : "This account is not a student account.");
    }
    userRef.current = profile;
    setUser(profile);
    return profile;
  }, []);

  const signUp = useCallback(async (input: SignInInput): Promise<User> => {
    if (input.role === "admin" && input.adminCode !== ADMIN_SECRET) {
      throw new Error("Invalid admin code.");
    }
    const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
    const profile: User = {
      id: cred.user.uid,
      name: input.name.trim() || cred.user.email?.split("@")[0] || "Student",
      email: cred.user.email ?? "",
      role: input.role,
      premium: false,
    };
    try {
      await setDoc(doc(db, "users", cred.user.uid), {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        premium: false,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // Firestore rules may block writes; the app still works with defaults.
    }
    userRef.current = profile;
    setUser(profile);
    return profile;
  }, []);

  const signOut = useCallback(async () => {
    userRef.current = null;
    setUser(null);
    await firebaseSignOut(auth);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    const prev = userRef.current;
    const next = { ...(prev ?? ({} as User)), ...patch };
    userRef.current = next;
    setUser(next);
    if (next.id && auth.currentUser) {
      const fields: Record<string, unknown> = {};
      if (patch.name !== undefined) fields.name = patch.name;
      if (patch.stream !== undefined) fields.stream = patch.stream;
      if (patch.premium !== undefined) fields.premium = patch.premium;
      if (patch.role !== undefined) fields.role = patch.role;
      if (Object.keys(fields).length > 0) {
        updateDoc(doc(db, "users", next.id), fields).catch(() => {});
      }
    }
  }, []);

  const setOnboarded = useCallback((value: boolean) => {
    setOnboardedState(value);
    window.localStorage.setItem(ONBOARDED_KEY, value ? "1" : "0");
  }, []);

  const value = useMemo(
    () => ({ user, loading, hydrated, onboarded, signIn, signUp, signOut, updateUser, setOnboarded }),
    [user, loading, hydrated, onboarded, signIn, signUp, signOut, updateUser, setOnboarded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children, role }: { children: ReactNode; role?: Role }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (!hydrated || redirected.current) return;
    if (!user) {
      redirected.current = true;
      router.replace("/signin");
      return;
    }
    if (role && user.role !== role) {
      redirected.current = true;
      router.replace(role === "admin" ? "/signin" : "/dashboard");
    }
  }, [hydrated, user, role, router]);

  if (!hydrated) return null;
  if (!user || (role && user.role !== role)) return null;
  return <>{children}</>;
}

export function getOnboarded() {
  return readOnboarded();
}
