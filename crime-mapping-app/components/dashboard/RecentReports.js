// components/dashboard/RecentReports.js
'use client';
import { useState, useEffect } from 'react';

const RecentReports = ({ userRole, showAll = false }) => {
  const [reports, setReports] = useState([]);

  const styles = {
    container: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', marginTop: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 },
    viewAllBtn: { padding: '0.6rem 1.25rem', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s' },
    tableWrapper: { overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
    th: { padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    tr: { transition: 'background 0.2s', borderBottom: '1px solid #f1f5f9' },
    td: { padding: '1.25rem 1.5rem', verticalAlign: 'middle', color: '#334155' },
    type: { fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' },
    desc: { fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' },
    actions: { display: 'flex', gap: '0.75rem' },
    actionBtn: { padding: '0.4rem 0.8rem', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
    statusTag: (status) => {
      const colors = {
        'Resolved': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
        'Active': { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
        'Pending': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
        'Investigated': { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' }
      };
      const c = colors[status] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
      return { padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700', background: c.bg, color: c.text, border: `1px solid ${c.border}`, width: 'fit-content' };
    },
    severityTag: (severity) => {
      const colors = {
        'High': { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
        'Medium': { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
        'Low': { bg: '#ecfccb', text: '#3f6212', border: '#d9f99d' }
      };
      const c = colors[severity] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
      return { padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700', background: c.bg, color: c.text, border: `1px solid ${c.border}`, width: 'fit-content' };
    },
    empty: { textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '0.5rem', marginTop: '1rem', border: '1px dashed #e2e8f0' }
  };

  useEffect(() => {
    const mockReports = [
      { id: 1, type: 'Vehicle Theft', location: 'Kothrud, Pune', district: 'Pune', date: '2024-01-15T14:30:00', status: 'Active', severity: 'High', description: 'Motorcycle stolen from public parking.', reporter: 'Private Citizen' },
      { id: 2, type: 'Burglary', location: 'Bandra, Mumbai', district: 'Mumbai', date: '2024-01-14T22:15:00', status: 'Pending', severity: 'Medium', description: 'Residential break-in reported.', reporter: 'Private Citizen' },
      { id: 3, type: 'Cyber Fraud', location: 'Hinjewadi, Pune', district: 'Pune', date: '2024-01-14T11:20:00', status: 'Active', severity: 'High', description: 'Online phishing scam reported.', reporter: 'Private Citizen' },
      { id: 4, type: 'Public Disturbance', location: 'Nagpur East', district: 'Nagpur', date: '2024-01-13T19:45:00', status: 'Resolved', severity: 'High', description: 'Altercation in public area.', reporter: 'Officer Patil' },
      { id: 5, type: 'Petty Theft', location: 'Thane Station', district: 'Thane', date: '2024-01-13T08:30:00', status: 'Resolved', severity: 'Medium', description: 'Mobile phone snatching incident.', reporter: 'Commuter' }
    ];
    setReports(showAll ? mockReports : mockReports.slice(0, 3));
  }, [showAll]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{showAll ? 'Global Incident Database' : 'Recent Incidents'}</h2>
        {!showAll && <button style={styles.viewAllBtn}>View All Reports</button>}
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Incident</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Priority</th>
              {userRole === 'police' && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.type}>{report.type}</div>
                  <div style={styles.desc}>{report.description}</div>
                </td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600' }}>{report.location}</div>
                  <div style={styles.desc}>{report.district}</div>
                </td>
                <td style={styles.td}>
                  <div>{new Date(report.date).toLocaleDateString()}</div>
                  <div style={styles.desc}>{new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.statusTag(report.status)}>{report.status}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.severityTag(report.severity)}>{report.severity}</div>
                </td>
                {userRole === 'police' && (
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.actionBtn}>Open</button>
                      <button style={{ ...styles.actionBtn, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>Update</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reports.length === 0 && (
        <div style={styles.empty}>No recent incidents.</div>
      )}
    </div>
  );
};

export default RecentReports;