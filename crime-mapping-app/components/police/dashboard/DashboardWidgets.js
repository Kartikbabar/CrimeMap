'use client';
import { useState, useEffect } from 'react';
import { FIRService, CommunityAlertService } from '../../../lib/firebase';
import CrimeMapWidget from './CrimeMapWidget';

const DashboardWidgets = ({ setActiveTab, userDistrict }) => {
    const [recentFIRs, setRecentFIRs] = useState([]);
    const [allFIRs, setAllFIRs] = useState([]);
    const [communityReports, setCommunityReports] = useState([]);

    useEffect(() => {
        if (userDistrict) {
            const unsubscribe = FIRService.subscribeToDistrictFIRs(userDistrict, (firs) => {
                setAllFIRs(firs);
                setRecentFIRs(firs.slice(0, 2));
            });
            const unsubReports = CommunityAlertService.subscribeToDistrictReports(userDistrict, (reports) => {
                setCommunityReports(reports.slice(0, 4));
            });
            return () => { unsubscribe(); unsubReports(); };
        }
    }, [userDistrict]);

    const styles = {
        container: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            padding: '1.5rem'
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
            color: '#8b949e',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
        },
        caseList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        },
        caseItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem',
            background: '#0d1117',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        caseInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        },
        caseIcon: {
            fontSize: '1.25rem'
        },
        caseDetails: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
        },
        caseId: {
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#c9d1d9'
        },
        caseLocation: {
            fontSize: '0.75rem',
            color: '#8b949e'
        },
        statusBadge: (status) => ({
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.7rem',
            fontWeight: '600',
            background: status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: status === 'Resolved' ? '#10b981' : '#f59e0b'
        }),
        actionButtons: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.75rem',
            marginTop: '1rem'
        },
        actionBtn: (primary) => ({
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: primary ? '#f59e0b' : 'rgba(139, 148, 158, 0.1)',
            color: primary ? '#0d1117' : '#8b949e'
        }),
        firTable: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        tableHeader: {
            textAlign: 'left',
            padding: '0.75rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#8b949e',
            borderBottom: '1px solid #21262d'
        },
        tableCell: {
            padding: '0.875rem 0.75rem',
            fontSize: '0.8rem',
            color: '#c9d1d9',
            borderBottom: '1px solid #21262d'
        },
        mapPlaceholder: {
            width: '100%',
            height: '200px',
            background: '#0d1117',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b949e',
            fontSize: '0.875rem',
            marginBottom: '1rem'
        },
        officerList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        },
        officerItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            background: '#0d1117',
            borderRadius: '0.5rem'
        },
        officerInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        },
        officerAvatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: '700'
        },
        officerName: {
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#c9d1d9'
        },
        officerRating: {
            fontSize: '0.75rem',
            color: '#8b949e'
        },
        onlineStatus: {
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.7rem',
            fontWeight: '600',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981'
        },
        patrolGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '0.75rem'
        },
        patrolBtn: {
            padding: '1rem',
            background: 'rgba(139, 148, 158, 0.05)',
            border: '1px solid #21262d',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#8b949e',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center'
        }
    };

    const mockCases = [
        { id: 'Case ID9', location: 'Polling 99, Station', status: 'Resolved', icon: '👤' },
        { id: 'Case ID1', location: 'Polling 63, Station', status: 'Resolved', icon: '🔶' },
        { id: 'Case ID2', location: 'Polling 14, Station', status: 'Pending', icon: '👤' },
        { id: 'Case ID3', location: 'Polling 9, Station', status: 'Resolved', icon: '👤' }
    ];

    const mockOfficers = [
        { name: 'Deoli Ilong', rating: '⭐⭐⭐⭐⭐ 4.50 mm', status: 'On Duty' },
        { name: 'Beya PIR', rating: '⭐⭐⭐⭐⭐ 6.00 pm', status: 'Available' }
    ];

    return (
        <div style={styles.container}>
            {/* Real-Time Updates */}
            <div style={styles.widget}>
                <div style={styles.widgetHeader}>
                    <h3 style={styles.widgetTitle}>Real-Time Updates</h3>
                    <span style={styles.viewAll}>
                        Ronlew ▼
                    </span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#8b949e', marginBottom: '1rem' }}>
                    High-Priority Cases
                </div>
                <div style={styles.caseList}>
                    {mockCases.map((case_, idx) => (
                        <div key={idx} style={styles.caseItem}>
                            <div style={styles.caseInfo}>
                                <span style={styles.caseIcon}>{case_.icon}</span>
                                <div style={styles.caseDetails}>
                                    <span style={styles.caseId}>{case_.id}</span>
                                    <span style={styles.caseLocation}>{case_.location}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={styles.statusBadge(case_.status)}>{case_.status}</span>
                                <span style={{ color: '#8b949e', fontSize: '1rem' }}>›</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Crime Visualization */}
            <div style={styles.widget}>
                <div style={styles.widgetHeader}>
                    <h3 style={styles.widgetTitle}>Crime Visualization</h3>
                    <span style={styles.viewAll}>
                        Coplow ▼
                    </span>
                </div>
                <div style={styles.actionButtons}>
                    <button style={styles.actionBtn(true)} onClick={() => setActiveTab('fir')}>
                        Register FIR
                    </button>
                    <button style={styles.actionBtn(false)}>Search FIR</button>
                    <button style={styles.actionBtn(false)}>Update Status</button>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <CrimeMapWidget firs={allFIRs} district={userDistrict} />
                </div>
            </div>

            {/* FIR Management */}
            <div style={styles.widget}>
                <div style={styles.widgetHeader}>
                    <h3 style={styles.widgetTitle}>FIR Management</h3>
                </div>
                <div style={styles.actionButtons}>
                    <button style={styles.actionBtn(true)} onClick={() => setActiveTab('fir')}>
                        Register FIR
                    </button>
                    <button style={styles.actionBtn(false)}>Search FIR</button>
                    <button style={styles.actionBtn(false)}>Update Status</button>
                </div>
                <table style={styles.firTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Recent FIR</th>
                            <th style={styles.tableHeader}>Tetol</th>
                            <th style={styles.tableHeader}>Offices</th>
                            <th style={styles.tableHeader}>Optimison</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentFIRs.length > 0 ? (
                            recentFIRs.map((fir, idx) => (
                                <tr key={idx}>
                                    <td style={styles.tableCell}>{fir.firNumber || 'N/A'}</td>
                                    <td style={styles.tableCell}>{fir.category || 'N/A'}</td>
                                    <td style={styles.tableCell}>{fir.status || 'Pending'}</td>
                                    <td style={styles.tableCell}>{fir.priority || 'Medium'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td style={styles.tableCell}>Recent FIR</td>
                                <td style={styles.tableCell}>Pounweh</td>
                                <td style={styles.tableCell}>0</td>
                                <td style={styles.tableCell}>4.90000</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Community Feedback Feed */}
            <div style={styles.widget}>
                <div style={styles.widgetHeader}>
                    <h3 style={styles.widgetTitle}>Community Feedback</h3>
                    <span style={styles.viewAll}>District: {userDistrict}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {communityReports.length > 0 ? communityReports.map((report, idx) => (
                        <div key={idx} style={{
                            padding: '1rem',
                            background: '#0d1117',
                            borderRadius: '0.5rem',
                            borderLeft: `4px solid ${report.status === 'Needs Review' ? '#f59e0b' : '#10b981'}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#f8fafc' }}>{report.type.toUpperCase()}</span>
                                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>📍 {report.location}</div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#c9d1d9', fontStyle: 'italic' }}>"{report.description?.slice(0, 60)}..."</p>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#8b949e', fontSize: '0.85rem' }}>
                            No community concerns reported in this district.
                        </div>
                    )}
                </div>
            </div>

            {/* Officer Management */}
            <div style={styles.widget}>
                <div style={styles.widgetHeader}>
                    <h3 style={styles.widgetTitle}>Officer Management</h3>
                    <span style={styles.viewAll}>
                        Coplow ▼
                    </span>
                </div>
                <div style={styles.officerList}>
                    {mockOfficers.map((officer, idx) => (
                        <div key={idx} style={styles.officerItem}>
                            <div style={styles.officerInfo}>
                                <div style={styles.officerAvatar}>
                                    {officer.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={styles.officerName}>{officer.name}</div>
                                    <div style={styles.officerRating}>{officer.rating}</div>
                                </div>
                            </div>
                            <span style={styles.onlineStatus}>{officer.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Patrol Optimization - Full Width */}
            <div style={{ ...styles.widget, gridColumn: '1 / -1' }}>
                <div style={styles.widgetHeader}>
                    <h3 style={styles.widgetTitle}>Patrol Optimization</h3>
                    <span style={styles.viewAll}>
                        Coplow ▼
                    </span>
                </div>
                <div style={styles.patrolGrid}>
                    <button style={styles.patrolBtn} onClick={() => setActiveTab('patrol')}>
                        Assign Patrol
                    </button>
                    <button style={styles.patrolBtn}>Route Planning</button>
                    <button style={styles.patrolBtn}>Route Planning</button>
                    <button style={styles.patrolBtn}>Resource Allocation</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardWidgets;
