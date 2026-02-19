'use client';
import { useState, useEffect } from 'react';

export default function RecentReports({ userRole, showAll = false }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Mock crime reports data
    const mockReports = [
      {
        id: 1,
        type: 'Vehicle Theft',
        location: 'Kothrud, Pune',
        district: 'Pune',
        date: '2024-01-15T14:30:00',
        status: 'Under Investigation',
        severity: 'High',
        description: 'Motorcycle stolen from parking lot',
        reporter: 'Anonymous Citizen'
      },
      {
        id: 2,
        type: 'Burglary',
        location: 'Bandra West, Mumbai',
        district: 'Mumbai',
        date: '2024-01-14T22:15:00',
        status: 'Investigated',
        severity: 'Medium',
        description: 'Residential break-in, jewelry stolen',
        reporter: 'Mrs. Sharma'
      },
      {
        id: 3,
        type: 'Cyber Fraud',
        location: 'Hinjewadi, Pune',
        district: 'Pune',
        date: '2024-01-14T11:20:00',
        status: 'Under Investigation',
        severity: 'High',
        description: 'Online banking fraud case',
        reporter: 'IT Professional'
      },
      {
        id: 4,
        type: 'Assault',
        location: 'Nagpur Central',
        district: 'Nagpur',
        date: '2024-01-13T19:45:00',
        status: 'Case Filed',
        severity: 'High',
        description: 'Physical altercation in public place',
        reporter: 'Witness'
      },
      {
        id: 5,
        type: 'Theft',
        location: 'Thane Station',
        district: 'Thane',
        date: '2024-01-13T08:30:00',
        status: 'Resolved',
        severity: 'Medium',
        description: 'Mobile phone snatched',
        reporter: 'Commuter'
      },
      {
        id: 6,
        type: 'Domestic Violence',
        location: 'Nashik Road',
        district: 'Nashik',
        date: '2024-01-12T16:20:00',
        status: 'Under Investigation',
        severity: 'High',
        description: 'Domestic dispute case reported',
        reporter: 'Neighbor'
      }
    ];

    setReports(showAll ? mockReports : mockReports.slice(0, 3));
  }, [showAll]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return '#10b981';
      case 'Under Investigation': return '#f59e0b';
      case 'Case Filed': return '#3b82f6';
      case 'Investigated': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
          {showAll ? 'All Crime Reports' : 'Recent Crime Reports'}
        </h2>
        {!showAll && (
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}>
            View All Reports
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                Crime Type
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                Location
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                Date & Time
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                Status
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                Severity
              </th>
              {userRole === 'police' && (
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: '500' }}>{report.type}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {report.description}
                  </div>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: '500' }}>{report.location}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {report.district}
                  </div>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {new Date(report.date).toLocaleDateString('en-IN')}
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(report.date).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: getStatusColor(report.status),
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {report.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: getSeverityColor(report.severity),
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {report.severity}
                  </span>
                </td>
                {userRole === 'police' && (
                  <td style={{ padding: '0.75rem' }}>
                    <button style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      marginRight: '0.5rem'
                    }}>
                      Investigate
                    </button>
                    <button style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}>
                      Details
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reports.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6b7280',
          backgroundColor: '#f8f9fa',
          borderRadius: '0.5rem',
          marginTop: '1rem'
        }}>
          No crime reports found for the selected filters.
        </div>
      )}
    </div>
  );
}