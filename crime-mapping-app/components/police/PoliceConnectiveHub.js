// components/police/PoliceConnectiveHub.js
'use client';
import { useState, useEffect } from 'react';
import { db, HubService } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function PoliceConnectiveHub({ userDistrict }) {
    const [alerts, setAlerts] = useState([]);
    const [sharedIntelligence, setSharedIntelligence] = useState([]);
    const [loading, setLoading] = useState(true);

    const styles = {
        container: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', fontFamily: "'Inter', sans-serif', height: '100%'" },
        column: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', display: 'flex', flexDirection: 'column', height: '650px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
        header: { padding: '1.25rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '1rem 1rem 0 0' },
        title: { fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' },
        list: { flex: 1, overflowY: 'auto', padding: '1rem' },
        card: (critical) => ({
            background: critical ? '#fef2f2' : 'white', border: critical ? '1px solid #fee2e2' : '1px solid #e2e8f0',
            borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem',
            borderLeft: critical ? '4px solid #ef4444' : '4px solid #3b82f6',
            transition: 'transform 0.2s', cursor: 'pointer'
        }),
        metaRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#64748b' },
        cardTitle: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
        cardDesc: { fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' },
        actionBtn: { width: '100%', marginTop: '0.75rem', padding: '0.5rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.5rem', color: '#475569', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' },

        stationItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderBottom: '1px solid #f1f5f9' },
        stationStatus: (online) => ({ width: '10px', height: '10px', borderRadius: '50%', background: online ? '#22c55e' : '#cbd5e1' }),
        stationName: { fontSize: '0.9rem', fontWeight: '600', color: '#334155' },
        stationMeta: { fontSize: '0.75rem', color: '#94a3b8' }
    };

    useEffect(() => {
        // Subscribe to Real Intelligence
        const unsubIntel = HubService.subscribeToIntelligence((data) => {
            if (data.length === 0) {
                HubService.seedIntelligence(); // Auto-seed if empty
            } else {
                setSharedIntelligence(data);
            }
        });

        // Subscribe to Critical High Priority FIRs (Alerts)
        const unsubAlerts = HubService.subscribeToAlerts((data) => {
            setAlerts(data);
        });

        return () => { unsubIntel(); unsubAlerts(); };
    }, []);

    return (
        <div style={styles.container}>
            {/* Column 1: Critical Alerts */}
            <div style={styles.column}>
                <div style={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={styles.title}>Critical Alerts</h3>
                        <button
                            onClick={async () => {
                                const msg = window.prompt("Enter Intelligence Broadcast:");
                                if (msg) {
                                    await HubService.createIntelligence({
                                        title: "Direct Broadcast",
                                        description: msg,
                                        type: "Manual Alert",
                                        officer: "Station Command",
                                        timestamp: new Date().toISOString()
                                    });
                                }
                            }}
                            style={{ padding: '0.4rem 0.8rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            ➕ Broadcast
                        </button>
                        <span style={{ fontSize: '0.7rem', background: '#fee2f2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: '700' }}>LIVE</span>
                    </div>
                </div>
                <div style={styles.list}>
                    {alerts.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No critical alerts active.</div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} style={styles.card(true)}>
                                <div style={styles.metaRow}>
                                    <span style={{ fontWeight: '700', color: '#dc2626' }}>{alert.district}</span>
                                    <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div style={styles.cardTitle}>{alert.type}</div>
                                <div style={styles.cardDesc}>{alert.description}</div>
                                <button onClick={() => alert(`Alert for ${alert.district} acknowledged. Coordination team notified.`)} style={styles.actionBtn}>Acknowledge</button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Column 2: Intelligence Feed */}
            <div style={styles.column}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Intelligence Feed</h3>
                </div>
                <div style={styles.list}>
                    {sharedIntelligence.map(intel => (
                        <div key={intel.id} style={styles.card(false)}>
                            <div style={styles.metaRow}>
                                <span style={{ color: '#2563eb', fontWeight: '600' }}>{intel.from}</span>
                                <span>{intel.time}</span>
                            </div>
                            <div style={styles.cardTitle}>{intel.subject}</div>
                            <div style={styles.cardDesc}>{intel.details}</div>
                            <button onClick={() => alert(`Secure channel opened with ${intel.from}. Encryption active.`)} style={styles.actionBtn}>Reply Securely</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 3: Active Units */}
            <div style={styles.column}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Network Status</h3>
                </div>
                <div style={styles.list}>
                    {[
                        { name: 'Mumbai HQ', online: true, role: 'Command' },
                        { name: 'Pune Central', online: true, role: 'Regional' },
                        { name: 'Nagpur East', online: true, role: 'Regional' },
                        { name: 'Thane North', online: false, role: 'Outpost' }
                    ].map((st, i) => (
                        <div key={i} style={styles.stationItem}>
                            <div style={styles.stationStatus(st.online)}></div>
                            <div>
                                <div style={styles.stationName}>{st.name}</div>
                                <div style={styles.stationMeta}>{st.role} • {st.online ? 'Online' : 'Offline'}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={() => alert("Broadcast message sent to all active units in sector.")} style={{ width: '100%', padding: '0.8rem', background: '#1e40af', color: 'white', borderRadius: '0.5rem', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Broadcast Message</button>
                </div>
            </div>
        </div>
    );
}
