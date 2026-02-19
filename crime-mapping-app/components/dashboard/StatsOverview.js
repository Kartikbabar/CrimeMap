// components/dashboard/StatsOverview.js
'use client';
import { useState, useEffect } from 'react';

const StatsOverview = ({ userRole }) => {
  const [stats, setStats] = useState([]);

  const styles = {
    container: { marginBottom: '2rem' },
    title: { fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem', letterSpacing: '-0.5px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' },
    card: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s',
      cursor: 'default',
      minHeight: '160px'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
    icon: { fontSize: '1.5rem', background: '#f1f5f9', padding: '0.75rem', borderRadius: '0.75rem', color: '#2563eb' },
    label: { fontSize: '0.85rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    value: { fontSize: '2.25rem', fontWeight: '800', color: '#1e293b' },
    footer: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' },
    trendIcon: (type) => ({ fontSize: '0.9rem', color: type === 'increase' ? '#ef4444' : '#10b981' }),
    trendText: (type) => ({ fontSize: '0.9rem', fontWeight: '600', color: type === 'increase' ? '#ef4444' : '#10b981' }),
    compareText: { fontSize: '0.8rem', color: '#94a3b8' }
  };

  useEffect(() => {
    const mockStats = userRole === 'police' ? [
      { name: 'Monthly Incidents', value: '1,247', change: '+12%', changeType: 'increase', icon: '📊' },
      { name: 'Cases Solved', value: '892', change: '+8%', changeType: 'decrease', icon: '✅' },
      { name: 'Active Patrols', value: '215', change: '-5%', changeType: 'decrease', icon: '🚔' },
      { name: 'Avg Response', value: '18m', change: '-2m', changeType: 'decrease', icon: '⚡' }
    ] : [
      { name: 'Local Incidents', value: '47', change: '-8%', changeType: 'decrease', icon: '📍' },
      { name: 'Safety Score', value: '82%', change: '+3%', changeType: 'decrease', icon: '🛡️' },
      { name: 'Police Stations', value: '5', change: '+1', changeType: 'increase', icon: '🏢' },
      { name: 'Response Time', value: '12m', change: '-1m', changeType: 'decrease', icon: '⚡' }
    ];
    setStats(mockStats);
  }, [userRole]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>System Overview</h2>
      <div style={styles.grid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.header}>
              <div style={styles.label}>{stat.name}</div>
              <span style={styles.icon}>{stat.icon}</span>
            </div>
            <div style={styles.value}>{stat.value}</div>

            {stat.change && (
              <div style={styles.footer}>
                <span style={styles.trendText(stat.changeType)}>
                  {stat.changeType === 'increase' ? '▲' : '▼'} {stat.change}
                </span>
                <span style={styles.compareText}>vs previous period</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;