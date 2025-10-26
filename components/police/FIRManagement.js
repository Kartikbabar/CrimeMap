'use client';
import { useState } from 'react';

export default function FIRManagement() {
  const [activeFIR, setActiveFIR] = useState(null);
  const [showFIRForm, setShowFIRForm] = useState(false);

  // Mock FIR data
  const mockFIRs = [
    {
      id: 'FIR/2024/001',
      complainant: 'Rajesh Kumar',
      complainantPhone: '+91 9876543210',
      crimeType: 'Vehicle Theft',
      location: 'Kothrud, Pune',
      date: '2024-01-15T14:30:00',
      status: 'Under Investigation',
      assignedOfficer: 'PI Sharma',
      station: 'Pune Central PS',
      description: 'Motorcycle stolen from residential parking',
      evidence: ['CCTV footage', 'Witness statements'],
      updates: [
        { date: '2024-01-15', note: 'FIR registered', officer: 'Constable Patil' },
        { date: '2024-01-16', note: 'CCTV footage collected', officer: 'PI Sharma' }
      ]
    },
    {
      id: 'FIR/2024/002',
      complainant: 'Priya Singh',
      complainantPhone: '+91 9876543211',
      crimeType: 'Burglary',
      location: 'Bandra West, Mumbai',
      date: '2024-01-14T22:15:00',
      status: 'Chargesheet Filed',
      assignedOfficer: 'PI Desai',
      station: 'Mumbai South PS',
      description: 'Residential break-in, jewelry and cash stolen',
      evidence: ['Fingerprints', 'Broken lock'],
      updates: [
        { date: '2024-01-14', note: 'FIR registered', officer: 'Constable Mehta' },
        { date: '2024-01-15', note: 'Forensic team deployed', officer: 'PI Desai' },
        { date: '2024-01-18', note: 'Chargesheet filed in court', officer: 'PI Desai' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Registered': '#3b82f6',
      'Under Investigation': '#f59e0b',
      'Chargesheet Filed': '#8b5cf6',
      'Trial': '#ef4444',
      'Closed': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>FIR Management System</h2>
          <p style={{ color: '#6b7280' }}>Manage and track First Information Reports</p>
        </div>
        <button
          onClick={() => setShowFIRForm(true)}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>+</span>
          <span>Register New FIR</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeFIR ? '1fr 2fr' : '1fr', gap: '1.5rem' }}>
        {/* FIR List */}
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
              <h3 style={{ fontWeight: '600' }}>Recent FIRs</h3>
              <span style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                {mockFIRs.length} Active
              </span>
            </div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {mockFIRs.map(fir => (
                <div
                  key={fir.id}
                  onClick={() => setActiveFIR(fir)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    backgroundColor: activeFIR?.id === fir.id ? '#f0f9ff' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{fir.id}</div>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: getStatusColor(fir.status),
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {fir.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {fir.crimeType} • {fir.location}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Complainant: {fir.complainant}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                    {new Date(fir.date).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIR Details */}
        {activeFIR && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {activeFIR.id} - {activeFIR.crimeType}
                </h3>
                <p style={{ color: '#6b7280' }}>{activeFIR.location}</p>
              </div>
              <button
                onClick={() => setActiveFIR(null)}
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
                <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Case Details</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div>
                    <strong>Complainant:</strong> {activeFIR.complainant}
                  </div>
                  <div>
                    <strong>Phone:</strong> {activeFIR.complainantPhone}
                  </div>
                  <div>
                    <strong>Station:</strong> {activeFIR.station}
                  </div>
                  <div>
                    <strong>Assigned Officer:</strong> {activeFIR.assignedOfficer}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Case Status</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div>
                    <strong>Status:</strong> 
                    <span style={{ 
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: getStatusColor(activeFIR.status),
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {activeFIR.status}
                    </span>
                  </div>
                  <div>
                    <strong>Registered:</strong> {new Date(activeFIR.date).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Description</h4>
              <p style={{ 
                backgroundColor: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                {activeFIR.description}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Evidence & Updates</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h5 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Evidence Collected</h5>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {activeFIR.evidence.map((item, index) => (
                      <li key={index} style={{ 
                        padding: '0.5rem', 
                        backgroundColor: '#f0f9ff', 
                        marginBottom: '0.25rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #bae6fd'
                      }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Case Updates</h5>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {activeFIR.updates.map((update, index) => (
                      <div key={index} style={{ 
                        padding: '0.75rem', 
                        backgroundColor: '#f8fafc', 
                        marginBottom: '0.5rem',
                        borderRadius: '0.375rem',
                        borderLeft: '3px solid #3b82f6'
                      }}>
                        <div style={{ fontWeight: '500' }}>{update.note}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          {new Date(update.date).toLocaleDateString('en-IN')} • {update.officer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Update Case
              </button>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Add Evidence
              </button>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
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

      {/* New FIR Form Modal */}
      {showFIRForm && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Register New FIR</h3>
            <form style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Complainant Name</label>
                  <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                  <input type="tel" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Crime Type</label>
                <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                  <option value="">Select crime type</option>
                  <option value="Theft">Theft</option>
                  <option value="Burglary">Burglary</option>
                  <option value="Assault">Assault</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
                <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                <textarea rows={4} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowFIRForm(false)}
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
                  Register FIR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}