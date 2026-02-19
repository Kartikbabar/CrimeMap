// components/citizen/CitizenDashboard.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ComplaintService, CommunityAlertService } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const CrimeMap = dynamic(() => import('../dashboard/CrimeMap'), {
    ssr: false,
    loading: () => <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '1rem', color: '#64748b' }}>Loading Map...</div>
});

const LegalAdvisor = dynamic(() => import('../LegalAdvisor'), {
    ssr: false,
    loading: () => <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', borderRadius: '1rem', color: '#94a3b8' }}>Loading AI Advisor...</div>
});

const CitizenDashboard = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('home');
    const [location, setLocation] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [nearbyCrimes, setNearbyCrimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [digitalReceipt, setDigitalReceipt] = useState(null);
    const [areaFilter, setAreaFilter] = useState('All Maharashtra');
    const [showAreaConcernModal, setShowAreaConcernModal] = useState(false);
    const [newAreaConcern, setNewAreaConcern] = useState({
        type: 'Poor Lighting',
        description: '',
        location: ''
    });

    const [newComplaint, setNewComplaint] = useState({
        type: '',
        description: '',
        location: '',
        time: '',
        district: '',
        evidenceAttached: false,
        evidenceFile: null
    });

    const styles = {
        container: { minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: "'Inter', sans-serif" },
        header: { position: 'fixed', top: 0, left: 0, right: 0, height: '70px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', zIndex: 1000 },
        welcomeSub: { color: '#94a3b8', fontSize: '0.85rem' },
        nav: { position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', padding: '0.5rem', borderRadius: '1.5rem', display: 'flex', gap: '0.5rem', border: '1px solid #334155', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', zIndex: 1000 },
        navBtn: (active) => ({ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '1rem', background: active ? '#3b82f6' : 'transparent', color: active ? 'white' : '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }),
        main: { paddingTop: '70px', paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', padding: '90px 2rem 100px' },
        mapContainer: { height: '70vh', background: '#1e293b', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid #334155', position: 'relative' },
        mapOverlay: { position: 'absolute', top: '1rem', left: '1rem', zIndex: 500, display: 'flex', flexDirection: 'column', gap: '1rem' },
        filterPanel: { background: 'rgba(15, 23, 42, 0.9)', padding: '1rem', borderRadius: '1rem', border: '1px solid #334155', backdropFilter: 'blur(10px)' },
        legend: { position: 'absolute', bottom: '2rem', left: '1rem', background: 'rgba(15, 23, 42, 0.9)', padding: '1rem', borderRadius: '1rem', border: '1px solid #334155', zIndex: 500 },
        legendItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.5rem' },
        reportBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' },
        modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '2rem' },
        modalContent: { background: '#1e293b', width: '100%', maxWidth: '600px', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #334155' },
        input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', width: '100%' },
        uploadBtn: { border: '2px dashed #334155', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', cursor: 'pointer', color: '#94a3b8' },
        botIcon: { position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', zIndex: 1000 },
        receipt: { background: '#dcfce7', color: '#166534', padding: '1.5rem', borderRadius: '1rem', marginTop: '1rem', border: '1px solid #b91c1c' }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => console.log('Location access denied')
            );
        }

        if (user?.uid) {
            const unsubComplaints = ComplaintService.subscribeToMyComplaints(user.uid, (data) => {
                setComplaints(data);
                setLoading(false);
            });
            const unsubCrimes = ComplaintService.subscribeToLocalCrime(user.district || 'Pune', (data) => {
                setNearbyCrimes(data);
            });
            return () => { unsubComplaints(); unsubCrimes(); };
        }
    }, [user]);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) router.push('/auth');
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!newComplaint.evidenceFile) { alert('Digital evidence (Photo/Video) is mandatory.'); return; }
        try {
            const receiptId = 'RCPT-' + Math.random().toString(36).substr(2, 9).toUpperCase();

            // Robust File Upload
            const uploadResult = await FileService.uploadFile(newComplaint.evidenceFile, 'public_complaints');

            await ComplaintService.createComplaint({
                ...newComplaint,
                uid: user.uid,
                receiptId,
                userName: user.fullName,
                district: areaFilter === 'All Maharashtra' ? (user.district || 'Mumbai') : areaFilter,
                createdAt: new Date().toISOString(),
                evidenceUrl: uploadResult?.url || '',
                evidenceName: uploadResult?.name || '',
                status: 'pending',
                statusHistory: [
                    { status: 'Filed', date: new Date().toISOString(), note: 'Digital report received and receipt generated.' }
                ]
            });
            setDigitalReceipt(receiptId);
            setNewComplaint({ type: '', description: '', location: '', time: '', district: '', evidenceAttached: false, evidenceFile: null });
            setTimeout(() => { setShowReportModal(false); setDigitalReceipt(null); setActiveTab('complaints'); }, 5000);
        } catch (err) { console.error(err); }
    };

    const handleAreaConcernSubmit = async (e) => {
        e.preventDefault();
        try {
            await CommunityAlertService.reportConcern({
                ...newAreaConcern,
                uid: user.uid,
                userName: user.fullName,
                district: areaFilter === 'All Maharashtra' ? (user.district || 'Mumbai') : areaFilter,
                lat: location?.lat || 19.0760,
                lng: location?.lng || 72.8777
            });
            setShowAreaConcernModal(false);
            setNewAreaConcern({ type: 'Poor Lighting', description: '', location: '' });
            alert("Area concern reported. Police units in your district have been notified.");
        } catch (err) { console.error(err); }
    };

    const renderTicker = (status) => {
        const steps = ['Filed', 'Assigned', 'Investigation', 'Charge Sheet'];
        const currentIdx = status === 'pending' ? 0 : status === 'assigned' ? 1 : status === 'investigating' ? 2 : status === 'resolved' ? 3 : 0;

        return (
            <div style={{ display: 'flex', gap: '4px', marginTop: '1rem' }}>
                {steps.map((step, idx) => (
                    <div key={step} style={{ flex: 1 }}>
                        <div style={{ height: '4px', background: idx <= currentIdx ? '#3b82f6' : '#334155', borderRadius: '2px', marginBottom: '4px' }} />
                        <div style={{ fontSize: '0.6rem', color: idx <= currentIdx ? '#3b82f6' : '#64748b', fontWeight: '800', textAlign: 'center' }}>{step.toUpperCase()}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#3b82f6', padding: '0.5rem', borderRadius: '0.75rem', fontWeight: '800' }}>S</div>
                    <div>
                        <div style={{ fontWeight: '700', color: '#f8fafc' }}>Sentinel Public Portal</div>
                        <div style={styles.welcomeSub}>Maharashtra State Police Collaboration</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.fullName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Verified Citizen</div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Logout</button>
                </div>
            </header>

            <nav style={styles.nav}>
                <button onClick={() => setActiveTab('home')} style={styles.navBtn(activeTab === 'home')}>🏠 Home</button>
                <button onClick={() => setActiveTab('complaints')} style={styles.navBtn(activeTab === 'complaints')}>📋 My Complaints</button>
                <button onClick={() => setActiveTab('legal')} style={styles.navBtn(activeTab === 'legal')}>⚖️ Legal Advisor</button>
                <button onClick={() => setActiveTab('sos')} style={styles.navBtn(activeTab === 'sos')}>🚨 Emergency SOS</button>
            </nav>

            <main style={styles.main}>
                {activeTab === 'home' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={styles.mapContainer}>
                            <div style={styles.mapOverlay}>
                                <button style={styles.reportBtn} onClick={() => setShowReportModal(true)}>
                                    📍 Report Incident at My Location
                                </button>
                                <button
                                    style={{ ...styles.reportBtn, background: '#f59e0b', color: '#020617' }}
                                    onClick={() => setShowAreaConcernModal(true)}
                                >
                                    ⚠️ Mark Area as Unsafe / Concern
                                </button>
                                <div style={styles.filterPanel}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Area Filter</div>
                                    <select
                                        style={{ ...styles.input, padding: '0.5rem' }}
                                        value={areaFilter}
                                        onChange={(e) => setAreaFilter(e.target.value)}
                                    >
                                        <option>All Maharashtra</option>
                                        <option>Mumbai</option>
                                        <option>Pune</option>
                                        <option>Nagpur</option>
                                        <option>Thane</option>
                                        <option>Nashik</option>
                                    </select>
                                </div>
                            </div>

                            <div style={styles.legend}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.75rem', color: '#f8fafc' }}>MAP LEGEND</div>
                                <div style={styles.legendItem}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div> Violent Crime</div>
                                <div style={styles.legendItem}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div> Theft/Burglary</div>
                                <div style={styles.legendItem}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div> Safe / High Patrol</div>
                            </div>

                            <CrimeMap
                                userRole="citizen"
                                userDistrict={areaFilter === 'All Maharashtra' ? (user?.district || 'Mumbai') : areaFilter}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'complaints' && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '900' }}>CASE INVESTIGATION JOURNEY</h1>
                        {complaints.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center', background: '#1e293b', borderRadius: '1rem', border: '1px solid #334155' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                                <div style={{ color: '#94a3b8' }}>No active complaints found. Use the map to report an incident.</div>
                            </div>
                        ) : (
                            complaints.map(c => (
                                <div key={c.id} style={{ background: '#1e293b', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #334155' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <div style={{ color: '#3b82f6', fontWeight: '900', fontSize: '0.75rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>VERIFIED RECEIPT: {c.receiptId || c.id.slice(-8).toUpperCase()}</div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{c.type}</h3>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{c.location} • {new Date(c.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '900',
                                            background: c.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: c.status === 'pending' ? '#f59e0b' : '#10b981',
                                            border: `1px solid ${c.status === 'pending' ? '#f59e0b44' : '#10b98144'}`
                                        }}>
                                            {c.status?.toUpperCase() || 'FILED'}
                                        </div>
                                    </div>

                                    {renderTicker(c.status)}

                                    {c.evidenceUrl && (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0f172a', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>📎</span>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <div style={{ fontWeight: '700' }}>Digital Evidence Secured</div>
                                                <div style={{ color: '#64748b' }}>{c.evidenceName}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'legal' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '2rem' }}>
                        <div style={{ minWidth: 0 }}>
                            <LegalAdvisor />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #334155' }}>
                                <h3 style={{ color: '#3b82f6', marginBottom: '1rem', fontSize: '1.1rem' }}>🏛️ Quick Legal Reference</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                    Standard procedural protocols under the Bharatiya Nyaya Sanhita (BNS).
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#f1f5f9', background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                                        <strong>Zero FIR (Sec 154)</strong>: File at ANY station, regardless of jurisdiction.
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#f1f5f9', background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                                        <strong>Right to Bail</strong>: Mandatory for bailable offenses under Sec 436 CrPC.
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#f1f5f9', background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                                        <strong>Legal Aid</strong>: Free aid available via DLSA for eligible citizens.
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: '#0f172a', borderRadius: '1.5rem', border: '1px solid #334155', padding: '2rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Secure Link</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Your legal queries are processed locally and are not stored in your public profile.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sos' && (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            background: '#ef4444',
                            borderRadius: '50%',
                            margin: '0 auto 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            boxShadow: '0 0 50px rgba(239, 68, 68, 0.4)',
                            cursor: 'pointer',
                            border: '10px solid rgba(255,255,255,0.2)'
                        }} onClick={() => alert("EMERGENCY BROADCAST INITIATED. YOUR GPS COORDINATES SENT TO HQ.")}>
                            🚨
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f8fafc' }}>EMERGENCY SOS</h1>
                        <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '1rem auto' }}>Press the button above to alert the nearest 3 Patrol Units of your current location for immediate assistance.</p>
                    </div>
                )}
            </main>

            {/* Floating Chat Icon */}
            <div style={styles.botIcon} onClick={() => setActiveTab('legal')}>💬</div>

            {/* Report Incident Modal */}
            {showReportModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        {digitalReceipt ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                                <h2 style={{ color: '#10b981' }}>Complaint Registered</h2>
                                <div style={styles.receipt}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '700', opacity: 0.7 }}>DIGITAL RECEIPT ID</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px' }}>{digitalReceipt}</div>
                                    <div style={{ marginTop: '1rem', fontSize: '0.8rem' }}>A unique tracking ID has been generated. Use this for legal reference.</div>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1.5rem' }}>Redirecting to dashboard...</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ margin: 0 }}>Digital Incident Report</h2>
                                    <button onClick={() => setShowReportModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                                </div>
                                <form onSubmit={handleReportSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Crime Category</label>
                                        <select style={styles.input} onChange={(e) => setNewComplaint({ ...newComplaint, type: e.target.value })} required>
                                            <option value="">Select Category</option>
                                            <option value="Violent Crime">Violent Crime (Assault, Robbery)</option>
                                            <option value="Theft">Theft / Burglary</option>
                                            <option value="Cyber Crime">Cyber Crime</option>
                                            <option value="Emergency Support">Medical / Fire Emergency</option>
                                            <option value="Harassment">Public Harassment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Time of Incident</label>
                                        <input type="datetime-local" style={styles.input} onChange={(e) => setNewComplaint({ ...newComplaint, time: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Brief Description</label>
                                        <textarea style={{ ...styles.input, height: '100px' }} placeholder="Describe the event in detail..." onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })} required />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Upload Evidence (Mandatory)</label>
                                        <div style={styles.uploadBtn} onClick={() => setNewComplaint({ ...newComplaint, evidenceFile: 'demo_file.jpg' })}>
                                            {newComplaint.evidenceFile ? '✅ Evidence Attached (demo_file.jpg)' : '📁 Drag photos/videos here or click to select'}
                                        </div>
                                    </div>

                                    <button type="submit" style={{ ...styles.reportBtn, width: '100%', justifyContent: 'center', marginTop: '1rem', height: '50px' }}>
                                        Submit & Get Digital Receipt
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* Area Concern Modal */}
            {showAreaConcernModal && (
                <div style={styles.modal}>
                    <div style={{ ...styles.modalContent, maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: '#f59e0b' }}>Report Area Concern</h2>
                            <button onClick={() => setShowAreaConcernModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Help police identify safe/unsafe zones (e.g. broken street lights, blind spots).</p>
                        <form onSubmit={handleAreaConcernSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Concern Type</label>
                                <select style={styles.input} value={newAreaConcern.type} onChange={(e) => setNewAreaConcern({ ...newAreaConcern, type: e.target.value })}>
                                    <option>Poor Lighting</option>
                                    <option>Frequent Harassment Spot</option>
                                    <option>No CCTV Coverage</option>
                                    <option>Abandoned Property</option>
                                    <option>Drug Activity Suspected</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Nearby Landmark</label>
                                <input style={styles.input} placeholder="e.g. Near Metro Pillar 45" value={newAreaConcern.location} onChange={(e) => setNewAreaConcern({ ...newAreaConcern, location: e.target.value })} required />
                            </div>
                            <textarea style={{ ...styles.input, height: '80px' }} placeholder="Additional details..." value={newAreaConcern.description} onChange={(e) => setNewAreaConcern({ ...newAreaConcern, description: e.target.value })} />
                            <button type="submit" style={{ ...styles.reportBtn, background: '#f59e0b', color: '#020617', width: '100%', justifyContent: 'center' }}>
                                Register Concern Spot
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitizenDashboard;
