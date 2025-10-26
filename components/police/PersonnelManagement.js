'use client';
import { useState } from 'react';

export default function PersonnelManagement() {
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const personnelData = [
    {
      id: 1,
      name: 'PI Rajesh Sharma',
      badgeNumber: 'MH-4587',
      rank: 'Police Inspector',
      station: 'Pune Central PS',
      contact: '+91 9876543210',
      status: 'On Duty',
      cases: 24,
      solved: 18,
      joinDate: '2020-03-15',
      specialization: ['Cyber Crime', 'Investigation']
    },
    {
      id: 2,
      name: 'SI Priya Patil',
      badgeNumber: 'MH-5623',
      rank: 'Sub-Inspector',
      station: 'Mumbai South PS',
      contact: '+91 9876543211',
      status: 'On Patrol',
      cases: 19,
      solved: 14,
      joinDate: '2021-07-22',
      specialization: ['Forensics', 'Community Policing']
    },
    {
      id: 3,
      name: 'Constable Amit Kumar',
      badgeNumber: 'MH-7894',
      rank: 'Police Constable',
      station: 'Nagpur East PS',
      contact: '+91 9876543212',
      status: 'Available',
      cases: 16,
      solved: 11,
      joinDate: '2022-01-10',
      specialization: ['Traffic Control', 'Patrol']
    },
    {
      id: 4,
      name: 'PI Sanjay Desai',
      badgeNumber: 'MH-3456',
      rank: 'Police Inspector',
      station: 'Thane West PS',
      contact: '+91 9876543213',
      status: 'In Court',
      cases: 21,
      solved: 16,
      joinDate: '2019-11-30',
      specialization: ['Homicide', 'Major Crimes']
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'On Duty': '#10b981',
      'On Patrol': '#3b82f6',
      'Available': '#f59e0b',
      'In Court': '#8b5cf6',
      'Off Duty': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Personnel Management</h2>
          <p style={{ color: '#6b7280' }}>Manage police personnel and assignments</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          + Add Personnel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedOfficer ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Personnel List */}
        <div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f8fafc', 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontWeight: '600' }}>Police Personnel</h3>
              <span style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                {personnelData.length} Officers
              </span>
            </div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {personnelData.map(officer => (
                <div
                  key={officer.id}
                  onClick={() => setSelectedOfficer(officer)}
                  style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    backgroundColor: selectedOfficer?.id === officer.id ? '#f0f9ff' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{officer.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{officer.rank}</div>
                    </div>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(officer.status),
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {officer.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <strong>Badge:</strong> {officer.badgeNumber}
                    </div>
                    <div>
                      <strong>Station:</strong> {officer.station}
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
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {officer.solved}/{officer.cases} cases
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Since {new Date(officer.joinDate).getFullYear()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Officer Details */}
        {selectedOfficer && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{selectedOfficer.name}</h3>
                <p style={{ color: '#6b7280' }}>{selectedOfficer.rank} • {selectedOfficer.badgeNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOfficer(null)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Profile Information</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div>
                    <strong>Station:</strong> {selectedOfficer.station}
                  </div>
                  <div>
                    <strong>Contact:</strong> {selectedOfficer.contact}
                  </div>
                  <div>
                    <strong>Join Date:</strong> {new Date(selectedOfficer.joinDate).toLocaleDateString('en-IN')}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span style={{ 
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(selectedOfficer.status),
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {selectedOfficer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Performance</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div>
                    <strong>Total Cases:</strong> {selectedOfficer.cases}
                  </div>
                  <div>
                    <strong>Cases Solved:</strong> {selectedOfficer.solved}
                  </div>
                  <div>
                    <strong>Success Rate:</strong> 
                    <span style={{ 
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {Math.round((selectedOfficer.solved / selectedOfficer.cases) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Specializations</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedOfficer.specialization.map((spec, index) => (
                  <span 
                    key={index}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f0f9ff',
                      color: '#0369a1',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: '1px solid #bae6fd'
                    }}
                  >
                    {spec}
                  </span>
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
                Assign Case
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
                Update Status
              </button>
              <button style={{
                padding: '0.75rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Personnel Form Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Add New Personnel</h3>
            <form style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                  <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Badge Number</label>
                  <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Rank</label>
                <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                  <option value="">Select Rank</option>
                  <option value="Police Constable">Police Constable</option>
                  <option value="Head Constable">Head Constable</option>
                  <option value="Sub-Inspector">Sub-Inspector</option>
                  <option value="Police Inspector">Police Inspector</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Station</label>
                <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Number</label>
                <input type="tel" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Add Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}