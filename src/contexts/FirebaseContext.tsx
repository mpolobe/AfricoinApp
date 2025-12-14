import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore, setLogLevel } from 'firebase/firestore';

// Define global variables as they are exposed by the execution environment
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

interface FirebaseContextType {
  db: Firestore | null;
  auth: Auth | null;
  currentUser: User | null;
  userId: string | null;
  appId: string;
  isReady: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Use 'default-app-id' as a fallback if the global variable is missing
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  
  // Log level is set to Debug for easier debugging of Firestore rules and operations
  setLogLevel('debug');

  useEffect(() => {
    // 1. Initialize Firebase App
    const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
        console.error("Firebase config is missing or invalid.");
        return;
    }

    try {
        const app: FirebaseApp = initializeApp(firebaseConfig);
        const authInstance: Auth = getAuth(app);
        const dbInstance: Firestore = getFirestore(app);

        setAuth(authInstance);
        setDb(dbInstance);

        // 2. Handle Authentication
        const signInUser = async () => {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                // Use custom token if provided (e.g., from Canvas environment)
                await signInWithCustomToken(authInstance, __initial_auth_token);
            } else {
                // Otherwise, sign in anonymously
                await signInAnonymously(authInstance);
            }
        };

        // 3. Set up Auth State Listener
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setCurrentUser(user);
                setIsReady(true);
            } else {
                // If sign-out occurs, attempt to sign in again
                signInUser().catch(err => {
                    console.error("Failed to sign in after auth state change:", err);
                    setIsReady(true); // Still mark as ready even if anonymous sign-in failed
                });
            }
        });

        // Initial sign-in attempt
        signInUser().catch(err => {
             console.error("Initial sign-in failed:", err);
             setIsReady(true);
        });
        
        return () => unsubscribe();

    } catch (e) {
        console.error("Firebase initialization failed:", e);
        setIsReady(true);
    }
  }, []);

  // Determine the userId, preferring the authenticated user's UID
  const userId = currentUser?.uid || null;

  const value = { db, auth, currentUser, userId, appId, isReady };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};