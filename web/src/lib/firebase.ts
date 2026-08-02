import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA1Fr5-kisfCVtqPmh3oZtXXexjyZjx2sE",
  authDomain: "test-marks-ai.firebaseapp.com",
  projectId: "test-marks-ai",
  storageBucket: "test-marks-ai.firebasestorage.app",
  messagingSenderId: "215375472275",
  appId: "1:215375472275:web:55d92bdc1739875d198f66",
  measurementId: "G-L3032QYGCN",
};

export const app: FirebaseApp = getApps().length ? (getApps()[0] as FirebaseApp) : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);

export const db: Firestore = getFirestore(app);

let analytics: Analytics | null | undefined;

export async function getAnalyticsOnce(): Promise<Analytics | null> {
  if (analytics !== undefined) return analytics;
  if (typeof window === "undefined") {
    analytics = null;
    return null;
  }
  try {
    analytics = (await isSupported()) ? getAnalytics(app) : null;
  } catch {
    analytics = null;
  }
  return analytics;
}
