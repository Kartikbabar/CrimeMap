// Simple client-side script to force reseed data
// Add this as a button in your dashboard temporarily

import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function forceReseedData(district) {
    try {
        console.log('🗑️ Clearing existing data...');

        // Delete all FIRs for this district
        const firsRef = collection(db, 'firs');
        const snapshot = await getDocs(firsRef);

        const deletePromises = [];
        snapshot.forEach(doc => {
            deletePromises.push(deleteDoc(doc.ref));
        });
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${deletePromises.length} FIRs`);

        console.log('🌱 Adding new Maharashtra data...');

        const sampleFIRs = [
            // Mumbai Region
            {
                firNumber: "FIR/2024/001",
                type: "Theft",
                description: "Mobile phone theft reported at Dadar Railway Station",
                location: "Dadar Railway Station, Mumbai",
                coordinates: { lat: 19.0176, lng: 72.8432 },
                district: district,
                status: "Under Investigation",
                priority: "High",
                complainant: { name: "Ramesh Kumar" },
                registrationDate: "2024-01-28",
                assignedOfficer: "Inspector Patil"
            },
            {
                firNumber: "FIR/2024/002",
                type: "Assault",
                description: "Physical assault case near Bandra West",
                location: "Linking Road, Bandra West",
                coordinates: { lat: 19.0596, lng: 72.8295 },
                district: district,
                status: "Resolved",
                priority: "Medium",
                complainant: { name: "Priya Sharma" },
                registrationDate: "2024-01-27",
                assignedOfficer: "Sub-Inspector More"
            },
            {
                firNumber: "FIR/2024/003",
                type: "Burglary",
                description: "House burglary in residential area",
                location: "Andheri East, Mumbai",
                coordinates: { lat: 19.1136, lng: 72.8697 },
                district: district,
                status: "Under Investigation",
                priority: "High",
                complainant: { name: "Amit Deshmukh" },
                registrationDate: "2024-01-29",
                assignedOfficer: "Inspector Ghadge"
            },
            {
                firNumber: "FIR/2024/010",
                type: "Cybercrime",
                description: "Identity theft and online fraud",
                location: "Koregaon Park, Pune",
                coordinates: { lat: 18.5362, lng: 73.8958 },
                district: district,
                status: "Under Investigation",
                priority: "High",
                complainant: { name: "Vikram Singh" },
                registrationDate: "2024-01-27",
                assignedOfficer: "Inspector Kulkarni"
            },
            {
                firNumber: "FIR/2024/013",
                type: "Extortion",
                description: "Business extortion complaint",
                location: "Sitabuldi, Nagpur",
                coordinates: { lat: 21.1458, lng: 79.0882 },
                district: district,
                status: "Under Investigation",
                priority: "High",
                complainant: { name: "Shop Owner" },
                assignedOfficer: "Inspector Deshmukh"
            }
        ];
        const addPromises = sampleFIRs.map(fir =>
            addDoc(collection(db, 'firs'), {
                ...fir,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        );

        await Promise.all(addPromises);
        console.log(`✅ Added ${sampleFIRs.length} new FIRs`);

        alert('Data reseeded successfully! Refresh the page.');
        return true;
    } catch (error) {
        console.error('Error reseeding:', error);
        alert('Error reseeding data: ' + error.message);
        return false;
    }
}
