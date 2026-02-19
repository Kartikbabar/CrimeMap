'use client';
import { useState, useEffect, useMemo } from 'react';
import { CollaborationService, DataSeedingService } from '../../lib/firebase';

// --- Sub-Component: Terminal Hologram ---
const TerminalHologram = () => (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', overflow: 'hidden', fontFamily: "'Courier New', monospace", fontSize: '0.6rem', color: '#3b82f6', lineHeight: 1.2 }}>
        {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="terminal-line">
                {`> MESH_UPLINK_READY [${Math.random().toString(16).substr(2, 8).toUpperCase()}] SCANNING_SECTOR_7G RESOLVING_STATION_UID_00${i}...`}
                <br />
                {`SIGNAL_STRENGTH: 99.9% | ENCRYPTION_LAYER: AES-4096-RSA | DIST_KEY_${i}`}
            </div>
        ))}
        <style jsx>{`
            .terminal-line { animation: scrollTerminal 15s linear infinite; white-space: nowrap; }
            @keyframes scrollTerminal { from { transform: translateY(0); } to { transform: translateY(-100%); } }
        `}</style>
    </div>
);

// --- Sub-Component: Advanced Node Mesh ---
const RegionalNodeMesh = ({ leadStation, collaborators = [] }) => {
    const nodes = useMemo(() => {
        const center = { x: 150, y: 150, label: leadStation, isLead: true };
        const orbit = collaborators.map((c, i) => {
            const angle = (i * 2 * Math.PI) / (collaborators.length || 1);
            return { x: 150 + 105 * Math.cos(angle), y: 150 + 105 * Math.sin(angle), label: c, isLead: false };
        });
        return [center, ...orbit];
    }, [leadStation, collaborators]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)' }}>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <filter id="meshGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {/* Links with pulse animation */}
                {nodes.slice(1).map((node, i) => (
                    <g key={i}>
                        <line x1={nodes[0].x} y1={nodes[0].y} x2={node.x} y2={node.y} stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" strokeDasharray="5 5" />
                        <circle r="2" fill="#3b82f6">
                            <animateMotion path={`M ${nodes[0].x} ${nodes[0].y} L ${node.x} ${node.y}`} dur="3s" repeatCount="indefinite" />
                        </circle>
                    </g>
                ))}
                {/* Visual Impact Rings */}
                <circle cx="150" cy="150" r="140" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="10 10" opacity="0.5">
                    <animate attributeName="r" values="130;145;130" dur="10s" repeatCount="indefinite" />
                </circle>
                {/* Nodes */}
                {nodes.map((node, i) => (
                    <g key={i}>
                        {node.isLead && (
                            <circle cx={node.x} cy={node.y} r="20" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.2">
                                <animate attributeName="r" values="15;30;15" dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
                            </circle>
                        )}
                        <circle cx={node.x} cy={node.y} r={node.isLead ? 10 : 6} fill={node.isLead ? '#3b82f6' : '#1e40af'} filter="url(#meshGlow)" />
                        <text x={node.x} y={node.y + (node.isLead ? 25 : 15)} fill="#94a3b8" fontSize="7" fontWeight="900" textAnchor="middle" style={{ letterSpacing: '1px' }}>{node.label?.toUpperCase()}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

const INTER_STATIONS = ['MUMBAI', 'THANE', 'PUNE', 'NAVI MUMBAI', 'KALYAN', 'NASHIK', 'AURANGABAD', 'NAGPUR'];
const NEXUS_STATUS_OPTIONS = ['Active Investigation', 'Awaiting Intel', 'Evidence Review', 'Trial Prep', 'Case Closed', 'Escalated'];
const SPECIALIST_TYPES = ['Forensic', 'Cyber', 'Narcotics', 'Crime Scene', 'Legal', 'Intelligence'];
const ASSET_TYPES = ['Vehicle', 'Equipment', 'Personnel', 'Document', 'Surveillance Feed'];

const InterStationNexus = ({ userDistrict, userData }) => {
    const [sharedCases, setSharedCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [activeTab, setActiveTab] = useState('intelligence');
    const [isConnecting, setIsConnecting] = useState(false);
    const [handshakeProgress, setHandshakeProgress] = useState(0);
    const [caseFilter, setCaseFilter] = useState('all'); // all | critical | recent
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteStation, setInviteStation] = useState('');
    const [specialistType, setSpecialistType] = useState('Forensic');
    const [assetType, setAssetType] = useState('Personnel');
    const [nexusStatus, setNexusStatus] = useState('');

    // Form States
    const [intelInput, setIntelInput] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [evidenceLabel, setEvidenceLabel] = useState('');
    const [evidenceType, setEvidenceType] = useState('Document');

    const district = userDistrict || 'MUMBAI';
    const userName = userData?.name || 'Officer';
    const userRank = userData?.rank || 'Inspector';

    useEffect(() => {
        if (district) {
            const unsub = CollaborationService.subscribeToSharedCases(district, (data) => {
                setSharedCases(data);
                if (data.length > 0 && !selectedCase) setSelectedCase(data[0]);
                else if (selectedCase) {
                    const up = data.find(c => c.id === selectedCase.id);
                    if (up) setSelectedCase(up);
                }
            });
            return () => unsub();
        }
    }, [district, selectedCase?.id]);

    const handleCaseSelect = (caseItem) => {
        setIsConnecting(true);
        setHandshakeProgress(0);
        const interval = setInterval(() => {
            setHandshakeProgress(p => {
                if (p >= 100) { clearInterval(interval); setSelectedCase(caseItem); setIsConnecting(false); return 100; }
                return p + 10;
            });
        }, 60);
    };

    const stats = useMemo(() => ({
        meshHealth: 100,
        syncRate: 48,
        activeUnits: 1 + (selectedCase?.sharedWith?.length || 0),
        threatLevel: selectedCase?.priority === 'Critical' ? 'RED' : 'BLUE'
    }), [selectedCase]);

    const filteredSharedCases = useMemo(() => {
        if (!sharedCases.length) return [];
        if (caseFilter === 'critical') return sharedCases.filter(c => c.priority === 'Critical' || c.broadcastSeverity === 'Critical');
        if (caseFilter === 'recent') return [...sharedCases].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
        return sharedCases;
    }, [sharedCases, caseFilter]);

    const styles = {
        container: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', height: 'calc(100vh - 120px)', background: '#020617', padding: '1rem', borderRadius: '2rem', color: '#f8fafc', overflow: 'hidden', border: '1px solid #1e293b', position: 'relative' },
        mainStage: { display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' },
        glassPanel: { background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '1.5rem', border: '1px solid #1e293b', padding: '2rem', position: 'relative', overflow: 'hidden' },
        input: { background: '#020617', border: '1px solid #334155', borderRadius: '1rem', padding: '1rem', color: 'white', fontSize: '0.85rem' },
        actionBtn: (bg) => ({ background: bg, border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', boxShadow: `0 4px 15px ${bg}44` })
    };

    const handleSendChat = async () => {
        if (!chatInput.trim() || !selectedCase) return;
        await CollaborationService.sendNexusMessage(selectedCase.id, {
            sender: userName,
            rank: userRank,
            text: chatInput,
            stationId: district
        });
        setChatInput('');
    };

    return (
        <div style={styles.container}>
            <TerminalHologram />

            <div style={styles.mainStage}>
                {/* Header Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {[
                        { label: 'UPLINK INTEGRITY', val: stats.meshHealth + '%', color: '#10b981' },
                        { label: 'ACTIVE NODES', val: stats.activeUnits, color: '#3b82f6' },
                        { label: 'SYNC LATENCY', val: stats.syncRate + 'ms', color: '#f59e0b' },
                        { label: 'THREAT VECTOR', val: stats.threatLevel, color: stats.threatLevel === 'RED' ? '#ef4444' : '#3b82f6' }
                    ].map((s, i) => (
                        <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '1.25rem', border: `1px solid ${s.color}22` }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: '900', color: '#64748b', letterSpacing: '1px' }}>{s.label}</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '950', color: s.color, marginTop: '0.2rem' }}>{s.val}</div>
                        </div>
                    ))}
                </div>

                {/* Primary Hub Area */}
                <div style={styles.glassPanel}>
                    {isConnecting && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.9)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="handshake-pulse" />
                            <div style={{ marginTop: '2rem', color: '#3b82f6', fontWeight: '900', letterSpacing: '2px' }}>INITIALIZING SECURE HANDSHAKE...</div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1.5px' }}>{selectedCase?.type || 'NO ACTIVE LINK'}</h2>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '700' }}>
                                <span>PROTOCOL: {selectedCase?.firNumber}</span>
                                <span style={{ color: '#3b82f6' }}>● REGIONAL_SYNC_ACTIVE</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setShowBroadcastModal(true)} disabled={!selectedCase} style={styles.actionBtn('rgba(245, 158, 11, 0.2)')}>📡 BROADCAST CASE</button>
                            <button onClick={() => setShowInviteModal(true)} disabled={!selectedCase} style={styles.actionBtn('rgba(16, 185, 129, 0.2)')}>➕ INVITE STATION</button>
                            {nexusStatus && (
                                <button onClick={async () => { if (!selectedCase) return; await CollaborationService.updateNexusStatus(selectedCase.id, nexusStatus); setNexusStatus(''); }} style={styles.actionBtn('#3b82f6')}>SET STATUS</button>
                            )}
                            <select value={nexusStatus} onChange={e => setNexusStatus(e.target.value)} style={{ ...styles.input, padding: '0.5rem 1rem', width: 'auto', minWidth: '160px' }}>
                                <option value="">Update nexus status...</option>
                                {NEXUS_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button onClick={async () => { await DataSeedingService.seedNexusData(district); alert("Regional Database Synchronized."); }} style={styles.actionBtn('rgba(59, 130, 246, 0.1)')}>REFRESH NETWORK</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 1fr', gap: '2rem', height: '300px' }}>
                        <div style={{ background: '#020617', borderRadius: '1.5rem', border: '1px solid #1e293b', overflow: 'hidden', boxShadow: 'inset 0 0 40px rgba(59, 130, 246, 0.1)' }}>
                            <RegionalNodeMesh leadStation={selectedCase?.district || 'MUMBAI'} collaborators={selectedCase?.sharedWith || []} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(2, 6, 23, 0.6)', borderRadius: '1.5rem', border: '1px solid #3b82f622', position: 'relative' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#3b82f6', marginBottom: '0.75rem' }}>COMMAND BRIEFING [LIVE]</div>
                                <div style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6' }}>{selectedCase?.description || 'Awaiting encrypted payload from lead station...'}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1, padding: '1rem', background: '#020617', border: '1px solid #1e293b', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>ENCRYPTION</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '900', color: '#10b981' }}>RSA-4096</div>
                                </div>
                                <div style={{ flex: 1, padding: '1rem', background: '#020617', border: '1px solid #1e293b', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.6rem', color: '#64748b' }}>UP-TIME</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '900', color: '#3b82f6' }}>99.98%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interaction Modules */}
                <div style={styles.glassPanel}>
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1e293b', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {['INTELLIGENCE', 'MIRRORS', 'COMMS', 'REQUESTS'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ background: 'transparent', border: 'none', color: activeTab === tab.toLowerCase() ? '#3b82f6' : '#64748b', padding: '1rem 0', fontWeight: '950', fontSize: '0.75rem', cursor: 'pointer', borderBottom: activeTab === tab.toLowerCase() ? '2px solid #3b82f6' : 'none' }}>{tab}</button>
                        ))}
                    </div>

                    <div style={{ minHeight: '350px' }}>
                        {activeTab === 'intelligence' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <textarea value={intelInput} onChange={e => setIntelInput(e.target.value)} placeholder="Broadcast tactical situation report..." style={{ ...styles.input, flex: 1, height: '70px', resize: 'none' }} />
                                    <button onClick={async () => { await CollaborationService.addCaseUpdate(selectedCase.id, { description: intelInput, officer: `${userRank} ${userName}`, stationId: district }); setIntelInput(''); }} style={styles.actionBtn('#3b82f6')}>BROADCAST</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedCase?.updates?.slice().reverse().map((u, i) => (
                                        <div key={i} style={{ padding: '1.25rem', background: '#020617', borderRadius: '1.25rem', borderLeft: '4px solid #3b82f6', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#10b981' }}>{u.officer} @ {u.stationId}</span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{u.time}</span>
                                            </div>
                                            <div style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{u.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'mirrors' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px', gap: '1rem' }}>
                                    <input value={evidenceLabel} onChange={e => setEvidenceLabel(e.target.value)} placeholder="Artifact Label (e.g. SIGINT-Kalyan)..." style={styles.input} />
                                    <select value={evidenceType} onChange={e => setEvidenceType(e.target.value)} style={styles.input}><option>Document</option><option>Image</option><option>Video</option></select>
                                    <button onClick={async () => { await CollaborationService.uploadEvidence(selectedCase.id, { label: evidenceLabel, type: evidenceType, uploadedBy: userName, district }); setEvidenceLabel(''); }} style={styles.actionBtn('#10b981')}>MIRROR DATA</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                    {selectedCase?.evidenceVault?.map((ev, i) => (
                                        <div key={i} style={{ padding: '1.5rem', background: '#020617', borderRadius: '1.5rem', border: '1px solid #1e293b', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{ev.type === 'Video' ? '📹' : '📄'}</div>
                                            <div style={{ fontWeight: '900' }}>{ev.label}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.5rem' }}>SOURCE: {ev.district}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'comms' && (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '400px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '1.5rem', padding: '1rem' }}>
                                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                                    {selectedCase?.nexusChat?.map((m, i) => (
                                        <div key={i} style={{ alignSelf: m.sender === userName ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                            <div style={{ fontSize: '0.6rem', color: '#64748b', marginBottom: '0.3rem', textAlign: m.sender === userName ? 'right' : 'left' }}>{m.rank} {m.sender} ({m.stationId})</div>
                                            <div style={{ background: m.sender === userName ? '#3b82f6' : '#1e293b', padding: '1rem', borderRadius: '1.25rem', fontSize: '0.9rem', color: 'white' }}>{m.text}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', background: '#020617', padding: '1rem', borderRadius: '1rem', border: '1px solid #1e293b' }}>
                                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendChat()} placeholder="Transmit secure signal..." style={{ ...styles.input, flex: 1, border: 'none' }} />
                                    <button onClick={handleSendChat} style={styles.actionBtn('#3b82f6')}>TRANSMIT</button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'requests' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ padding: '1.5rem', background: '#020617', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#f59e0b', marginBottom: '1rem' }}>REQUEST SPECIALIST</div>
                                        <select value={specialistType} onChange={e => setSpecialistType(e.target.value)} style={{ ...styles.input, width: '100%', marginBottom: '1rem' }}>
                                            {SPECIALIST_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <button onClick={async () => { if (!selectedCase) return; await CollaborationService.requestSpecialist(selectedCase.id, specialistType, district); alert(`Specialist (${specialistType}) request sent.`); }} style={styles.actionBtn('#f59e0b')}>SEND REQUEST</button>
                                    </div>
                                    <div style={{ padding: '1.5rem', background: '#020617', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#10b981', marginBottom: '1rem' }}>REQUEST ASSET</div>
                                        <select value={assetType} onChange={e => setAssetType(e.target.value)} style={{ ...styles.input, width: '100%', marginBottom: '1rem' }}>
                                            {ASSET_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                        <button onClick={async () => { if (!selectedCase) return; await CollaborationService.requestAsset(selectedCase.id, assetType, district); alert(`Asset (${assetType}) request logged.`); }} style={styles.actionBtn('#10b981')}>LOG REQUEST</button>
                                    </div>
                                </div>
                                <div style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '1rem', border: '1px solid #3b82f644' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#3b82f6', marginBottom: '0.75rem' }}>PENDING REQUESTS (this case)</div>
                                    {(selectedCase?.requestedAssets?.length > 0 || selectedCase?.specialistRequests?.length > 0) ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {selectedCase?.requestedAssets?.map((r, i) => <div key={'a'+i} style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Asset: {r.type} — {r.station} — {r.status}</div>)}
                                            {selectedCase?.specialistRequests?.map((r, i) => <div key={'s'+i} style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Specialist: {r.type} — {r.stationId}</div>)}
                                        </div>
                                    ) : <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No pending requests for this case.</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Triage Roster */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '950', color: '#64748b', letterSpacing: '2px' }}>REGIONAL TRIAGE</span>
                    <select value={caseFilter} onChange={e => setCaseFilter(e.target.value)} style={{ ...styles.input, padding: '0.4rem 0.75rem', fontSize: '0.7rem', width: 'auto' }}>
                        <option value="all">All cases</option>
                        <option value="critical">Critical only</option>
                        <option value="recent">Latest first</option>
                    </select>
                </div>
                <div className="scanning-visor" />
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredSharedCases.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                            No shared cases. Broadcast a case from FIR tab (share with region) to see it here.
                        </div>
                    ) : filteredSharedCases.map(c => (
                        <div key={c.id} onClick={() => handleCaseSelect(c)} style={{ padding: '1.5rem', background: selectedCase?.id === c.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.2)', border: `1px solid ${selectedCase?.id === c.id ? '#3b82f6' : '#1e293b'}`, borderRadius: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: c.priority === 'Critical' ? '#ef4444' : '#3b82f6' }}>{c.firNumber}</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b' }}>{c.district?.toUpperCase()}</span>
                            </div>
                            <div style={{ fontWeight: '950', fontSize: '1.1rem', color: '#f8fafc' }}>{c.type}</div>
                            {selectedCase?.id === c.id && handshakeProgress < 100 && (
                                <div style={{ height: '3px', width: '100%', background: '#0f172a', marginTop: '1rem', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${handshakeProgress}%`, background: '#3b82f6', transition: 'width 0.1s linear' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Broadcast Case Modal */}
            {showBroadcastModal && selectedCase && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500 }}>
                    <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #334155', width: '400px' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Broadcast case to region</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>{selectedCase.firNumber} — {selectedCase.type}</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setShowBroadcastModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#1e293b', border: 'none', borderRadius: '0.75rem', color: '#94a3b8', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
                            <button onClick={async () => { await CollaborationService.broadcastCase(selectedCase.id, selectedCase.priority === 'Critical' ? 'Critical' : 'High'); setShowBroadcastModal(false); alert('Case broadcast to region.'); }} style={{ flex: 1, padding: '0.75rem', background: '#f59e0b', border: 'none', borderRadius: '0.75rem', color: '#020617', cursor: 'pointer', fontWeight: '800' }}>Broadcast</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Station Modal */}
            {showInviteModal && selectedCase && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500 }}>
                    <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #334155', width: '400px' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Invite station to case</h3>
                        <select value={inviteStation} onChange={e => setInviteStation(e.target.value)} style={{ ...styles.input, width: '100%', marginBottom: '1rem' }}>
                            <option value="">Select station...</option>
                            {INTER_STATIONS.filter(s => s !== district).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => { setShowInviteModal(false); setInviteStation(''); }} style={{ flex: 1, padding: '0.75rem', background: '#1e293b', border: 'none', borderRadius: '0.75rem', color: '#94a3b8', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
                            <button onClick={async () => { if (!inviteStation) return; await CollaborationService.addCollaborator(selectedCase.id, inviteStation); setShowInviteModal(false); setInviteStation(''); alert(`Invited ${inviteStation} to case.`); }} style={{ flex: 1, padding: '0.75rem', background: '#10b981', border: 'none', borderRadius: '0.75rem', color: 'white', cursor: 'pointer', fontWeight: '800' }}>Invite</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .handshake-pulse { width: 80px; height: 80px; border: 4px solid #3b82f6; borderRadius: 50%; animation: pingHandshake 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
                @keyframes pingHandshake { 75%, 100% { transform: scale(2); opacity: 0; } }
                .scanning-visor { position: absolute; top: 30px; left: 0; width: 100%; height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent); opacity: 0.2; animation: visorScan 4s linear infinite; z-index: 5; pointer-events: none; }
                @keyframes visorScan { 0% { top: 30px; } 100% { top: 95%; } }
            `}</style>
        </div>
    );
};

export default InterStationNexus;
