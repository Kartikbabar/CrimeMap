// Run this script to clear and reseed Firebase data
// Usage: node scripts/reseed-data.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // You'll need to download this from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearAndReseed() {
    try {
        console.log('🗑️  Clearing existing FIR data...');

        // Delete all existing FIRs
        const firsSnapshot = await db.collection('firs').get();
        const deletePromises = [];
        firsSnapshot.forEach(doc => {
            deletePromises.push(doc.ref.delete());
        });
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${deletePromises.length} existing FIRs`);

        console.log('🌱 Seeding new Maharashtra data...');

        const district = 'Mumbai'; // Change this to your district

        const sampleFIRs = [
            // Mumbai Region
            {
                firNumber: "FIR/2024/001",
                category: "Theft",
                description: "Mobile phone theft reported at Dadar Railway Station",
                location: "Dadar Railway Station, Mumbai",
                coordinates: { lat: 19.0176, lng: 72.8432 },
                district: district,
                status: "Under Investigation",
                priority: "High",
                reportedBy: "Ramesh Kumar",
                reportedDate: "2024-01-28",
                assignedOfficer: "Inspector Patil",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            // Add all 25 FIRs here (copy from firebase.js lines 254-586)
            // ... (truncated for brevity - copy the full array from firebase.js)
        ];

        const addPromises = sampleFIRs.map(fir => db.collection('firs').add(fir));
        await Promise.all(addPromises);

        console.log(`✅ Added ${sampleFIRs.length} new FIRs`);
        console.log('🎉 Reseeding complete!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearAndReseed();
