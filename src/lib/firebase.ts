import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBoMs1FUBh1UkTCeKOfYB_x4DfMVlHC2QI",
  authDomain: "jobpilot-1a04a.firebaseapp.com",
  projectId: "jobpilot-1a04a",
  storageBucket: "jobpilot-1a04a.appspot.com",
  messagingSenderId: "606572453369",
  appId: "1:606572453369:web:6706fec8eaa69267a2f128",
  measurementId: "G-CS8CCBZS7T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable persistent auth state
(async () => {
  await setPersistence(auth, browserLocalPersistence);
})();

export const db = getFirestore(app);

export const createUserDocument = async (uid: string, data: { firstName: string; email: string }) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      firstName: data.firstName,
      email: data.email,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};