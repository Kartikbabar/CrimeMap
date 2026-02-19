'use client';
import { useState, useEffect } from 'react';

export default function StatsOverview({ userRole }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Mock crime statistics data for Maharashtra
    const mockStats = userRole === 'police' ? [
      {
        name: 'Total Crimes This Month',
        value: '1,247',
        change: '+12%',
        changeType: 'increase',
        color: '#ef4444',
        icon: '🔴'
      },
      {
        name: 'Cases Solved',
        value: '892',
        change: '+8%',
        changeType: 'increase',
        color: '#10b981',
        icon: '✅'
      },
      {
        name: 'Active Investigations',
        value: '215',
        change: '-5%',
        changeType: 'decrease',
        color: '#f59e0b',
        icon: '🕵️'
      },
      {
        name: 'Average Response Time',
        value: '18 mins',
        change: '-2 mins',
        changeType: 'decrease',
        color: '#3b82f6',
        icon: '⚡'
      },
      {
        name: 'Hotspot Areas',
        value: '23',
        change: '+3',
        changeType: 'increase',
        color: '#8b5cf6',
        icon: '📍'
      },
      {
        name: 'Patrol Coverage',
        value: '78%',
        change: '+5%',
        changeType: 'increase',
        color: '#06b6d4',
        icon: '🚔'
      }
    ] : [
      {
        name: 'Crimes in Your Area',
        value: '47',
        change: '-8%',
        changeType: 'decrease',
        color: '#ef4444',
        icon: '🔴'
      },
      {
        name: 'Safety Score',
        value: '82%',
        change: '+3%',
        changeType: 'increase',
        color: '#10b981',
        icon: '🛡️'
      },
      {
        name: 'Nearby Police Stations',
        value: '5',
        change: '+1',
        changeType: 'increase',
        color: '#3b82f6',
        icon: '🏢'
      },
      {
        name: 'Emergency Response',
        value: '12 mins',
        change: '-1 min',
        changeType: 'decrease',
        color: '#f59e0b',
        icon: '⚡'
      },
      {
        name: 'Community Alerts',
        value: '8',
        change: '+2',
        changeType: 'increase',
        color: '#8b5cf6',
        icon: '📢'
      },
      {
        name: 'Safety Tips',
        value: '24/7',
        change: '',
        changeType: 'neutral',
        color: '#06b6d4',
        icon: '💡'
      }
    ];

    setStats(mockStats);
  }, [userRole]);

  return (
    <div className="dashboard-card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Crime Statistics Overview
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', marginRight: '0.75rem' }}>
                {stat.icon}
              </span>
              <div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {stat.name}
                </div>
                <div style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold',
                  color: stat.color
                }}>
                  {stat.value}
                </div>
              </div>
            </div>
            {stat.change && (
              <div style={{ 
                fontSize: '0.875rem',
                color: stat.changeType === 'increase' ? '#ef4444' : 
                       stat.changeType === 'decrease' ? '#10b981' : '#6b7280',
                fontWeight: '500'
              }}>
                {stat.change} from last month
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}