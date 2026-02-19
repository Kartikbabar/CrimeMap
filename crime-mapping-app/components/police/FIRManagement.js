// components/police/FIRManagement.js
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { FIRService, DataSeedingService, CollaborationService } from '../../lib/firebase';
import WorkingEvidenceSection from '../dashboard/WorkingEvidenceSection';

const FIRManagementSystem = ({ userRole = 'police', userDistrict, userStation, activeTab }) => {
  const [firs, setFirs] = useState([]);
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const initialFormState = {
    type: '', location: '', district: userDistrict || '', policeStation: userStation || '',
    victimName: '', accusedName: '', incidentDate: new Date().toISOString().split('T')[0], description: '', severity: 'Medium',
    moTags: '' // New MO Tags field
  };
  const [newFIR, setNewFIR] = useState(initialFormState);
  const [similarCases, setSimilarCases] = useState([]);
  const [isLinking, setIsLinking] = useState(false);
  const [showLinkageModal, setShowLinkageModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    let unsubscribe = null;
    if (activeTab !== 'fir') return;

    const initSubscription = () => {
      setLoading(true);
      if (userDistrict) {
        unsubscribe = FIRService.subscribeToDistrictFIRs(userDistrict, (data) => {
          setFirs(data);
          if (data && data.length > 0 && !selectedFIR) {
            setSelectedFIR(data[0]);
          }
          setLoading(false);
        });
      }
    };

    initSubscription();
    return () => unsubscribe && unsubscribe();
  }, [userDistrict, activeTab]);

  const handleUpdateFIR = async (updatedData) => {
    await FIRService.updateFIR(updatedData.id, updatedData);
    setSelectedFIR(updatedData);
  };

  const handleAddFIR = async (e) => {
    e.preventDefault();
    const firData = {
      ...newFIR,
      priority: newFIR.severity || newFIR.priority || 'Medium',
      firNumber: `FIR/${new Date().getFullYear()}/${firs.length + 100}`,
      registrationDate: new Date().toISOString(),
      status: 'Under Investigation',
      moTags: (newFIR.moTags || '').split(',').map(tag => tag.trim().toLowerCase()).filter(t => t),
      updates: [{ id: Date.now(), type: 'System', description: 'Case dossier initialized.', date: new Date().toISOString() }]
    };
    await FIRService.createFIR(firData);
    setIsAddModalOpen(false);
    setNewFIR(initialFormState);
  };

  const scanForLinkages = async (moTags) => {
    if (!moTags || moTags.length === 0) return;
    setIsLinking(true);
    try {
      const matches = await FIRService.findSimilarMO(moTags);
      setSimilarCases(matches.filter(c => c.id !== selectedFIR.id));
      setShowLinkageModal(true);
    } catch (e) { console.error(e); }
    setIsLinking(false);
  };

  const filtered = useMemo(() => {
    let list = firs.filter(f =>
      (f.firNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterStatus !== 'all') list = list.filter(f => (f.status || '') === filterStatus);
    if (filterPriority !== 'all') list = list.filter(f => (f.priority || f.severity) === filterPriority);
    return list;
  }, [firs, searchTerm, filterStatus, filterPriority]);

  const styles = {
    container: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem', height: 'calc(100vh - 120px)', background: '#020617', color: '#f8fafc', padding: '1rem', borderRadius: '2rem', overflow: 'hidden', border: '1px solid #1e293b' },
    sidebar: { background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    sidebarHeader: { padding: '1.5rem', borderBottom: '1px solid #1e293b', background: 'rgba(2, 6, 23, 0.6)' },
    searchInput: { width: '100%', padding: '0.75rem 1rem', background: '#020617', border: '1px solid #334155', borderRadius: '0.75rem', color: 'white', fontSize: '0.85rem', outline: 'none' },
    firCard: (active, priority) => {
      const borderGlow = priority === 'Critical' ? '#ef4444' : priority === 'High' ? '#f59e0b' : '#3b82f6';
      return {
        padding: '1.25rem', marginBottom: '1rem', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: active ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.4)',
        border: active ? `1px solid ${borderGlow}` : '1px solid #1e293b',
        boxShadow: active ? `0 0 20px ${borderGlow}22` : 'none',
        position: 'relative', overflow: 'hidden'
      };
    },
    mainPanel: { background: 'rgba(15, 23, 42, 0.2)', borderRadius: '1.5rem', border: '1px solid #1e293b', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' },
    header: { padding: '2.5rem', borderBottom: '1px solid #1e293b', background: 'linear-gradient(to right, rgba(2, 6, 23, 0.8), transparent)' },
    section: { padding: '1.5rem 2.5rem' },
    label: { fontSize: '0.65rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' },
    val: { fontSize: '1rem', fontWeight: '700', color: '#e2e8f0' },
    badge: (color) => ({ padding: '0.3rem 0.8rem', borderRadius: '0.5rem', background: `${color}22`, color, fontSize: '0.7rem', fontWeight: '900', border: `1px solid ${color}44` }),
    fab: { position: 'absolute', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', background: '#3b82f6', color: 'white', border: 'none', boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)', cursor: 'pointer', fontSize: '1.8rem', fontWeight: '300', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    actionBtn: { transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: 'none' }
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR: CASE ROSTER */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.5px' }}>CASE ROSTER</h3>
            <button
              onClick={async () => {
                if (window.confirm("CRITICAL: Purge all local FIRs, Patrols, and Personnel for " + userDistrict + "?")) {
                  setLoading(true);
                  try {
                    await DataSeedingService.purgeDistrictData(userDistrict);
                    await DataSeedingService.seedInitialData(userDistrict);
                  } catch (e) { console.error(e); }
                  setLoading(false);
                }
              }}
              style={{ fontSize: '0.6rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef444444', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '900' }}
            >
              HARD SYNC
            </button>
          </div>
          <input style={styles.searchInput} placeholder="Scan Case Signature..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...styles.searchInput, padding: '0.5rem' }}>
              <option value="all">All status</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ ...styles.searchInput, padding: '0.5rem' }}>
              <option value="all">All priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {filtered.map(fir => (
            <div key={fir.id} onClick={() => setSelectedFIR(fir)} style={styles.firCard(selectedFIR?.id === fir.id, fir.priority)}>
              {selectedFIR?.id === fir.id && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '3px', background: '#3b82f6' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#64748b' }}>{fir.firNumber}</span>
                <div style={styles.badge(fir.priority === 'Critical' ? '#ef4444' : fir.status === 'Closed' ? '#10b981' : '#3b82f6')}>{fir.status.toUpperCase()}</div>
              </div>
              <div style={{ margin: '0.75rem 0', fontWeight: '900', fontSize: '1rem', color: '#f8fafc' }}>{fir.type}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>📍 {fir.location?.split(',')[0]}</span>
                <span>📅 {new Date(fir.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN PANEL: CASE DOSSIER */}
      {selectedFIR ? (
        <div style={styles.mainPanel}>
          <div style={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', background: '#3b82f622', borderRadius: '0.75rem', border: '1px solid #3b82f644' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1px' }}>{selectedFIR.type} Case</h2>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '1rem', fontWeight: '600' }}>
                  DOSSIER ID: {selectedFIR.firNumber} • DISTRICT UPLINK: {selectedFIR.district?.toUpperCase()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => scanForLinkages(selectedFIR.moTags)}
                  disabled={isLinking || !selectedFIR.moTags}
                  style={{
                    ...styles.actionBtn,
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid #f59e0b44',
                    color: '#f59e0b',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                  {isLinking ? 'SCANNING...' : 'CASE LINKAGE radar'}
                  {selectedFIR.moTags?.length > 0 && <span style={{ marginLeft: '8px', background: '#f59e0b', color: '#020617', padding: '0.1rem 0.4rem', borderRadius: '0.4rem', fontSize: '0.65rem' }}>{selectedFIR.moTags.length}</span>}
                </button>
                <button onClick={() => alert("Digital Signature Block Generated")} style={{ ...styles.actionBtn, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f644', color: '#3b82f6', padding: '0.8rem 1.5rem', borderRadius: '0.75rem', fontWeight: '900', cursor: 'pointer' }}>AUTHENTICATE</button>
                <button
                  onClick={async () => { await CollaborationService.broadcastCase(selectedFIR.id, selectedFIR.priority || 'High'); handleUpdateFIR({ ...selectedFIR, isShared: true }); }}
                  style={{ ...styles.actionBtn, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b98144', color: '#10b981', padding: '0.8rem 1.5rem', borderRadius: '0.75rem', fontWeight: '900', cursor: 'pointer' }}
                >
                  SHARE TO NEXUS
                </button>
                <button
                  onClick={() => {
                    const data = `SENTINEL POLICE DOSSIER\nCASE: ${selectedFIR.firNumber}\nTYPE: ${selectedFIR.type}\nSTATUS: ${selectedFIR.status}`;
                    const blob = new Blob([data], { type: 'text/plain' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `DOSSIER_${selectedFIR.firNumber}.txt`;
                    a.click();
                  }}
                  style={{ ...styles.actionBtn, background: '#3b82f6', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '0.75rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
                >
                  GENERATE REPORT
                </button>
              </div>
            </div>
            {/* Quick status change */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 2.5rem 1rem', borderBottom: '1px solid #1e293b', flexWrap: 'wrap' }}>
              <span style={styles.label}>Quick status:</span>
              <select
                value={selectedFIR.status}
                onChange={async (e) => { const v = e.target.value; await handleUpdateFIR({ ...selectedFIR, status: v }); }}
                style={{ ...styles.searchInput, width: 'auto', minWidth: '180px', padding: '0.5rem 1rem' }}
              >
                <option value="Under Investigation">Under Investigation</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <span style={{ ...styles.label, marginLeft: '1rem' }}>Priority:</span>
              <select
                value={selectedFIR.priority || selectedFIR.severity || 'Medium'}
                onChange={async (e) => { const v = e.target.value; await handleUpdateFIR({ ...selectedFIR, priority: v }); }}
                style={{ ...styles.searchInput, width: 'auto', minWidth: '120px', padding: '0.5rem 1rem' }}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div style={styles.section}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', background: '#020617', borderRadius: '1.25rem', border: '1px solid #1e293b' }}>
                <div style={styles.label}>VITAL STATUS</div>
                <div style={{ ...styles.val, color: selectedFIR.status === 'Closed' ? '#10b981' : '#f59e0b' }}>{selectedFIR.status.toUpperCase()}</div>
              </div>
              <div style={{ padding: '1.25rem', background: '#020617', borderRadius: '1.25rem', border: '1px solid #1e293b' }}>
                <div style={styles.label}>PRIORITY LOAD</div>
                <div style={{ ...styles.val, color: selectedFIR.priority === 'Critical' ? '#ef4444' : '#3b82f6' }}>{selectedFIR.priority?.toUpperCase() || 'NORMAL'}</div>
              </div>
              <div style={{ padding: '1.25rem', background: '#020617', borderRadius: '1.25rem', border: '1px solid #1e293b' }}>
                <div style={styles.label}>STATION RADIUS</div>
                <div style={styles.val}>{selectedFIR.policeStation}</div>
              </div>
              <div style={{ padding: '1.25rem', background: '#020617', borderRadius: '1.25rem', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden' }}>
                <div style={styles.label}>TIME ELAPSED</div>
                <div style={styles.val}>{Math.floor((new Date() - new Date(selectedFIR.registrationDate)) / (1000 * 60 * 60 * 24))} DAYS</div>
                {Math.floor((new Date() - new Date(selectedFIR.registrationDate)) / (1000 * 60 * 60 * 24)) >= 7 && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '0.2rem 0.5rem', fontWeight: '900' }}>STAGNANT</div>
                )}
              </div>
            </div>

            {/* MO TAGS SECTION */}
            {selectedFIR.moTags?.length > 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {selectedFIR.moTags.map((tag, idx) => (
                  <span key={idx} style={{ background: '#1e293b', color: '#f59e0b', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '800', border: '1px solid #f59e0b33' }}>
                    # {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ ...styles.section, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ padding: '2rem', background: '#020617', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                <div style={styles.label}>INCIDENT CHRONICLE</div>
                <div style={{ fontSize: '1.1rem', color: '#e2e8f0', lineHeight: '1.7', fontWeight: '400' }}>{selectedFIR.description}</div>
              </div>

              <div>
                <div style={styles.label}>INVESTIGATION TIMELINE</div>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedFIR.updates?.slice().reverse().map((u, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                      {i !== selectedFIR.updates.length - 1 && <div style={{ position: 'absolute', left: '7px', top: '20px', bottom: '-15px', width: '2px', background: '#1e293b' }} />}
                      <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '50%', border: '4px solid #020617', zIndex: 1 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#f8fafc' }}>{u.description}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(u.date || u.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Protocol Managed By: {u.officer || u.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '1.5rem', border: '1px solid #ef444433' }}>
                <div style={{ ...styles.label, color: '#ef4444' }}>SUSPECT ENTITY</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: '#ef444422', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                  <div>
                    <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>{selectedFIR.accusedName || 'UNIDENTIFIED'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status: Person of Interest</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#020617', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                <div style={styles.label}>ASSIGNED PERSONNEL</div>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontWeight: '900', fontSize: '1rem' }}>{selectedFIR.assignedOfficer?.name || selectedFIR.assignedOfficer || 'DISTRICT HQ'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.2rem' }}>Badge: {selectedFIR.assignedOfficer?.badgeId || 'AUTH-2024'}</div>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <WorkingEvidenceSection selectedFIR={selectedFIR} onUpdateFIR={handleUpdateFIR} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...styles.mainPanel, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', opacity: 0.5 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'pulse 2s infinite' }}>📁</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748b' }}>SELECT DOSSIER TO INITIALIZE</div>
          </div>
        </div>
      )}

      <button onClick={() => setIsAddModalOpen(true)} style={styles.fab}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>

      {/* REMAINS FUNCTIONAL: REGISTRATION MODAL */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#0f172a', padding: '3rem', borderRadius: '2rem', width: '600px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '950', letterSpacing: '-1px' }}>INITIALIZE CASE</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Fill required parameters to create a new regional dossier.</p>
            </div>
            <form onSubmit={handleAddFIR} style={{ display: 'grid', gap: '1.5rem' }}>
              <select style={{ ...styles.searchInput, padding: '1rem' }} value={newFIR.type} onChange={e => setNewFIR({ ...newFIR, type: e.target.value })} required>
                <option value="">Select Protocol Type</option>
                <option value="Armed Robbery">Armed Robbery</option>
                <option value="Assault">Physical Assault</option>
                <option value="Cyber Heist">Cyber Intelligence Theft</option>
                <option value="Narcotics">Narcotics Traffic</option>
              </select>
              <select style={{ ...styles.searchInput, padding: '1rem' }} value={newFIR.severity} onChange={e => setNewFIR({ ...newFIR, severity: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <input style={{ ...styles.searchInput, padding: '1rem' }} placeholder="Primary Geo-Location" required value={newFIR.location} onChange={e => setNewFIR({ ...newFIR, location: e.target.value })} />
              <input style={{ ...styles.searchInput, padding: '1rem' }} type="date" value={newFIR.incidentDate} onChange={e => setNewFIR({ ...newFIR, incidentDate: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input style={{ ...styles.searchInput, padding: '1rem' }} placeholder="Victim name" value={newFIR.victimName} onChange={e => setNewFIR({ ...newFIR, victimName: e.target.value })} />
                <input style={{ ...styles.searchInput, padding: '1rem' }} placeholder="Accused / POI" value={newFIR.accusedName} onChange={e => setNewFIR({ ...newFIR, accusedName: e.target.value })} />
              </div>
              <input style={{ ...styles.searchInput, padding: '1rem' }} placeholder="Pattern Tags (e.g. night-entry, bike-used, armed) - comma separated" value={newFIR.moTags} onChange={e => setNewFIR({ ...newFIR, moTags: e.target.value })} />
              <textarea style={{ ...styles.searchInput, padding: '1rem', height: '120px', resize: 'none' }} placeholder="Case Situation Report (Sit-Rep)..." required value={newFIR.description} onChange={e => setNewFIR({ ...newFIR, description: e.target.value })} />
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, padding: '1rem', background: '#1e293b', border: 'none', borderRadius: '1rem', cursor: 'pointer', color: '#94a3b8', fontWeight: '800' }}>TERMINATE</button>
                <button type="submit" style={{ flex: 1, padding: '1rem', background: '#3b82f6', border: 'none', borderRadius: '1rem', cursor: 'pointer', color: 'white', fontWeight: '900', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>REGISTER CASE</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CASE LINKAGE MODAL */}
      {showLinkageModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '2rem', width: '800px', border: '1px solid #f59e0b44', boxShadow: '0 0 50px rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '950', color: '#f59e0b' }}>PATTERN MATCH DETECTED</h3>
                <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0' }}>The following cases across Maharashtra share similar 'Modus Operandi' signatures.</p>
              </div>
              <button onClick={() => setShowLinkageModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '2rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {similarCases.length > 0 ? similarCases.map(c => (
                <div key={c.id} style={{ padding: '1.5rem', background: '#020617', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#3b82f6', marginBottom: '0.5rem' }}>{c.firNumber} • {c.district.toUpperCase()}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f8fafc', marginBottom: '0.5rem' }}>{c.type}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {c.moTags?.map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.6rem', background: '#f59e0b22', color: '#f59e0b', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', border: '1px solid #f59e0b44' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No cross-district pattern matches found at this time.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default FIRManagementSystem;