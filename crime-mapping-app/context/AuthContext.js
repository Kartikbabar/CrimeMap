// context/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, db, googleProvider, facebookProvider, signInWithPopup } from '@/lib/firebase';
import { doc, setDoc, getDoc, query, collection, where, getDocs, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 1. Try fetching from citizens
          let data = null;
          const citizenSanp = await getDoc(doc(db, 'citizens', firebaseUser.uid));

          if (citizenSanp.exists()) {
            data = citizenSanp.data();
          } else {
            // 2. Try police
            const policeSnap = await getDoc(doc(db, 'police', firebaseUser.uid));
            if (policeSnap.exists()) {
              data = policeSnap.data();
            } else {
              // 3. Fallback to users (legacy)
              const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userSnap.exists()) {
                data = userSnap.data();
              }
            }
          }

          const combinedUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...(data || {})
          };
          setUser(combinedUser);
          setUserData(data || {});
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Aadhaar Simple Checksum Verification (Mock)
  const verifyAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar); // Simple 12-digit check for demo
  };

  // Citizen Signup (Email/Pass)
  const citizenSignup = async (email, password, userInfo) => {
    if (userInfo.aadhar && !verifyAadhaar(userInfo.aadhar)) {
      return { success: false, error: 'Invalid Aadhaar Number format' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: userInfo.fullName });

      const data = {
        uid: userCredential.user.uid,
        email,
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        aadhar: userInfo.aadhar,
        role: 'citizen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'citizens', userCredential.user.uid), data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Social Sign-in
  const socialSignIn = async (providerName) => {
    const provider = providerName === 'google' ? googleProvider : facebookProvider;
    try {
      const result = await signInWithPopup(auth, provider);
      // Social login defaults to citizen
      const userRef = doc(db, 'citizens', result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Check if they are actually a police officer logging in with social (unlikely but possible logic)
        // For now, assume social = citizen
        const policeRef = doc(db, 'police', result.user.uid);
        const policeSnap = await getDoc(policeRef);

        if (policeSnap.exists()) {
          setUserData(policeSnap.data());
          return { success: true, user: result.user };
        }

        // New user via social -> Citizen
        const data = {
          uid: result.user.uid,
          email: result.user.email,
          fullName: result.user.displayName,
          role: 'citizen', // Default social to citizen
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, data);
        setUserData(data);
      }
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Police Signup
  const policeSignup = async (email, password, userInfo) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: userInfo.fullName });

      const data = {
        uid: userCredential.user.uid,
        email,
        fullName: userInfo.fullName,
        badgeNumber: userInfo.badgeNumber,
        stationId: userInfo.stationId,
        district: userInfo.district,
        role: 'police',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'police', userCredential.user.uid), data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password, district, stationId) => {
    try {
      // 1. Check for seeded/managed accounts in 'police' collection first
      const policeQ = query(collection(db, 'police'), where('email', '==', email));
      const policeSnap = await getDocs(policeQ);

      let userDataResult = null;
      let bypassAuth = false;

      if (!policeSnap.empty) {
        // Find matching officer with correct password/district/station
        const officerDoc = policeSnap.docs.find(d => {
          const data = d.data();
          // Case insensitive comparison for district/station
          return data.password === password &&
            data.district?.toLowerCase() === district?.toLowerCase() &&
            data.stationId?.toLowerCase() === stationId?.toLowerCase();
        });

        if (officerDoc) {
          userDataResult = officerDoc.data();
          bypassAuth = true;
        }
      }

      let userCredential = null;
      if (!bypassAuth) {
        // Normal Firebase Auth check
        userCredential = await signInWithEmailAndPassword(auth, email, password);

        let data = null;
        // Check citizens
        const citizenSanp = await getDoc(doc(db, 'citizens', userCredential.user.uid));
        if (citizenSanp.exists()) {
          data = citizenSanp.data();
        } else {
          // Check police
          const policeSnapReal = await getDoc(doc(db, 'police', userCredential.user.uid));
          if (policeSnapReal.exists()) {
            data = policeSnapReal.data();
            // Verify district and station for real accounts too if provided
            if (district && data.district?.toLowerCase() !== district.toLowerCase()) {
              throw new Error(`Account not assigned to ${district}`);
            }
            if (stationId && data.stationId?.toLowerCase() !== stationId.toLowerCase()) {
              throw new Error(`Station ID mismatch for this officer`);
            }
          } else {
            // Fallback
            const userSnap = await getDoc(doc(db, 'users', userCredential.user.uid));
            if (userSnap.exists()) data = userSnap.data();
          }
        }
        userDataResult = data;
      }

      if (!userDataResult) {
        return { success: false, error: 'Invalid credentials or regional assignment mismatch.' };
      }

      // If we bypassed auth (seeded account), we set user state manually
      if (bypassAuth) {
        setUser({
          uid: `seeded-${userDataResult.badgeNumber}`,
          email: userDataResult.email,
          displayName: userDataResult.name,
          ...userDataResult
        });
        setUserData(userDataResult);
      }

      const redirectPath = userDataResult.role === 'police' ? '/dashboard' : '/citizen/dashboard';
      return { success: true, redirectPath, role: userDataResult.role, user: userDataResult };
    } catch (error) {
      console.error("Login logic error:", error);
      return { success: false, error: error.message || 'Invalid credentials or connection error' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
    return { success: true };
  };

  const value = {
    user,
    userData,
    loading,
    citizenSignup,
    policeSignup,
    socialSignIn,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
