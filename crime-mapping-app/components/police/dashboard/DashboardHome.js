'use client';
import { useState, useEffect } from 'react';
import { FIRService } from '../../../lib/firebase';
import CrimeMapWidget from './CrimeMapWidget';

const DashboardHome = ({ setActiveTab, userDistrict }) => {
    const [recentFIRs, setRecentFIRs] = useState([]);
    const [allFIRs, setAllFIRs] = useState([]);
    const [mapView, setMapView] = useState('markers'); // 'markers' or 'heatmap'

    useEffect(() => {
        if (userDistrict) {
            const unsubscribe = FIRService.subscribeToDistrictFIRs(userDistrict, (firs) => {
                setAllFIRs(firs);
                setRecentFIRs(firs.slice(0, 5));
            });
            return () => unsubscribe();
        }
    }, [userDistrict]);

    const styles = {
        container: {
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1.5rem',
            background: '#0d1117',
            minHeight: 'calc(100vh - 60px)'
        },
        leftColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        },
        rightColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        },
        mapCard: {
            background: '#161b22',
            borderRadius: '0.75rem',
            border: '1px solid #21262d',
            padding: '1.5rem',
            height: '500px'
        },
        widget: {
            background: '#161b22',
            borderRadius: '0.75rem',
            border: '1px solid #21262d',
            padding: '1.5rem'
        },
        widgetHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem'
        },
        widgetTitle: {
            fontSize: '1rem',
            fontWeight: '600',
            color: '#c9d1d9',
            margin: 0
        },
        viewAll: {
            fontSize: '0.75rem',
            color: '#f59e0b',
            cursor: 'pointer',
            fontWeight: '600'
        },
        statGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
        },
        statBox: {
            background: '#0d1117',
            padding: '1.25rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
        },
        statValue: {
            fontSize: '2rem',
            fontWeight: '700',
            color: '#f59e0b',
            marginBottom: '0.5rem'
        },
        statLabel: {
            fontSize: '0.75rem',
            color: '#8b949e',
            textTransform: 'uppercase'
        },
        firList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        },
        firItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.875rem',
            background: '#0d1117',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        firInfo: {
            flex: 1
        },
        firNumber: {
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#c9d1d9',
            marginBottom: '0.25rem'
        },
        firCategory: {
            fontSize: '0.75rem',
            color: '#8b949e'
        },
        statusBadge: (status) => {
            const colors = {
                'Resolved': { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
                'Pending': { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
                'Under Investigation': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }
            };
            const style = colors[status] || colors['Pending'];
            return {
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.7rem',
                fontWeight: '600',
                background: style.bg,
                color: style.color
            };
        },
        actionButtons: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginTop: '1rem'
        },
        actionBtn: (primary) => ({
            padding: '0.875rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: primary ? '#f59e0b' : 'rgba(139, 148, 158, 0.1)',
            color: primary ? '#0d1117' : '#8b949e'
        }),
        mapContainer: {
            height: '420px',
            borderRadius: '0.5rem',
            overflow: 'hidden'
        },
        toggleBtn: (active) => ({
            padding: '0.25rem 0.5rem',
            fontSize: '0.7rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            background: active ? '#f59e0b' : 'transparent',
            color: active ? '#0d1117' : '#8b949e',
            transition: 'all 0.2s'
        })
    };

    // Calculate quick stats
    const totalCases = allFIRs.length;
    const resolvedCases = allFIRs.filter(f => f.status === 'Resolved' || f.status === 'Closed').length;
    const pendingCases = allFIRs.filter(f => f.status === 'Pending').length;
    const activeCases = allFIRs.filter(f => f.status === 'Under Investigation').length;
    const criticalFIRs = allFIRs.filter(f => f.priority === 'Critical' || f.severity === 'Critical');
    const staleFIRs = allFIRs.filter(f => f.status !== 'Resolved' && f.status !== 'Closed' && (new Date() - new Date(f.registrationDate || f.createdAt)) / (1000 * 60 * 60 * 24) >= 7);

    return (
        <div style={styles.container}>
            {/* High-priority alerts strip */}
            {criticalFIRs.length > 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '0.75rem 1rem', background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '800', color: '#ef4444', fontSize: '0.8rem' }}>⚠️ {criticalFIRs.length} CRITICAL CASE{criticalFIRs.length > 1 ? 'S' : ''}</span>
                    {criticalFIRs.slice(0, 4).map(f => (
                        <button key={f.id} onClick={() => setActiveTab('fir')} style={{ padding: '0.35rem 0.75rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '0.35rem', color: '#fca5a5', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>{f.firNumber}</button>
                    ))}
                </div>
            )}

            {/* Left Column - Map */}
            <div style={styles.leftColumn}>
                <div style={styles.mapCard}>
                    <div style={styles.widgetHeader}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={styles.widgetTitle}>Crime Map - {userDistrict}</h3>
                            <div style={{
                                display: 'flex',
                                background: 'rgba(139, 148, 158, 0.1)',
                                padding: '2px',
                                borderRadius: '0.35rem',
                                marginLeft: '1rem'
                            }}>
                                <button
                                    style={styles.toggleBtn(mapView === 'markers')}
                                    onClick={() => setMapView('markers')}
                                >
                                    Points
                                </button>
                                <button
                                    style={styles.toggleBtn(mapView === 'heatmap')}
                                    onClick={() => setMapView('heatmap')}
                                >
                                    Heatmap
                                </button>
                            </div>
                        </div>
                        <span style={styles.viewAll}>{allFIRs.length} Active Cases</span>
                    </div>
                    <div style={styles.mapContainer}>
                        <CrimeMapWidget firs={allFIRs} district={userDistrict} viewType={mapView} />
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={styles.widget}>
                    <h3 style={styles.widgetTitle}>Quick Actions</h3>
                    <div style={{ ...styles.actionButtons, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <button style={styles.actionBtn(true)} onClick={() => setActiveTab('nexus')}>
                            🌐 Inter-Station Hub
                        </button>
                        <button style={styles.actionBtn(false)} onClick={() => setActiveTab('fir')}>
                            📋 Register FIR
                        </button>
                        <button style={styles.actionBtn(false)} onClick={() => setActiveTab('patrol')}>
                            🚔 Assign Patrol
                        </button>
                        <button style={styles.actionBtn(false)} onClick={() => setActiveTab('personnel')}>
                            👮 Personnel
                        </button>
                        <button style={styles.actionBtn(false)} onClick={() => setActiveTab('analytics')}>
                            📊 View Analytics
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column - Stats & Recent FIRs */}
            <div style={styles.rightColumn}>
                {/* Quick Stats */}
                <div style={styles.widget}>
                    <h3 style={styles.widgetTitle}>Overview</h3>
                    <div style={styles.statGrid}>
                        <div style={styles.statBox}>
                            <div style={styles.statValue}>{totalCases}</div>
                            <div style={styles.statLabel}>Total Cases</div>
                        </div>
                        <div style={styles.statBox}>
                            <div style={{ ...styles.statValue, color: '#10b981' }}>{resolvedCases}</div>
                            <div style={styles.statLabel}>Resolved</div>
                        </div>
                        <div style={styles.statBox}>
                            <div style={{ ...styles.statValue, color: '#ef4444' }}>{pendingCases}</div>
                            <div style={styles.statLabel}>Pending</div>
                        </div>
                        <div style={styles.statBox}>
                            <div style={{ ...styles.statValue, color: '#f59e0b' }}>{activeCases}</div>
                            <div style={styles.statLabel}>Active</div>
                        </div>
                    </div>
                </div>

                {/* Stale cases callout */}
                {staleFIRs.length > 0 && (
                    <div style={{ ...styles.widget, borderColor: '#f59e0b44', background: 'rgba(245, 158, 11, 0.06)' }}>
                        <div style={styles.widgetHeader}>
                            <h3 style={{ ...styles.widgetTitle, color: '#f59e0b' }}>Stale cases (7+ days)</h3>
                            <span style={styles.viewAll} onClick={() => setActiveTab('fir')}>View →</span>
                        </div>
                        <div style={styles.firList}>
                            {staleFIRs.slice(0, 3).map((fir, idx) => (
                                <div key={idx} style={styles.firItem} onClick={() => setActiveTab('fir')}>
                                    <div style={styles.firInfo}>
                                        <div style={styles.firNumber}>{fir.firNumber}</div>
                                        <div style={styles.firCategory}>{fir.type} • {Math.floor((new Date() - new Date(fir.registrationDate || fir.createdAt)) / (1000 * 60 * 60 * 24))}d open</div>
                                    </div>
                                    <span style={styles.statusBadge(fir.status)}>{fir.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent FIRs */}
                <div style={styles.widget}>
                    <div style={styles.widgetHeader}>
                        <h3 style={styles.widgetTitle}>Recent FIRs</h3>
                        <span style={styles.viewAll} onClick={() => setActiveTab('fir')}>View All →</span>
                    </div>
                    <div style={styles.firList}>
                        {recentFIRs.length > 0 ? (
                            recentFIRs.map((fir, idx) => (
                                <div key={idx} style={styles.firItem} onClick={() => setActiveTab('fir')}>
                                    <div style={styles.firInfo}>
                                        <div style={styles.firNumber}>{fir.firNumber}</div>
                                        <div style={styles.firCategory}>{fir.type} • {fir.location}</div>
                                    </div>
                                    <span style={styles.statusBadge(fir.status)}>{fir.status}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: '#8b949e', textAlign: 'center', padding: '2rem' }}>
                                No FIRs registered yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
