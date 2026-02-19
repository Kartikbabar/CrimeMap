'use client';
import { useState } from 'react';

export default function PatrolManagement() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  const patrolRoutes = [
    {
      id: 1,
      name: 'Mumbai High-Risk Patrol',
      area: 'South Mumbai',
      officers: ['SI Raj Sharma', 'Constable Amit Kumar'],
      startTime: '18:00',
      endTime: '02:00',
      status: 'Active',
      checkpoints: [
        { name: 'Marine Drive', status: 'Completed', time: '18:30' },
        { name: 'Colaba', status: 'In Progress', time: '19:45' },
        { name: 'Nariman Point', status: 'Pending', time: '21:00' }
      ],
      incidents: 2,
      lastUpdate: '10 minutes ago'
    },
    {
      id: 2,
      name: 'Pune Night Patrol',
      area: 'Pune Central',
      officers: ['PI Sanjay Patil', 'Constable Neha Singh'],
      startTime: '20:00',
      endTime: '04:00',
      status: 'Scheduled',
      checkpoints: [
        { name: 'Shivajinagar', status: 'Pending', time: '20:30' },
        { name: 'FC Road', status: 'Pending', time: '21:30' },
        { name: 'Kothrud', status: 'Pending', time: '23:00' }
      ],
      incidents: 0,
      lastUpdate: '1 hour ago'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Active': '#10b981',
      'Scheduled': '#f59e0b',
      'Completed': '#6b7280',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Patrol Route Management</h2>
          <p style={{ color: '#6b7280' }}>Monitor and manage police patrol routes</p>
        </div>
        <button style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          + Create New Route
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedRoute ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Patrol Routes List */}
        <div>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Active Patrol Routes</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {patrolRoutes.map(route => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  boxShadow: selectedRoute?.id === route.id ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{route.name}</h4>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{route.area}</p>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getStatusColor(route.status),
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {route.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <strong>Officers:</strong>
                    <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                      {route.officers.join(', ')}
                    </div>
                  </div>
                  <div>
                    <strong>Timing:</strong>
                    <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                      {route.startTime} - {route.endTime}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: route.incidents > 0 ? '#ef4444' : '#10b981',
                      borderRadius: '50%'
                    }}></span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {route.incidents} incidents
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Updated {route.lastUpdate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Details */}
        {selectedRoute && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{selectedRoute.name}</h3>
                <p style={{ color: '#6b7280' }}>{selectedRoute.area}</p>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Route Checkpoints</h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {selectedRoute.checkpoints.map((checkpoint, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: 
                        checkpoint.status === 'Completed' ? '#10b981' :
                        checkpoint.status === 'In Progress' ? '#3b82f6' : '#6b7280',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{checkpoint.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Scheduled: {checkpoint.time}
                      </div>
                    </div>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 
                        checkpoint.status === 'Completed' ? '#d1fae5' :
                        checkpoint.status === 'In Progress' ? '#dbeafe' : '#f3f4f6',
                      color: 
                        checkpoint.status === 'Completed' ? '#065f46' :
                        checkpoint.status === 'In Progress' ? '#1e40af' : '#6b7280',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {checkpoint.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Assigned Officers</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {selectedRoute.officers.map((officer, index) => (
                  <div key={index} style={{ 
                    padding: '0.75rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.5rem',
                    border: '1px solid #bae6fd',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontWeight: '500' }}>{officer}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>On Duty</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Update Status
              </button>
              <button style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Report Incident
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}