'use client';
import { useState, useEffect } from 'react';
import { FIRService, PersonnelService, PatrolService } from '../../lib/firebase';

const AnalyticsDashboard = ({ userDistrict }) => {
  const [firs, setFirs] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [patrols, setPatrols] = useState([]);

  useEffect(() => {
    if (userDistrict) {
      const unsubFirs = FIRService.subscribeToDistrictFIRs(userDistrict, setFirs);
      const unsubPersonnel = PersonnelService.subscribeToDistrictPersonnel(userDistrict, setPersonnel);
      const unsubPatrols = PatrolService.subscribeToDistrictPatrols(userDistrict, setPatrols);

      return () => {
        unsubFirs();
        unsubPersonnel();
        unsubPatrols();
      };
    }
  }, [userDistrict]);

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1.5rem',
      fontFamily: "'Inter', sans-serif"
    },
    card: {
      background: '#161b22',
      borderRadius: '1rem',
      border: '1px solid #30363d',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.24)'
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#f0f6fc',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    statValue: (color) => ({
      fontSize: '2.5rem',
      fontWeight: '800',
      color: color || '#f59e0b',
      textShadow: `0 0 20px ${color}44`
    }),
    statLabel: {
      fontSize: '0.75rem',
      color: '#8b949e',
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: '1px'
    },
    barChart: {
      display: 'flex',
      alignItems: 'flex-end',
      height: '180px',
      gap: '1rem',
      padding: '1.5rem 0'
    },
    bar: (height, color) => ({
      flex: 1,
      height: `${height}%`,
      background: `linear-gradient(to top, ${color}, ${color}dd)`,
      borderRadius: '6px 6px 0 0',
      position: 'relative',
      boxShadow: `0 4px 12px ${color}33`,
      transition: 'all 0.4s ease'
    }),
    legend: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginTop: '1rem'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.8rem',
      color: '#8b949e'
    },
    indicator: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: color
    })
  };

  // Data processing
  const totalCases = firs.length;
  const highPriority = firs.filter(f => f.priority === 'High' || f.severity === 'High').length;
  const criticalCount = firs.filter(f => f.priority === 'Critical' || f.severity === 'Critical').length;
  const resolutionRate = totalCases > 0 ? Math.round((firs.filter(f => f.status === 'Resolved' || f.status === 'Closed').length / totalCases) * 100) : 0;
  const staleCases = firs.filter(f => f.status !== 'Resolved' && f.status !== 'Closed' && (new Date() - new Date(f.registrationDate || f.createdAt)) / (1000 * 60 * 60 * 24) >= 7);
  const activePatrolCount = patrols.filter(p => p.status === 'Active').length;

  const categories = {};
  firs.forEach(f => categories[f.type] = (categories[f.type] || 0) + 1);
  const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCat = Math.max(...sortedCats.map(c => c[1]), 1);

  const colors = {
    crime: '#ff4d4d',
    resolved: '#00ffa3',
    patrol: '#00d1ff',
    personnel: '#bd00ff',
    pending: '#ffb800',
    other: '#8b949e'
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Strategic Intelligence</h2>
          <p style={{ color: '#8b949e', margin: '0.5rem 0 0 0' }}>Real-time analytical breakdown for {userDistrict}</p>
        </div>
        <button
          onClick={() => {
            const report = `DISTRICT ANALYTICS REPORT — ${userDistrict}\nGenerated: ${new Date().toLocaleString()}\n\nTotal Incidents: ${totalCases}\nResolution Rate: ${resolutionRate}%\nActive Patrols: ${activePatrolCount}\nHigh Alerts: ${highPriority}\nCritical: ${criticalCount}\nStale Cases (7+ days): ${staleCases.length}\n\nCrime by type:\n${sortedCats.map(([n, c]) => `${n}: ${c}`).join('\n')}`;
            const blob = new Blob([report], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Analytics_${userDistrict}_${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
          }}
          style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #1f6feb, #388bfd)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(31, 111, 235, 0.4)' }}
        >
          📥 Export report
        </button>
      </div>

      <div style={styles.container}>
        {/* Core KPIs */}
        <div style={{ ...styles.card, gridColumn: '1 / -1', border: '1px solid #1f6feb66', background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={styles.statLabel}>Total Incidents</div>
              <div style={styles.statValue(colors.crime)}>{totalCases}</div>
            </div>
            <div>
              <div style={styles.statLabel}>Resolution Rate</div>
              <div style={styles.statValue(colors.resolved)}>{resolutionRate}%</div>
            </div>
            <div>
              <div style={styles.statLabel}>Active Patrols</div>
              <div style={styles.statValue(colors.patrol)}>{activePatrolCount}</div>
            </div>
            <div>
              <div style={styles.statLabel}>High Alerts</div>
              <div style={styles.statValue(colors.crime)}>{highPriority}</div>
            </div>
            <div>
              <div style={styles.statLabel}>Critical</div>
              <div style={styles.statValue('#ef4444')}>{criticalCount}</div>
            </div>
            <div>
              <div style={styles.statLabel}>Stale (7+ days)</div>
              <div style={styles.statValue(staleCases.length > 0 ? '#f59e0b' : '#8b949e')}>{staleCases.length}</div>
            </div>
          </div>
        </div>

        {/* Stale cases callout */}
        {staleCases.length > 0 && (
          <div style={{ ...styles.card, gridColumn: '1 / -1', border: '1px solid #f59e0b44', background: 'rgba(245, 158, 11, 0.06)' }}>
            <h3 style={{ ...styles.cardTitle, color: '#f59e0b' }}>⚠️ Stale cases (open 7+ days) — review recommended</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {staleCases.slice(0, 8).map(f => (
                <div key={f.id} style={{ padding: '0.75rem 1rem', background: '#0d1117', borderRadius: '0.5rem', border: '1px solid #30363d', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '700', color: '#c9d1d9' }}>{f.firNumber}</span>
                  <span style={{ color: '#8b949e', marginLeft: '0.5rem' }}>{f.type}</span>
                  <span style={{ color: '#f59e0b', marginLeft: '0.5rem', fontSize: '0.75rem' }}>{Math.floor((new Date() - new Date(f.registrationDate || f.createdAt)) / (1000 * 60 * 60 * 24))}d</span>
                </div>
              ))}
              {staleCases.length > 8 && <span style={{ color: '#8b949e', alignSelf: 'center' }}>+{staleCases.length - 8} more</span>}
            </div>
          </div>
        )}

        {/* Crime Categories - Multi Color */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📊 Crime Distribution</h3>
          <div style={styles.barChart}>
            {sortedCats.map(([name, count], i) => {
              const catColors = ['#ff4d4d', '#ffb800', '#00ffa3', '#00d1ff', '#bd00ff'];
              return (
                <div key={name} style={styles.bar((count / maxCat) * 100, catColors[i])}>
                  <div style={{ position: 'absolute', top: '-1.5rem', width: '100%', textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: catColors[i] }}>{count}</div>
                  <div style={{ position: 'absolute', bottom: '-2.5rem', width: '100%', textAlign: 'center', fontSize: '0.65rem', color: '#8b949e', whiteSpace: 'nowrap', transform: 'rotate(-45deg)', transformOrigin: 'top center' }}>{name}</div>
                </div>
              );
            })}
          </div>
          <div style={{ height: '2.5rem' }} />
        </div>

        {/* Resources Efficiency */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👮 Personnel Workload</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {personnel.slice(0, 4).map(p => {
              const workload = Math.round((p.cases || 0) * 10);
              return (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#c9d1d9' }}>{p.name}</span>
                    <span style={{ color: colors.personnel }}>{p.cases || 0} active</span>
                  </div>
                  <div style={{ height: '6px', background: '#30363d', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${workload}%`, height: '100%', background: `linear-gradient(90deg, #bd00ff, #00d1ff)`, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
            {personnel.length === 0 && <div style={{ textAlign: 'center', color: '#8b949e', padding: '1rem' }}>No personnel data</div>}
          </div>
        </div>

        {/* Performance Trends - Multi Axis Concept */}
        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <h3 style={styles.cardTitle}>📈 Fleet vs Crime Correlation</h3>
          <div style={{ height: '250px', position: 'relative', marginTop: '1rem' }}>
            <svg viewBox="0 0 1000 250" style={{ width: '100%', height: '100%' }}>
              {/* Crime Trend (Red) */}
              <polyline
                fill="none"
                stroke={colors.crime}
                strokeWidth="3"
                points="0,200 200,150 400,180 600,120 800,90 1000,100"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,77,77,0.4))' }}
              />
              {/* Patrol Trend (Blue) */}
              <polyline
                fill="none"
                stroke={colors.patrol}
                strokeWidth="3"
                points="0,220 200,210 400,150 600,140 800,80 1000,70"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,209,255,0.4))' }}
              />
              {/* Labels */}
              {[0, 200, 400, 600, 800, 1000].map((x, i) => (
                <text key={x} x={x} y="245" fill="#8b949e" fontSize="12" textAnchor="middle">W-{i + 1}</text>
              ))}
            </svg>
            <div style={styles.legend}>
              <div style={styles.legendItem}><div style={styles.indicator(colors.crime)}></div> Crime Incidence</div>
              <div style={styles.legendItem}><div style={styles.indicator(colors.patrol)}></div> Fleet Deployment</div>
            </div>
          </div>
        </div>

        {/* Officer Mastery Radar Breakdown (Mock representation) */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🎯 Unit Proficiency</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00ffa3', fontSize: '1.5rem', fontWeight: '800' }}>94%</div>
              <div style={{ color: '#8b949e', fontSize: '0.7rem', textTransform: 'uppercase' }}>Rapid Response</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#bd00ff', fontSize: '1.5rem', fontWeight: '800' }}>82%</div>
              <div style={{ color: '#8b949e', fontSize: '0.7rem', textTransform: 'uppercase' }}>Forensic Accuracy</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00d1ff', fontSize: '1.5rem', fontWeight: '800' }}>76%</div>
              <div style={{ color: '#8b949e', fontSize: '0.7rem', textTransform: 'uppercase' }}>Community Connect</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ffb800', fontSize: '1.5rem', fontWeight: '800' }}>88%</div>
              <div style={{ color: '#8b949e', fontSize: '0.7rem', textTransform: 'uppercase' }}>Legal Compliance</div>
            </div>
          </div>
        </div>

        {/* Real-time Logs Feed */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🕒 Operational Velocity</h3>
          <div style={{ fontSize: '0.85rem', color: '#8b949e' }}>
            <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Response Time</span>
              <span style={{ color: colors.resolved }}>8.4 mins</span>
            </div>
            <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between' }}>
              <span>Case Closing Velocity</span>
              <span style={{ color: colors.patrol }}>12.2 hrs</span>
            </div>
            <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between' }}>
              <span>Patrol Resource Usage</span>
              <span style={{ color: colors.pending }}>92% Over-capacity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
