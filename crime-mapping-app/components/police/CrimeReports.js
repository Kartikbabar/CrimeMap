'use client';
import { useState, useEffect } from 'react';
import { FIRService } from '../../lib/firebase';

const CrimeReports = ({ userDistrict }) => {
    const [firs, setFirs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        if (userDistrict) {
            const unsubscribe = FIRService.subscribeToDistrictFIRs(userDistrict, setFirs);
            return () => unsubscribe();
        }
    }, [userDistrict]);

    const styles = {
        container: {
            background: '#161b22',
            borderRadius: '0.75rem',
            border: '1px solid #21262d',
            padding: '1.5rem'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#c9d1d9',
            margin: 0
        },
        filters: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
        },
        searchInput: {
            flex: 1,
            minWidth: '200px',
            padding: '0.75rem 1rem',
            background: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: '0.5rem',
            color: '#c9d1d9',
            fontSize: '0.875rem'
        },
        select: {
            padding: '0.75rem 1rem',
            background: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: '0.5rem',
            color: '#c9d1d9',
            fontSize: '0.875rem',
            cursor: 'pointer'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            textAlign: 'left',
            padding: '1rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#8b949e',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: '2px solid #21262d'
        },
        td: {
            padding: '1rem 0.75rem',
            fontSize: '0.875rem',
            color: '#c9d1d9',
            borderBottom: '1px solid #21262d'
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
                color: style.color,
                display: 'inline-block'
            };
        },
        priorityBadge: (priority) => {
            const colors = {
                'High': '#ef4444',
                'Medium': '#f59e0b',
                'Low': '#10b981'
            };
            return {
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: colors[priority] || colors['Medium'],
                display: 'inline-block',
                marginRight: '0.5rem'
            };
        },
        emptyState: {
            textAlign: 'center',
            padding: '3rem',
            color: '#8b949e'
        }
    };

    // Filter FIRs
    const filteredFirs = firs.filter(fir => {
        const matchesSearch =
            fir.firNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fir.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fir.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || fir.status === filterStatus;
        const matchesCategory = filterCategory === 'All' || fir.category === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Get unique categories
    const categories = ['All', ...new Set(firs.map(f => f.category).filter(Boolean))];
    const statuses = ['All', 'Pending', 'Under Investigation', 'Resolved'];

    return (
        <div>
            <h2 style={{ color: '#c9d1d9', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
                Crime Reports - {userDistrict}
            </h2>

            <div style={styles.container}>
                <div style={styles.filters}>
                    <input
                        type="text"
                        placeholder="Search FIR number, description, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={styles.select}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={styles.select}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>FIR Number</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Priority</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Officer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFirs.length > 0 ? (
                            filteredFirs.map((fir, idx) => (
                                <tr key={idx} style={{ cursor: 'pointer' }}>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{fir.firNumber}</td>
                                    <td style={styles.td}>{fir.category}</td>
                                    <td style={{ ...styles.td, maxWidth: '250px' }}>
                                        {fir.description?.substring(0, 50)}...
                                    </td>
                                    <td style={styles.td}>{fir.location}</td>
                                    <td style={styles.td}>{fir.reportedDate}</td>
                                    <td style={styles.td}>
                                        <span style={styles.priorityBadge(fir.priority)} />
                                        {fir.priority}
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadge(fir.status)}>{fir.status}</span>
                                    </td>
                                    <td style={styles.td}>{fir.assignedOfficer}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={styles.emptyState}>
                                    {searchTerm || filterStatus !== 'All' || filterCategory !== 'All'
                                        ? 'No reports match your filters'
                                        : 'No crime reports available'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CrimeReports;
