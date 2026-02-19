// components/police/PersonnelManagement.js
'use client';
import { useState, useEffect } from 'react';
import { PersonnelService, DataSeedingService } from '../../lib/firebase';

export default function PersonnelManagement({ userRole, userDistrict, userStation }) {
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newOfficer, setNewOfficer] = useState({
    name: '', badgeNumber: '', rank: 'Police Constable', email: '', contact: '', specialization: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpec, setFilterSpec] = useState('all');

  const styles = {
    container: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', height: 'calc(100vh - 120px)', background: '#020617', color: '#f8fafc', padding: '1rem', borderRadius: '2rem', border: '1px solid #1e293b', overflow: 'hidden' },
    sidebar: { background: 'rgba(15, 23, 42, 0.4)', borderRadius: '1.5rem', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    sidebarHeader: { padding: '1.5rem', borderBottom: '1px solid #1e293b', background: 'rgba(2, 6, 23, 0.6)' },
    searchInput: { width: '100%', padding: '0.75rem 1rem', background: '#020617', border: '1px solid #334155', borderRadius: '0.75rem', color: 'white', fontSize: '0.85rem', outline: 'none' },
    sidebarList: { flex: 1, overflowY: 'auto', padding: '1.5rem' },
    officerItem: (active) => ({
      padding: '1.25rem', marginBottom: '1rem', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: active ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.4)',
      border: active ? '1px solid #3b82f6' : '1px solid #1e293b',
      position: 'relative', overflow: 'hidden'
    }),
    officerName: (active) => ({ fontWeight: '900', color: active ? '#3b82f6' : '#f8fafc', fontSize: '1rem', letterSpacing: '-0.3px' }),
    officerMeta: { fontSize: '0.75rem', color: '#64748b', fontWeight: '700', marginTop: '0.2rem' },
    mainPanel: { background: 'rgba(15, 23, 42, 0.2)', borderRadius: '1.5rem', border: '1px solid #1e293b', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' },
    dossierHeader: { padding: '2.5rem', borderBottom: '1px solid #1e293b', background: 'linear-gradient(to right, rgba(2, 6, 23, 0.8), transparent)' },
    dossierTitle: { fontSize: '2.5rem', fontWeight: '950', color: '#f8fafc', margin: 0, letterSpacing: '-1.5px' },
    dossierBadge: { fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', fontWeight: '600' },
    dossierContent: { padding: '2.5rem' },
    sectionLabel: { fontSize: '0.65rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' },
    detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' },
    detailItem: { marginBottom: '0.75rem' },
    detailKey: { color: '#64748b', fontSize: '0.85rem', fontWeight: '800' },
    detailVal: { color: '#e2e8f0', fontSize: '1rem', fontWeight: '600', marginLeft: '0.5rem' },
    tag: { display: 'inline-block', background: '#3b82f622', color: '#3b82f6', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '900', marginRight: '0.5rem', border: '1px solid #3b82f644' },
    emptyState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '1.5rem', opacity: 0.5 },
    statRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2.5rem' },
    statItem: { textAlign: 'center', padding: '1.5rem', background: '#020617', borderRadius: '1.25rem', border: '1px solid #1e293b' },
    statNum: { fontSize: '2rem', fontWeight: '950', color: '#3b82f6', letterSpacing: '-1px' },
    statDesc: { fontSize: '0.65rem', color: '#64748b', fontWeight: '900', textTransform: 'uppercase', marginTop: '0.25rem' },
    fab: { position: 'absolute', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', background: '#3b82f6', color: 'white', border: 'none', boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)', cursor: 'pointer', fontSize: '1.8rem', fontWeight: '300', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }
  };

  useEffect(() => {
    let unsubscribe = null;
    const initPersonnel = async () => {
      setLoading(true);
      if (userDistrict) {
        try {
          unsubscribe = PersonnelService.subscribeToDistrictPersonnel(userDistrict, (data) => {
            setPersonnel(data || []);
            setLoading(false);
            if (!selectedOfficer && data && data.length > 0) setSelectedOfficer(data[0]);
          });
        } catch (error) {
          console.error("Failed to init personnel:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initPersonnel();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userDistrict]);

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    const officerData = {
      ...newOfficer, stationDistrict: userDistrict, stationName: userStation || 'District HQ',
      status: 'Available', cases: 0, solved: 0,
      specialization: newOfficer.specialization.split(',').map(s => s.trim()),
      joinDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      performance: { rating: 5.0, efficiency: 100 }
    };
    await PersonnelService.addPersonnel(officerData);
    setShowAddForm(false);
  };

  const filteredPersonnel = personnel.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) || (o.badgeNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || (o.status || '') === filterStatus;
    const matchSpec = filterSpec === 'all' || (o.specialization || []).includes(filterSpec);
    return matchSearch && matchStatus && matchSpec;
  });

  return (
    <div style={styles.container}>
      {/* Sidebar - Roster */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>Personnel Roster</h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '1rem', color: '#94a3b8' }}>{filteredPersonnel.length} / {personnel.length}</span>
          </div>
          <input style={styles.searchInput} placeholder="Search officer name or badge..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...styles.searchInput, padding: '0.5rem' }}>
              <option value="all">All status</option>
              <option value="Available">Available</option>
              <option value="On Duty">On Duty</option>
              <option value="On Patrol">On Patrol</option>
            </select>
            <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} style={{ ...styles.searchInput, padding: '0.5rem' }}>
              <option value="all">All roles</option>
              {[...new Set(personnel.flatMap(p => p.specialization || []))].filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={() => { const csv = 'Name,Rank,Badge,Status,Contact\n' + personnel.map(p => [p.name, p.rank, p.badgeNumber, p.status, p.contact].join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Roster_${new Date().toISOString().split('T')[0]}.csv`; a.click(); }} style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f644', borderRadius: '0.5rem', color: '#3b82f6', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem' }}>Export roster (CSV)</button>
        </div>
        <div style={styles.sidebarList}>
          {filteredPersonnel.map(officer => (
            <div key={officer.id} onClick={() => setSelectedOfficer(officer)} style={styles.officerItem(selectedOfficer?.id === officer.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={styles.officerName(selectedOfficer?.id === officer.id)}>{officer.name}</div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: (officer.cases || 0) >= 10 ? '#ef4444' : (officer.cases || 0) >= 5 ? '#f59e0b' : '#10b981',
                  boxShadow: `0 0 8px ${(officer.cases || 0) >= 10 ? '#ef4444' : (officer.cases || 0) >= 5 ? '#f59e0b' : '#10b981'}88`
                }} />
              </div>
              <div style={styles.officerMeta}>{officer.rank} • {officer.badgeNumber}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel - Dossier */}
      {selectedOfficer ? (
        <div style={styles.mainPanel}>
          <div style={styles.dossierHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={styles.dossierTitle}>{selectedOfficer.name}</h2>
                <div style={styles.dossierBadge}>{selectedOfficer.rank} • Badge #{selectedOfficer.badgeNumber}</div>
              </div>
              <div style={{ padding: '0.5rem 1rem', background: selectedOfficer.status === 'Available' ? '#dcfce7' : '#fee2e2', color: selectedOfficer.status === 'Available' ? '#166534' : '#991b1b', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>
                {selectedOfficer.status}
              </div>
            </div>
          </div>

          <div style={styles.dossierContent}>
            <div style={styles.sectionLabel}>Service Information</div>
            <div style={styles.detailGrid}>
              <div>
                <div style={styles.detailItem}><span style={styles.detailKey}>Station:</span> <span style={styles.detailVal}>{selectedOfficer.stationName}</span></div>
                <div style={styles.detailItem}><span style={styles.detailKey}>Contact:</span> <span style={styles.detailVal}>{selectedOfficer.contact}</span></div>
                <div style={styles.detailItem}><span style={styles.detailKey}>Email:</span> <span style={styles.detailVal}>{selectedOfficer.email}</span></div>
              </div>
              <div>
                <div style={styles.detailItem}><span style={styles.detailKey}>Joined:</span> <span style={styles.detailVal}>{selectedOfficer.joinDate}</span></div>
                <div style={{ marginTop: '0.5rem' }}>
                  {selectedOfficer.specialization?.map((spec, i) => (
                    <span key={i} style={styles.tag}>{spec}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.sectionLabel}>Officer Welfare Status</div>
            <div style={{
              padding: '1.5rem',
              background: '#0f172a',
              borderRadius: '1.25rem',
              border: '1px solid #1e293b',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <div style={{
                width: '12px',
                height: '60px',
                background: '#1e293b',
                borderRadius: '6px',
                padding: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <div style={{ flex: 1, background: (selectedOfficer.cases || 0) < 5 ? '#10b981' : '#1e293b', borderRadius: '4px' }} />
                <div style={{ flex: 1, background: ((selectedOfficer.cases || 0) >= 5 && (selectedOfficer.cases || 0) < 10) ? '#f59e0b' : '#1e293b', borderRadius: '4px' }} />
                <div style={{ flex: 1, background: (selectedOfficer.cases || 0) >= 10 ? '#ef4444' : '#1e293b', borderRadius: '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.9rem', color: (selectedOfficer.cases || 0) >= 10 ? '#ef4444' : (selectedOfficer.cases || 0) >= 5 ? '#f59e0b' : '#10b981' }}>
                    {(selectedOfficer.cases || 0) >= 10 ? 'CRITICAL WORKLOAD' : (selectedOfficer.cases || 0) >= 5 ? 'HIGH INTENSITY' : 'OPTIMAL LOAD'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '900' }}>STRESS INDEX: {((selectedOfficer.cases || 0) * 8.5).toFixed(1)}%</span>
                </div>
                <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (selectedOfficer.cases || 0) * 10)}%`, height: '100%', background: (selectedOfficer.cases || 0) >= 10 ? '#ef4444' : '#3b82f6' }} />
                </div>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
                  {(selectedOfficer.cases || 0) >= 10
                    ? "WARNING: Officer has exceeded standard case limits. Mandatory rest period recommended."
                    : "Welfare standards within acceptable operational parameters."}
                </p>
              </div>
            </div>

            <div style={styles.sectionLabel}>Performance Metrics</div>
            <div style={styles.statRow}>
              <div style={styles.statItem}>
                <div style={styles.statNum}>{selectedOfficer.cases}</div>
                <div style={styles.statDesc}>Total Cases</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNum}>{selectedOfficer.solved}</div>
                <div style={styles.statDesc}>Resolved</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNum}>{selectedOfficer.performance?.rating}</div>
                <div style={styles.statDesc}>Rating</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNum}>{selectedOfficer.performance?.efficiency}%</div>
                <div style={styles.statDesc}>Efficiency</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <div style={styles.sectionLabel}>Actions</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={async () => {
                    const nextRating = Math.min(5, (selectedOfficer.performance?.rating || 4.5) + 0.1).toFixed(1);
                    await PersonnelService.updatePersonnel(selectedOfficer.id, {
                      ...selectedOfficer,
                      performance: { ...selectedOfficer.performance, rating: parseFloat(nextRating) }
                    });
                    alert(`Performance review submitted for ${selectedOfficer.name}. New Rating: ${nextRating}`);
                  }}
                  style={{ padding: '0.6rem 1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Submit Review
                </button>
                <button
                  onClick={async () => {
                    const nextStatus = selectedOfficer.status === 'Available' ? 'On Duty' : selectedOfficer.status === 'On Duty' ? 'On Patrol' : 'Available';
                    await PersonnelService.updatePersonnel(selectedOfficer.id, { ...selectedOfficer, status: nextStatus });
                  }}
                  style={{ padding: '0.6rem 1.2rem', background: 'white', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    const data = `OFFICER DOSSIER\nName: ${selectedOfficer.name}\nRank: ${selectedOfficer.rank}\nBadge: ${selectedOfficer.badgeNumber}\nStatus: ${selectedOfficer.status}\nSolved Cases: ${selectedOfficer.solved}\nEfficiency: ${selectedOfficer.performance?.efficiency}%\nGenerated: ${new Date().toLocaleString()}`;
                    const blob = new Blob([data], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Dossier_${selectedOfficer.badgeNumber}.txt`;
                    a.click();
                  }}
                  style={{ padding: '0.6rem 1.2rem', background: 'white', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Download Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.mainPanel}>
          <div style={styles.emptyState}>
            <div style={{ fontSize: '3rem' }}>👮</div>
            <div>Select an officer to view dossier</div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button onClick={() => setShowAddForm(true)} style={styles.fab}>+</button>

      {/* Modal - Add Officer */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '450px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Register New Personnel</h3>
            <form onSubmit={handleCreateOfficer} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Full Name" value={newOfficer.name} onChange={e => setNewOfficer({ ...newOfficer, name: e.target.value })} required />
                <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Badge ID" value={newOfficer.badgeNumber} onChange={e => setNewOfficer({ ...newOfficer, badgeNumber: e.target.value })} required />
              </div>
              <select style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} value={newOfficer.rank} onChange={e => setNewOfficer({ ...newOfficer, rank: e.target.value })}>
                <option>Police Constable</option>
                <option>Head Constable</option>
                <option>Sub-Inspector</option>
                <option>Inspector</option>
              </select>
              <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Email Address" value={newOfficer.email} onChange={e => setNewOfficer({ ...newOfficer, email: e.target.value })} required />
              <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Contact Number" value={newOfficer.contact} onChange={e => setNewOfficer({ ...newOfficer, contact: e.target.value })} required />
              <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Specialization (comma sep)" value={newOfficer.specialization} onChange={e => setNewOfficer({ ...newOfficer, specialization: e.target.value })} />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: '#475569' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#2563eb', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: 'white', fontWeight: '600' }}>Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
