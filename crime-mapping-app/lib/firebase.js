// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export { signInWithPopup };

// FIR Service
export const FIRService = {
  // Create new FIR
  async createFIR(firData) {
    try {
      const docRef = await addDoc(collection(db, "firs"), {
        ...firData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...firData };
    } catch (error) {
      console.error("Error creating FIR:", error);
      throw error;
    }
  },

  // Get all FIRs
  async getAllFIRs() {
    try {
      const querySnapshot = await getDocs(collection(db, "firs"));
      const firs = [];
      querySnapshot.forEach((doc) => {
        firs.push({ id: doc.id, ...doc.data() });
      });
      return firs;
    } catch (error) {
      console.error("Error getting FIRs:", error);
      throw error;
    }
  },

  // Update FIR
  async updateFIR(firId, firData) {
    try {
      const firRef = doc(db, "firs", firId);
      await updateDoc(firRef, {
        ...firData,
        updatedAt: new Date().toISOString()
      });
      return { id: firId, ...firData };
    } catch (error) {
      console.error("Error updating FIR:", error);
      throw error;
    }
  },

  // Delete FIR
  async deleteFIR(firId) {
    try {
      await deleteDoc(doc(db, "firs", firId));
      return true;
    } catch (error) {
      console.error("Error deleting FIR:", error);
      throw error;
    }
  },

  // Real-time listener for FIRs
  subscribeToFIRs(callback) {
    const q = query(collection(db, "firs"), orderBy("createdAt", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const firs = [];
      querySnapshot.forEach((doc) => {
        firs.push({ id: doc.id, ...doc.data() });
      });
      callback(firs);
    });
  },

  // Subscribe to district FIRs with Transparency Ticker data
  subscribeToDistrictFIRs(district, callback) {
    const q = query(
      collection(db, "firs"),
      where("district", "==", district)
    );

    return onSnapshot(q, (querySnapshot) => {
      const firs = [];
      querySnapshot.forEach((doc) => {
        firs.push({ id: doc.id, ...doc.data() });
      });
      const sorted = firs.sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      callback(sorted);
    }, (error) => {
      console.error("Firestore FIR Subscription Error:", error);
    });
  },

  // MO Matcher: Find cases with similar patterns
  async findSimilarMO(moTags) {
    if (!moTags || moTags.length === 0) return [];
    try {
      const q = query(
        collection(db, "firs"),
        where("moTags", "array-contains-any", moTags)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("MO Search Error:", error);
      return [];
    }
  }
};

// Auth Service
export const AuthService = {
  auth: auth,
  register: async (email, password, userData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },
  logout: async () => {
    await signOut(auth);
  }
};

// Patrol Service
export const PatrolService = {
  async createPatrol(patrolData) {
    try {
      const docRef = await addDoc(collection(db, "patrols"), {
        ...patrolData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...patrolData };
    } catch (error) {
      console.error("Error creating patrol:", error);
      throw error;
    }
  },

  async updatePatrol(patrolId, patrolData) {
    try {
      const patrolRef = doc(db, "patrols", patrolId);
      await updateDoc(patrolRef, {
        ...patrolData,
        updatedAt: new Date().toISOString()
      });
      return { id: patrolId, ...patrolData };
    } catch (error) {
      console.error("Error updating patrol:", error);
      throw error;
    }
  },

  async deletePatrol(patrolId) {
    try {
      await deleteDoc(doc(db, "patrols", patrolId));
      return true;
    } catch (error) {
      console.error("Error deleting patrol:", error);
      throw error;
    }
  },

  subscribeToDistrictPatrols(district, callback) {
    const q = query(
      collection(db, "patrols"),
      where("district", "==", district)
    );

    return onSnapshot(q, (querySnapshot) => {
      const patrols = [];
      querySnapshot.forEach((doc) => {
        patrols.push({ id: doc.id, ...doc.data() });
      });
      const sorted = patrols.sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      callback(sorted);
    }, (error) => {
      console.error("Patrol Subscription Error:", error);
    });
  }
};

// Personnel Service
export const PersonnelService = {
  async addPersonnel(personnelData) {
    try {
      const docRef = await addDoc(collection(db, "personnel"), {
        ...personnelData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...personnelData };
    } catch (error) {
      console.error("Error adding personnel:", error);
      throw error;
    }
  },

  async updatePersonnel(personnelId, personnelData) {
    try {
      const personnelRef = doc(db, "personnel", personnelId);
      await updateDoc(personnelRef, {
        ...personnelData,
        updatedAt: new Date().toISOString()
      });
      return { id: personnelId, ...personnelData };
    } catch (error) {
      console.error("Error updating personnel:", error);
      throw error;
    }
  },

  async deletePersonnel(personnelId) {
    try {
      await deleteDoc(doc(db, "personnel", personnelId));
      return true;
    } catch (error) {
      console.error("Error deleting personnel:", error);
      throw error;
    }
  },

  // Update Personnel with shift/welfare data
  async updatePersonnelWelfare(personnelId, welfareData) {
    const personnelRef = doc(db, "personnel", personnelId);
    await updateDoc(personnelRef, {
      ...welfareData,
      updatedAt: new Date().toISOString()
    });
  },

  subscribeToDistrictPersonnel(district, callback) {
    const q = query(
      collection(db, "personnel"),
      where("district", "==", district)
    );

    return onSnapshot(q, (querySnapshot) => {
      const personnel = [];
      querySnapshot.forEach((doc) => {
        personnel.push({ id: doc.id, ...doc.data() });
      });
      callback(personnel.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)));
    });
  }
};

// Collaboration Service (Inter-Station Cases)
export const CollaborationService = {
  subscribeToSharedCases(district, callback) {
    // A shared case is one where the district is in the 'sharedWith' array 
    // OR it's the primary district of the case.
    const q = query(
      collection(db, "firs"),
      where("isShared", "==", true)
    );

    return onSnapshot(q, (querySnapshot) => {
      const cases = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.sharedWith?.includes(district) || data.district === district) {
          cases.push({ id: doc.id, ...data });
        }
      });
      // Sort client-side
      const sorted = cases.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.createdAt || 0));
      callback(sorted);
    });
  },

  async addCollaborator(caseId, stationName) {
    const caseRef = doc(db, "firs", caseId);
    try {
      const snap = await getDoc(caseRef);
      const data = snap.data();
      const currentShared = data.sharedWith || [];
      if (!currentShared.includes(stationName)) {
        await updateDoc(caseRef, {
          sharedWith: [...currentShared, stationName],
          isShared: true,
          nexusStatus: data.nexusStatus || 'Active Investigation',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) { console.error("Update error", e); }
  },

  async updateNexusStatus(caseId, status) {
    const caseRef = doc(db, "firs", caseId);
    await updateDoc(caseRef, {
      nexusStatus: status,
      updatedAt: new Date().toISOString()
    });
  },

  async broadcastCase(caseId, severity = 'High') {
    const caseRef = doc(db, "firs", caseId);
    await updateDoc(caseRef, {
      isShared: true,
      broadcastSeverity: severity,
      broadcastAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  },

  async requestAsset(caseId, assetType, requesterStation) {
    const caseRef = doc(db, "firs", caseId);
    const snap = await getDoc(caseRef);
    const assets = snap.data().requestedAssets || [];
    await updateDoc(caseRef, {
      requestedAssets: [...assets, { type: assetType, station: requesterStation, status: 'pending', timestamp: new Date().toISOString() }],
      updatedAt: new Date().toISOString()
    });
  },

  async uploadEvidence(caseId, evidenceData) {
    const caseRef = doc(db, "firs", caseId);
    const snap = await getDoc(caseRef);
    const vault = snap.data().evidenceVault || [];
    await updateDoc(caseRef, {
      evidenceVault: [...vault, { ...evidenceData, timestamp: new Date().toISOString() }],
      updatedAt: new Date().toISOString()
    });
  },

  async sendNexusMessage(caseId, messageData) {
    const caseRef = doc(db, "firs", caseId);
    const snap = await getDoc(caseRef);
    const chat = snap.data().nexusChat || [];
    await updateDoc(caseRef, {
      nexusChat: [...chat, { ...messageData, timestamp: new Date().toISOString() }],
      updatedAt: new Date().toISOString()
    });
  },

  async addCaseUpdate(caseId, updateData) {
    const caseRef = doc(db, "firs", caseId);
    const snap = await getDoc(caseRef);
    const updates = snap.data().updates || [];
    const newUpdate = {
      ...updateData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    await updateDoc(caseRef, {
      updates: [...updates, newUpdate],
      updatedAt: new Date().toISOString()
    });
    // Also log to timeline if it's a major event
    if (updateData.isMajor) {
      const timeline = snap.data().caseTimeline || [];
      await updateDoc(caseRef, {
        caseTimeline: [...timeline, { ...newUpdate, type: updateData.type || 'Event' }]
      });
    }
  },

  async requestSpecialist(caseId, specialistType, stationId) {
    const caseRef = doc(db, "firs", caseId);
    const snap = await getDoc(caseRef);
    const requests = snap.data().specialistRequests || [];
    await updateDoc(caseRef, {
      specialistRequests: [...requests, { type: specialistType, stationId, status: 'Requested', timestamp: new Date().toISOString() }],
      updatedAt: new Date().toISOString()
    });
  },

  subscribeToCaseUpdates(caseId, callback) {
    return onSnapshot(doc(db, "firs", caseId), (doc) => {
      callback({ id: doc.id, ...doc.data() });
    });
  }
};

// BOLO (Be On the Look Out) Service
export const BOLOService = {
  async createBOLO(boloData) {
    await addDoc(collection(db, "bolos"), {
      ...boloData,
      status: 'Active',
      createdAt: new Date().toISOString()
    });
  },

  async interceptBOLO(boloId, stationId, officerName) {
    const boloRef = doc(db, "bolos", boloId);
    await updateDoc(boloRef, {
      status: 'Intercepted',
      interceptedBy: stationId,
      officer: officerName,
      interceptedAt: new Date().toISOString()
    });
  },

  subscribeToActiveBOLOs(callback) {
    const q = query(collection(db, "bolos"), where("status", "==", "Active"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }
};

// Connectivity & Readiness Service
export const ConnectivityService = {
  subscribeToNeighboringStations(district, callback) {
    // For demo, we get all stations in neighboring districts
    const q = query(collection(db, "police"), limit(10));
    return onSnapshot(q, (snap) => {
      const stations = {};
      snap.docs.forEach(d => {
        const data = d.data();
        if (!stations[data.policeStation]) {
          stations[data.policeStation] = {
            name: data.policeStation,
            district: data.district,
            forceStrength: 70 + Math.floor(Math.random() * 25),
            fleetReadiness: 60 + Math.floor(Math.random() * 35),
            status: Math.random() > 0.2 ? 'Active' : 'Standby'
          };
        }
      });
      callback(Object.values(stations));
    });
  },

  async requestMutualAid(targetStation, caseId, requesterStation) {
    await addDoc(collection(db, "mutual_aid_requests"), {
      targetStation,
      caseId,
      requesterStation,
      status: 'Pending',
      timestamp: new Date().toISOString()
    });
  }
};

// Data Seeding Service
const MAHARASHTRA_DISTRICTS = {
  "Mumbai": { ps: ["Colaba", "Bandra", "Juhu", "Dadar"], lat: 18.9147, lng: 72.8270 },
  "Pune": { ps: ["Shivajinagar", "Hinjewadi", "Kothrud", "Hadapsar"], lat: 18.5204, lng: 73.8567 },
  "Thane": { ps: ["Naupada", "Wagle Estate", "Kalyan", "Majiwada"], lat: 19.2183, lng: 72.9781 },
  "Nagpur": { ps: ["Sadar", "Sitabuldi", "Dhantoli", "Nandanvan"], lat: 21.1458, lng: 79.0882 },
  "Nashik": { ps: ["Panchavati", "Sarkarwada", "Ambad", "Indira Nagar"], lat: 19.9975, lng: 73.7898 },
  "Aurangabad": { ps: ["Kranti Chowk", "Waluj", "City Chowk", "Cidco"], lat: 19.8762, lng: 75.3433 },
  "Solapur": { ps: ["Sadabazar", "Vijapur Naka", "Fauzdar Chawadi"], lat: 17.6599, lng: 75.9064 },
  "Amravati": { ps: ["City Kotwali", "Gadge Nagar", "Frezerpura"], lat: 20.9320, lng: 77.7523 },
  "Kolhapur": { ps: ["Shahupuri", "Rajaram Puri", "Juna Rajwada"], lat: 16.7050, lng: 74.2433 },
  "Akola": { ps: ["City Kotwali", "Civil Lines", "Ramtek Pura"], lat: 20.7002, lng: 77.0082 },
  "Jalgaon": { ps: ["City PS", "Shani Peth", "Ramanand Nagar"], lat: 21.0077, lng: 75.5626 },
  "Ahmednagar": { ps: ["Kotwali", "Tofkhana", "Camp PS"], lat: 19.0948, lng: 74.7480 },
  "Latur": { ps: ["Gandhi Chowk", "Shivaji Nagar", "MIDC Latur"], lat: 18.4088, lng: 76.5604 },
  "Dhule": { ps: ["City PS", "Azad Nagar", "Deopur PS"], lat: 20.9042, lng: 74.7749 },
  "Nanded": { ps: ["Itwara", "Vazirabad", "Bhagya Nagar"], lat: 19.1383, lng: 77.3210 },
  "Satara": { ps: ["Satara City", "Satara Taluka", "Koregaon"], lat: 17.6805, lng: 73.9918 },
  "Chandrapur": { ps: ["City PS", "Ramnagar", "Urjanagar"], lat: 19.9510, lng: 79.2961 },
  "Ratnagiri": { ps: ["Ratnagiri City", "Sangameshwar", "Lanja"], lat: 16.9902, lng: 73.3120 },
  "Palghar": { ps: ["Palghar City", "Vasai", "Virar", "Dahanu"], lat: 19.6936, lng: 72.7655 },
  "Raigad": { ps: ["Alibag", "Panvel", "Karjat"], lat: 18.6414, lng: 72.8722 },
  "Buldhana": { ps: ["Buldhana City", "Shegaon", "Khamgaon"], lat: 20.5310, lng: 76.1850 },
  "Beed": { ps: ["Beed City", "Parli", "Majalgaon"], lat: 18.9891, lng: 75.7601 },
  "Gadchiroli": { ps: ["Gadchiroli City", "Aheri", "Armori"], lat: 20.1848, lng: 79.9948 },
  "Gondia": { ps: ["Gondia City", "Arjuni Morgaon", "Tiroda"], lat: 21.4624, lng: 80.2209 },
  "Jalna": { ps: ["Jalna City", "Kadirabad", "Ambad"], lat: 19.8297, lng: 75.8800 },
  "Osmanabad": { ps: ["Osmanabad City", "Tuljapur", "Umarga"], lat: 18.1861, lng: 76.0419 },
  "Parbhani": { ps: ["Parbhani City", "Gangakhed", "Selu"], lat: 19.2644, lng: 76.7765 },
  "Sangli": { ps: ["Sangli City", "Miraj City", "Vishrambag"], lat: 16.8524, lng: 74.5815 },
  "Sindhudurg": { ps: ["Kudal", "Kankavli", "Sawantwadi"], lat: 16.0350, lng: 73.6840 },
  "Washim": { ps: ["Washim City", "Risod", "Karanja"], lat: 20.1011, lng: 77.1332 },
  "Yavatmal": { ps: ["Yavatmal City", "Pusad", "Wani"], lat: 20.3892, lng: 78.1307 },
  "Wardha": { ps: ["Wardha City", "Hinganghat", "Arvi"], lat: 20.7370, lng: 78.6120 },
  "Bhandara": { ps: ["Bhandara City", "Tumsar", "Sakoli"], lat: 21.1710, lng: 79.6460 },
  "Nandurbar": { ps: ["Nandurbar City", "Shahada", "Navapur"], lat: 21.3740, lng: 74.2390 },
  "Hingoli": { ps: ["Hingoli City", "Basmath", "Kalamnuri"], lat: 19.7140, lng: 77.1000 }
};

export const DataSeedingService = {
  // IMPROVED: Check for specific seeded email instead of just empty collection
  async ensureBaselineOfficers() {
    try {
      const testEmail = "officer1.mumbai@police.gov.in";
      const polQ = query(collection(db, "police"), where("email", "==", testEmail));
      const polSnap = await getDocs(polQ);

      if (polSnap.empty) {
        console.log("Seeding baseline officers for initial login...");
        const priorityDistricts = ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik"];
        for (const dist of priorityDistricts) {
          const profile = MAHARASHTRA_DISTRICTS[dist];
          if (!profile) continue;
          const ps = profile.ps[0];
          const officerData = {
            name: `Officer 1 (${ps} PS)`,
            fullName: `Officer 1 of ${ps} PS`,
            rank: "Senior Inspector",
            badgeNumber: `MS-BADGE-${dist.substr(0, 3).toUpperCase()}-101`,
            status: "Available",
            district: dist,
            policeStation: ps,
            stationId: `${dist.substr(0, 2).toUpperCase()}-${ps.substr(0, 3).toUpperCase()}-ID`,
            email: `officer1.${dist.toLowerCase().replace(/\s+/g, '')}@police.gov.in`,
            password: "Police@123",
            role: 'police',
            isSeeded: true, // Marker for seeded data
            specialization: ["Law Enforcement"],
            performance: { rating: 5.0, efficiency: 100 },
            createdAt: new Date().toISOString()
          };
          await addDoc(collection(db, "police"), officerData);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error("Baseline seeding failed", e);
      return false;
    }
  },

  async seedInitialData(district) {
    try {
      const profile = MAHARASHTRA_DISTRICTS[district] || MAHARASHTRA_DISTRICTS["Mumbai"];

      // 1. SEED FIRs
      const firQ = query(collection(db, "firs"), where("district", "==", district), where("isSeeded", "==", true));
      const firSnap = await getDocs(firQ);
      if (firSnap.empty) {
        const types = ["Armed Robbery", "Cyber Heist", "Assault", "Theft", "Traffic Violation"];
        const severities = ["High", "Medium", "Low", "Critical"];

        for (let i = 1; i <= 5; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          const ps = profile.ps[Math.floor(Math.random() * profile.ps.length)];
          await addDoc(collection(db, "firs"), {
            firNumber: `FIR/${new Date().getFullYear()}/${district.substr(0, 3).toUpperCase()}-${100 + i}`,
            type,
            location: `${ps} Sector ${i}`,
            district: district,
            policeStation: `${ps} PS`,
            status: i === 1 ? 'Under Investigation' : 'Pending',
            priority: severities[Math.floor(Math.random() * severities.length)],
            description: `Automated investigation log for ${type} reported at ${ps}. High priority regional surveillance active.`,
            coordinates: { lat: profile.lat + (Math.random() - 0.5) * 0.05, lng: profile.lng + (Math.random() - 0.5) * 0.05 },
            registrationDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isSeeded: true,
            updates: [
              { id: 1, officer: "System Auto-Check", time: "09:00 AM", description: "First responders arrived at scene.", date: new Date().toISOString() }
            ]
          });
        }
      }

      // 2. SEED PATROLS
      const patrolQ = query(collection(db, "patrols"), where("district", "==", district), where("isSeeded", "==", true));
      const patrolSnap = await getDocs(patrolQ);
      if (patrolSnap.empty) {
        const ps = profile.ps[0];
        await addDoc(collection(db, "patrols"), {
          name: `${district} ${ps} Night Watch`,
          area: `${ps} Jurisdiction`,
          district: district,
          distance: "22.5 km",
          vehicle: `MH-${Math.floor(Math.random() * 50)}-P-${Math.floor(1000 + Math.random() * 9000).toString()}`,
          status: "Active",
          priority: "High",
          isSeeded: true,
          officers: [
            { name: "Unit " + ps + "-A", badge: "POL-" + Math.floor(100 + Math.random() * 900), status: "on-duty", lastCheckin: "11:45 PM" }
          ],
          checkpoints: [
            { id: 1, name: ps + " Main Gate", scheduled: "10:00 PM", actual: "10:05 PM", status: "Completed" },
            { id: 2, name: ps + " Industrial Belt", scheduled: "11:30 PM", status: "In Progress" }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // 3. SEED PERSONNEL && OFFICERS (7 Per District)
      const personnelQ = query(collection(db, "personnel"), where("district", "==", district), where("isSeeded", "==", true));
      const personnelSnap = await getDocs(personnelQ);
      if (personnelSnap.empty) {
        const ranks = ["Deputy Commissioner", "Assistant Commissioner", "Senior Inspector", "Inspector", "Sub-Inspector", "Assistant Sub-Inspector", "Head Constable"];

        for (let i = 1; i <= 7; i++) {
          const rank = ranks[i - 1] || "Constable";
          const ps = profile.ps[(i - 1) % profile.ps.length];
          const officerId = `${district.substr(0, 3).toUpperCase()}-${ps.substr(0, 3).toUpperCase()}-${100 + i}`;

          const officerData = {
            name: `Officer ${i} (${ps} PS)`,
            fullName: `Officer ${i} of ${ps} PS`,
            rank: rank,
            badgeNumber: `MS-BADGE-${officerId}`,
            status: i % 2 === 0 ? "On Patrol" : "Available",
            district: district,
            policeStation: ps,
            stationId: `${district.substr(0, 2).toUpperCase()}-${ps.substr(0, 3).toUpperCase()}-ID`,
            email: `officer${i}.${district.toLowerCase().replace(/\s+/g, '')}@police.gov.in`,
            password: "Police@123",
            role: 'police',
            isSeeded: true,
            specialization: ["Law Enforcement", "District Security"],
            performance: { rating: 4.5, efficiency: 90 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          await addDoc(collection(db, "personnel"), officerData);

          const polQ = query(collection(db, "police"), where("email", "==", officerData.email));
          const polSnap = await getDocs(polQ);
          if (polSnap.empty) {
            await addDoc(collection(db, "police"), officerData);
          }
        }
      }

      // Ensure global nexus data is always available
      await this.seedNexusData(district);

      return true;
    } catch (error) {
      console.error("Critical Seeding Error:", error);
      throw error;
    }
  },

  async seedNexusData(userDistrict) {
    const nexusCases = [
      {
        firNumber: "FIR-NEX-CYBER-88",
        type: "State-Wide Crypto Heist",
        location: "Digital Infrastructure",
        district: "Mumbai",
        status: "Active",
        priority: "Critical",
        isShared: true,
        nexusStatus: "Technical Surveillance",
        sharedWith: ["Thane", "Pune", "Navi Mumbai", userDistrict],
        description: "Sophisticated crypto-drainer targeting high-net-worth individuals across the state.",
        updates: [
          { officer: "Cyber Cell Lead", time: "10:00 AM", description: "IP traces leading to a shell server." },
          { officer: "Mumbai IT Squad", time: "12:30 PM", description: "Funds temporarily frozen." }
        ],
        evidenceVault: [
          { label: "IP-LOG-01", type: "Document", uploadedBy: "Inspector Sawant", district: "Thane" }
        ],
        nexusChat: [
          { sender: "ACP Kulkarni", rank: "ACP", text: "All stations, confirm link status.", stationId: "HQ", timestamp: new Date().toISOString() }
        ]
      },
      {
        firNumber: "FIR-NEX-ARMS-12",
        type: "Illegal Arms Trafficking",
        location: "Industrial Corridor",
        district: "Thane",
        status: "Pursuit",
        priority: "Critical",
        isShared: true,
        nexusStatus: "Interception Phase",
        sharedWith: ["Mumbai", "Nashik", userDistrict],
        description: "Heavy weaponry shipment reported moving via industrial transport.",
        updates: [{ officer: "SOG Lead", time: "02:15 PM", description: "Target vehicle spotted." }],
        nexusChat: [{ sender: "SI Shinde", rank: "SI", text: "Moving to intercept.", stationId: "North Sector", timestamp: new Date().toISOString() }]
      }
    ];

    for (const c of nexusCases) {
      const q = query(collection(db, "firs"), where("firNumber", "==", c.firNumber));
      const snap = await getDocs(q);
      if (snap.empty) {
        await addDoc(collection(db, "firs"), {
          ...c,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        const docRef = snap.docs[0].ref;
        const data = snap.docs[0].data();
        if (!data.sharedWith?.includes(userDistrict)) {
          await updateDoc(docRef, {
            sharedWith: [...(data.sharedWith || []), userDistrict]
          });
        }
      }
    }
    await this.seedBOLOData();
    return true;
  },

  async seedBOLOData() {
    const bolos = [
      { type: 'Stolen Vehicle', details: 'MH-12-BK-5555 White Swift. Last seen NH-4.', district: 'Pune' },
      { type: 'Missing Person', details: 'Rohan Mehta, 14, last seen near Gateway.', district: 'Mumbai' },
      { type: 'Wanted Suspect', details: 'High-Value Target "Kali", armed and dangerous.', district: 'Thane' }
    ];
    const q = query(collection(db, "bolos"));
    const snap = await getDocs(q);
    if (snap.empty) {
      for (const b of bolos) {
        await addDoc(collection(db, "bolos"), { ...b, status: 'Active', createdAt: new Date().toISOString() });
      }
    }
  },

  async purgeDistrictData(district) {
    const collections = ["firs", "patrols", "personnel", "police"];
    for (const col of collections) {
      const q = query(collection(db, col), where("district", "==", district));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    }
    return true;
  }
};

// Complaint Service
export const ComplaintService = {
  async createComplaint(complaintData) {
    try {
      const docRef = await addDoc(collection(db, "complaints"), {
        ...complaintData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...complaintData };
    } catch (error) {
      console.error("Error creating complaint:", error);
      throw error;
    }
  },

  subscribeToMyComplaints(uid, callback) {
    const q = query(
      collection(db, "complaints"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const complaints = [];
      querySnapshot.forEach((doc) => {
        complaints.push({ id: doc.id, ...doc.data() });
      });
      callback(complaints);
    });
  },

  subscribeToLocalCrime(district, callback) {
    const q = query(
      collection(db, "firs"),
      where("district", "==", district),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const crimes = [];
      querySnapshot.forEach((doc) => {
        crimes.push({ id: doc.id, ...doc.data() });
      });
      callback(crimes);
    });
  }
};

// Hub Service
export const HubService = {
  async addIntelligence(intelData) {
    try {
      const docRef = await addDoc(collection(db, "intelligence"), {
        ...intelData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...intelData };
    } catch (error) {
      console.error("Error adding intel:", error);
      throw error;
    }
  },

  subscribeToAlerts(callback) {
    const q = query(
      collection(db, "firs"),
      where("severity", "==", "High")
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      callback(sorted);
    }, (error) => {
      console.error("Alerts Subscription Error:", error);
    });
  },

  subscribeToIntelligence(callback) {
    const q = query(collection(db, "intelligence"));
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      callback(sorted);
    }, (error) => {
      console.error("Intelligence Subscription Error:", error);
    });
  },

  // Method to seed initial intelligence if empty
  async seedIntelligence() {
    const q = query(collection(db, "intelligence"));
    const snap = await getDocs(q);
    if (snap.empty) {
      const seeds = [
        { subject: 'Inter-District Theft Ring', from: 'Pune Central', details: 'Suspects moving towards Mumbai via Expressway. Vehicle MH-12-AZ-9999 spotted.', time: '10:30 AM', type: 'Intel' },
        { subject: 'Festival Crowd Support', from: 'Nashik HQ', details: 'Requesting 2 additional platoons for crowd management near Trimbakeshwar.', time: '09:15 AM', type: 'Request' },
        { subject: 'Cyber Fraud Alert', from: 'Cyber Cell', details: 'New phishing campaign targeting senior citizens reported in Dadar area.', time: '08:45 AM', type: 'Alert' }
      ];
      for (const s of seeds) await addDoc(collection(db, "intelligence"), { ...s, createdAt: new Date().toISOString() });
    }
  }
};
// File Upload Service
export const FileService = {
  async uploadFile(file, path) {
    if (!file) return null;
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        url: downloadURL,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
};

// Evidence Chain of Custody Service
export const EvidenceLogService = {
  async logAccess(evidenceId, firId, officerData, action = 'viewed') {
    try {
      await addDoc(collection(db, "evidence_logs"), {
        evidenceId,
        firId,
        officerId: officerData.badgeNumber || officerData.id,
        officerName: officerData.fullName || officerData.name,
        district: officerData.district,
        action,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Logging failed:", error);
    }
  },

  subscribeToLogs(evidenceId, callback) {
    const q = query(
      collection(db, "evidence_logs"),
      where("evidenceId", "==", evidenceId),
      orderBy("timestamp", "desc")
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }
};

// Community Area Alerts Service
export const CommunityAlertService = {
  async reportConcern(concernData) {
    try {
      const docRef = await addDoc(collection(db, "area_reports"), {
        ...concernData,
        status: 'Needs Review',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...concernData };
    } catch (error) {
      console.error("Report failed:", error);
      throw error;
    }
  },

  async updateReportStatus(reportId, status, officerNote) {
    const reportRef = doc(db, "area_reports", reportId);
    await updateDoc(reportRef, {
      status,
      officerNote,
      updatedAt: new Date().toISOString()
    });
  },

  subscribeToDistrictReports(district, callback) {
    const q = query(
      collection(db, "area_reports"),
      where("district", "==", district)
    );
    return onSnapshot(q, (snap) => {
      const reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });
  },

  subscribeToAllReports(callback) {
    return onSnapshot(collection(db, "area_reports"), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }
};
