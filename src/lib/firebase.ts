import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  getDocFromServer,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

// Test connection on boot per Firebase skill guidelines
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Verify configuration.');
    }
  }
}
testFirestoreConnection();

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  lastLoginAt: string;
  role: 'admin' | 'developer' | 'viewer';
}

export interface DashboardMetrics {
  totalPipelineRuns: number;
  successRate: number;
  pipelineFailures: number;
  selfHealedFixes: number;
  manualFixesAvoided: number;
  avgMttrMinutes: number;
  lastUpdated?: string;
}

// Sign in with Google and persist user profile in Firestore
export async function signInWithGoogle(): Promise<UserProfile | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const now = new Date().toISOString();
    let profile: UserProfile;

    if (!userSnap.exists()) {
      profile = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName || 'DevOps Engineer',
        photoURL: user.photoURL,
        createdAt: now,
        lastLoginAt: now,
        role: 'admin'
      };
      await setDoc(userRef, profile);
    } else {
      profile = userSnap.data() as UserProfile;
      await updateDoc(userRef, { lastLoginAt: now });
    }

    return profile;
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

// Sync user profile from Firestore on auth change
export function subscribeToAuth(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        callback(userSnap.data() as UserProfile);
      } else {
        const profile: UserProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'DevOps Engineer',
          photoURL: firebaseUser.photoURL,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          role: 'developer'
        };
        await setDoc(userRef, profile);
        callback(profile);
      }
    } catch (e) {
      console.warn('Could not fetch user profile from Firestore:', e);
      callback({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'DevOps Engineer',
        photoURL: firebaseUser.photoURL,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        role: 'developer'
      });
    }
  });
}

// Initial default seed metrics
export const DEFAULT_METRICS: DashboardMetrics = {
  totalPipelineRuns: 168,
  successRate: 98.6,
  pipelineFailures: 146,
  selfHealedFixes: 144,
  manualFixesAvoided: 144,
  avgMttrMinutes: 4.9
};

// Subscribe to real-time global dashboard metrics
export function subscribeToGlobalMetrics(callback: (metrics: DashboardMetrics) => void) {
  const metricsRef = doc(db, 'metrics', 'global');
  
  return onSnapshot(metricsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as DashboardMetrics;
      callback(data);
    } else {
      // Seed default metrics document if missing
      setDoc(metricsRef, {
        ...DEFAULT_METRICS,
        lastUpdated: new Date().toISOString()
      }).catch(console.warn);
      callback(DEFAULT_METRICS);
    }
  }, (err) => {
    console.warn('Firestore metrics snapshot error (using fallback):', err);
    callback(DEFAULT_METRICS);
  });
}

// Record an autonomous pipeline run and update aggregate metrics in Firestore
export async function recordRunInFirestore(run: {
  id: string;
  repo: string;
  branch: string;
  commitSha: string;
  workflowName: string;
  status: 'healed' | 'failed' | 'running' | 'merged';
  errorSummary: string;
  errorCategory: string;
  isSelfHealed: boolean;
  executionTimeMs: number;
}) {
  try {
    const runRef = doc(db, 'pipelineRuns', run.id);
    const currentUser = auth.currentUser;

    await setDoc(runRef, {
      ...run,
      userId: currentUser?.uid || 'autonomous-agent',
      createdAt: new Date().toISOString()
    });

    // Update global metrics doc
    const metricsRef = doc(db, 'metrics', 'global');
    await updateDoc(metricsRef, {
      totalPipelineRuns: increment(1),
      pipelineFailures: increment(1),
      selfHealedFixes: increment(run.isSelfHealed ? 1 : 0),
      manualFixesAvoided: increment(run.isSelfHealed ? 1 : 0),
      lastUpdated: new Date().toISOString()
    }).catch(async () => {
      // If doc doesn't exist yet, initialize it
      await setDoc(metricsRef, {
        totalPipelineRuns: DEFAULT_METRICS.totalPipelineRuns + 1,
        successRate: 98.8,
        pipelineFailures: DEFAULT_METRICS.pipelineFailures + 1,
        selfHealedFixes: DEFAULT_METRICS.selfHealedFixes + (run.isSelfHealed ? 1 : 0),
        manualFixesAvoided: DEFAULT_METRICS.manualFixesAvoided + 1,
        avgMttrMinutes: 4.8,
        lastUpdated: new Date().toISOString()
      });
    });
  } catch (error) {
    console.warn('Failed to record run in Firestore:', error);
  }
}
