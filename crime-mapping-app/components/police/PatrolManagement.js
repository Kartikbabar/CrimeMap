// components/police/PatrolManagement.js
'use client';
import { useState, useEffect } from 'react';
import { PatrolService, PersonnelService } from '../../lib/firebase';

export default function PatrolManagement({ userRole, userDistrict, userStation }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [routeStatusFilter, setRouteStatusFilter] = useState('all');
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [assignOfficerId, setAssignOfficerId] = useState('');

  const [newRouteData, setNewRouteData] = useState({
    name: '', area: '', priority: 'Medium', startTime: '', endTime: '', vehicle: '',
    checkpointsText: 'Start Point, Mid Point, End Point'
  });

  const styles = {
    container: { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: '650px', fontFamily: "'Inter', sans-serif" },
    sidebar: { background: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' },
    sidebarHeader: { padding: '1.5rem', borderBottom: '1px solid #334155', background: 'rgba(51, 65, 85, 0.5)' },
    sidebarTitle: { margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' },
    sidebarList: { flex: 1, overflowY: 'auto', padding: '1rem' },
    routeItem: (active) => ({
      padding: '1rem', marginBottom: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
      background: active ? 'rgba(59, 130, 246, 0.1)' : '#0f172a', border: active ? '1px solid #3b82f6' : '1px solid #334155',
    }),
    routeTitle: (active) => ({ fontWeight: '700', color: active ? '#3b82f6' : '#f8fafc', marginBottom: '0.25rem' }),
    routeMeta: { fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' },
    statusTag: (status) => {
      const colors = { 'Active': '#10b981', 'Scheduled': '#f59e0b', 'Completed': '#94a3b8' };
      return { fontSize: '0.7rem', fontWeight: '800', color: colors[status] || '#94a3b8', background: `${colors[status] || '#94a3b8'}22`, padding: '0.1rem 0.5rem', borderRadius: '1rem' };
    },
    mainPanel: { background: '#0f172a', borderRadius: '1rem', border: '1px solid #334155', padding: '2rem', overflowY: 'auto' },
    detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #334155' },
    detailTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc', margin: 0 },
    detailSub: { color: '#94a3b8', marginTop: '0.5rem' },
    gridStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' },
    statBox: { background: '#1e293b', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #334155' },
    statLabel: { fontSize: '0.75rem', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase' },
    statVal: { fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', marginTop: '0.25rem' },
    sectionTitle: { fontSize: '1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem', marginTop: '2rem' },
    checkpointList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    checkpoint: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155' },
    cpStatus: (status) => ({ width: '12px', height: '12px', borderRadius: '50%', background: status === 'Completed' ? '#10b981' : status === 'Pending' ? '#334155' : '#f59e0b' }),
    actionButton: { padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },
    secondaryButton: { padding: '0.75rem 1.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '0.5rem', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', marginRight: '1rem' },
    emptyState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#334155', gap: '1rem' }
  };

  useEffect(() => {
    let unsubPatrols = null;
    let unsubPersonnel = null;
    if (userDistrict) {
      setLoading(true);
      unsubPatrols = PatrolService.subscribeToDistrictPatrols(userDistrict, (data) => {
        setRoutes(data);
        setLoading(false);
        setSelectedRoute(prev => {
          if (!prev && data.length > 0) return data[0];
          if (prev && data.length > 0) { const updated = data.find(r => r.id === prev.id); return updated || prev; }
          return prev;
        });
      });
      unsubPersonnel = PersonnelService.subscribeToDistrictPersonnel(userDistrict, (data) => setPersonnel(data || []));
    }
    return () => {
      if (unsubPatrols && typeof unsubPatrols === 'function') unsubPatrols();
      if (unsubPersonnel && typeof unsubPersonnel === 'function') unsubPersonnel();
    };
  }, [userDistrict]);

  const filteredRoutes = routeStatusFilter === 'all' ? routes : routes.filter(r => r.status === routeStatusFilter);

  const handleUpdateStatus = async () => {
    if (!selectedRoute) return;
    const nextStatus = selectedRoute.status === 'Scheduled' ? 'Active' : selectedRoute.status === 'Active' ? 'Completed' : 'Scheduled';
    try {
      await PatrolService.updatePatrol(selectedRoute.id, { ...selectedRoute, status: nextStatus });
      // Optimistic update locally
      setSelectedRoute(prev => ({ ...prev, status: nextStatus }));
      setRoutes(prev => prev.map(r => r.id === selectedRoute.id ? { ...r, status: nextStatus } : r));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedRoute) return;
    const report = `PATROL ROUTE REPORT\nRoute: ${selectedRoute.name}\nStatus: ${selectedRoute.status}\nVehicle: ${selectedRoute.vehicle}\nOfficers: ${selectedRoute.officers?.length || 0}\n\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Patrol_${selectedRoute.name.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    const names = (newRouteData.checkpointsText || 'Start Point, Mid Point, End Point').split(',').map(s => s.trim()).filter(Boolean);
    const checkpoints = names.map((name, i) => ({
      id: i + 1,
      name: name || `Checkpoint ${i + 1}`,
      status: 'Pending',
      time: i === 0 ? newRouteData.startTime : i === names.length - 1 ? newRouteData.endTime : 'Mid-shift'
    }));
    const patrol = {
      ...newRouteData,
      district: userDistrict,
      status: 'Scheduled',
      checkpoints: checkpoints.length ? checkpoints : [
        { id: 1, name: 'Start Point', status: 'Pending', time: newRouteData.startTime },
        { id: 2, name: 'Mid Point', status: 'Pending', time: 'Mid-shift' },
        { id: 3, name: 'End Point', status: 'Pending', time: newRouteData.endTime }
      ],
      officers: [],
      createdAt: new Date().toISOString()
    };
    await PatrolService.createPatrol(patrol);
    setShowCreateForm(false);
    setNewRouteData({ name: '', area: '', priority: 'Medium', startTime: '', endTime: '', vehicle: '', checkpointsText: 'Start Point, Mid Point, End Point' });
  };

  return (
    <div style={styles.container}>
      {/* Sidebar - List View */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={styles.sidebarTitle}>Patrol Routes</h3>
            <button onClick={() => setShowCreateForm(true)} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '1rem', cursor: 'pointer', fontWeight: '800' }}>+</button>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>{filteredRoutes.length} routes</div>
          <select value={routeStatusFilter} onChange={e => setRouteStatusFilter(e.target.value)} style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '0.8rem', width: '100%' }}>
            <option value="all">All status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div style={styles.sidebarList}>
          {filteredRoutes.map(route => (
            <div key={route.id} onClick={() => setSelectedRoute(route)} style={styles.routeItem(selectedRoute?.id === route.id)}>
              <div style={styles.routeTitle(selectedRoute?.id === route.id)}>{route.name}</div>
              <div style={styles.routeMeta}>
                <span>{route.vehicle}</span>
                <span style={styles.statusTag(route.status)}>{route.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel - Detail View */}
      {selectedRoute ? (
        <div style={styles.mainPanel}>
          <div style={styles.detailHeader}>
            <div>
              <h2 style={styles.detailTitle}>{selectedRoute.name}</h2>
              <div style={styles.detailSub}>Assigned to {selectedRoute.area} • {selectedRoute.vehicle}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: selectedRoute.status === 'Active' ? '#10b981' : '#94a3b8' }}>
                {selectedRoute.status.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '800' }}>Priority: {selectedRoute.priority}</div>
            </div>
          </div>

          <div style={styles.gridStats}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Start Time</div>
              <div style={styles.statVal}>{selectedRoute.startTime || '--:--'}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>End Time</div>
              <div style={styles.statVal}>{selectedRoute.endTime || '--:--'}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Officers</div>
              <div style={styles.statVal}>{selectedRoute.officers?.length || 0} Assigned</div>
            </div>
          </div>

          {/* Assign officer */}
          {personnel.length > 0 && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase' }}>Assign officer</span>
              <select value={assignOfficerId} onChange={e => setAssignOfficerId(e.target.value)} style={{ padding: '0.5rem 1rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', minWidth: '180px' }}>
                <option value="">Select...</option>
                {personnel.filter(p => !selectedRoute.officers?.some(o => o.id === p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.rank})</option>
                ))}
                {selectedRoute.officers?.length > 0 && personnel.filter(p => selectedRoute.officers?.some(o => o.id === p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.name} — assigned</option>
                ))}
              </select>
              <button
                onClick={async () => {
                  if (!assignOfficerId) return;
                  const officer = personnel.find(p => p.id === assignOfficerId);
                  const updated = { ...selectedRoute, officers: [...(selectedRoute.officers || []), { id: officer.id, name: officer.name, badgeNumber: officer.badgeNumber }] };
                  await PatrolService.updatePatrol(selectedRoute.id, updated);
                  setSelectedRoute(updated);
                  setAssignOfficerId('');
                }}
                style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}
              >Add</button>
            </div>
          )}
          {selectedRoute.officers?.length > 0 && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedRoute.officers.map((o, i) => (
                <span key={o.id || i} style={{ padding: '0.35rem 0.75rem', background: '#1e293b', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {o.name}
                  <button onClick={async () => { const next = selectedRoute.officers.filter((_, j) => j !== i); await PatrolService.updatePatrol(selectedRoute.id, { ...selectedRoute, officers: next }); setSelectedRoute({ ...selectedRoute, officers: next }); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          )}

          <h3 style={styles.sectionTitle}>Checkpoint Status</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <input value={newCheckpointName} onChange={e => setNewCheckpointName(e.target.value)} placeholder="New checkpoint name" style={{ padding: '0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', flex: 1, minWidth: '140px' }} />
            <button
              onClick={async () => {
                if (!newCheckpointName.trim()) return;
                const cps = [...(selectedRoute.checkpoints || [])];
                cps.push({ id: cps.length + 1, name: newCheckpointName.trim(), status: 'Pending', time: '—' });
                await PatrolService.updatePatrol(selectedRoute.id, { ...selectedRoute, checkpoints: cps });
                setSelectedRoute({ ...selectedRoute, checkpoints: cps });
                setNewCheckpointName('');
              }}
              style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}
            >Add checkpoint</button>
          </div>
          <div style={styles.checkpointList}>
            {selectedRoute.checkpoints?.map((cp, idx) => (
              <div key={idx} style={styles.checkpoint}>
                <div style={styles.cpStatus(cp.status)}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#f8fafc' }}>{cp.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Scheduled: {cp.time || cp.scheduled}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {selectedRoute.status === 'Active' && cp.status !== 'Completed' && (
                    <button
                      onClick={async () => {
                        const updatedCPs = [...selectedRoute.checkpoints];
                        updatedCPs[idx] = { ...cp, status: 'Completed', reachedAt: new Date().toLocaleTimeString() };
                        await PatrolService.updatePatrol(selectedRoute.id, { ...selectedRoute, checkpoints: updatedCPs });
                        setSelectedRoute({ ...selectedRoute, checkpoints: updatedCPs });
                      }}
                      style={{ padding: '0.25rem 0.5rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '800' }}
                    >
                      Mark Reached
                    </button>
                  )}
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: cp.status === 'Completed' ? '#10b981' : '#334155' }}>
                    {cp.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #334155' }}>
            <button onClick={handleGenerateReport} style={styles.secondaryButton}>Generate Report</button>
            <button onClick={handleUpdateStatus} style={styles.actionButton}>
              {selectedRoute.status === 'Scheduled' ? 'Start Patrol' : selectedRoute.status === 'Active' ? 'Complete Patrol' : 'Reset Status'}
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.mainPanel}>
          <div style={styles.emptyState}>
            <div style={{ fontSize: '3rem' }}>🚔</div>
            <div style={{ fontWeight: '800' }}>Select a patrol route to view details</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>

      {/* Modal for Creating Route */}
      {showCreateForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '400px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>New Patrol Assignment</h3>
            <form onSubmit={handleCreateRoute} style={{ display: 'grid', gap: '1rem' }}>
              <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Route Name" value={newRouteData.name} onChange={e => setNewRouteData({ ...newRouteData, name: e.target.value })} required />
              <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Area / Sector" value={newRouteData.area} onChange={e => setNewRouteData({ ...newRouteData, area: e.target.value })} required />
              <select style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} value={newRouteData.priority} onChange={e => setNewRouteData({ ...newRouteData, priority: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Vehicle Number" value={newRouteData.vehicle} onChange={e => setNewRouteData({ ...newRouteData, vehicle: e.target.value })} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="time" style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} value={newRouteData.startTime} onChange={e => setNewRouteData({ ...newRouteData, startTime: e.target.value })} required />
                <input type="time" style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} value={newRouteData.endTime} onChange={e => setNewRouteData({ ...newRouteData, endTime: e.target.value })} required />
              </div>
              <input style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }} placeholder="Checkpoints (comma-separated, e.g. Start, Market, End)" value={newRouteData.checkpointsText} onChange={e => setNewRouteData({ ...newRouteData, checkpointsText: e.target.value })} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateForm(false)} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: '#475569' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#2563eb', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: 'white', fontWeight: '600' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
