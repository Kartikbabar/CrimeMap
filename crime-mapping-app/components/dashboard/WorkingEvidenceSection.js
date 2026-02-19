// components/dashboard/WorkingEvidenceSection.js
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { storage, EvidenceLogService, FileService, auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

const WorkingEvidenceSection = ({ selectedFIR, onUpdateFIR }) => {
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [newEvidence, setNewEvidence] = useState({ type: '', description: '' });
  const [newUpdate, setNewUpdate] = useState({ type: '', description: '' });
  const { userData } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeLogEvidenceId, setActiveLogEvidenceId] = useState(null);
  const [custodyLogs, setCustodyLogs] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let unsub = null;
    if (activeLogEvidenceId) {
      unsub = EvidenceLogService.subscribeToLogs(activeLogEvidenceId, (logs) => {
        setCustodyLogs(logs);
      });
    }
    return () => unsub && unsub();
  }, [activeLogEvidenceId]);

  const logEvidenceAction = async (evidenceId, action) => {
    if (userData) {
      await EvidenceLogService.logAccess(evidenceId, selectedFIR.id, userData, action);
    }
  };

  // Add new evidence
  const handleAddEvidence = async (e) => {
    e.preventDefault();
    if (!newEvidence.type || !newEvidence.description) {
      alert('Please fill in all evidence fields');
      return;
    }

    let fileUrl = '';

    if (selectedFile) {
      setIsUploading(true);
      try {
        const uploadResult = await FileService.uploadFile(selectedFile, `evidence/${selectedFIR.id}`);
        fileUrl = uploadResult?.url || '';
      } catch (error) {
        alert('File upload failed: ' + error.message);
        setIsUploading(false);
        return;
      }
    }

    const evidenceItem = {
      id: Date.now(),
      type: newEvidence.type,
      description: newEvidence.description,
      fileUrl: fileUrl,
      fileName: selectedFile?.name || '',
      addedBy: 'You',
      addedDate: new Date().toISOString()
    };

    const updatedFIR = {
      ...selectedFIR,
      evidence: [
        ...(selectedFIR.evidence || []),
        evidenceItem
      ],
      updates: [
        ...(selectedFIR.updates || []),
        {
          id: Date.now() + 1,
          type: 'Evidence Added',
          description: `New evidence added: ${newEvidence.type}${selectedFile ? ` (${selectedFile.name})` : ''}`,
          officer: 'You',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    await onUpdateFIR(updatedFIR);
    await logEvidenceAction(evidenceItem.id, 'uploaded');
    setNewEvidence({ type: '', description: '' });
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setShowAddEvidenceModal(false);
  };

  // Add new case update
  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.type || !newUpdate.description) {
      alert('Please fill in all update fields');
      return;
    }

    const updatedFIR = {
      ...selectedFIR,
      updates: [
        ...(selectedFIR.updates || []),
        {
          id: Date.now(),
          type: newUpdate.type,
          description: newUpdate.description,
          officer: 'You',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    await onUpdateFIR(updatedFIR);
    setNewUpdate({ type: '', description: '' });
    setShowAddUpdateModal(false);
  };

  // Delete evidence
  const handleDeleteEvidence = async (evidenceId) => {
    if (!window.confirm('Are you sure you want to delete this evidence?')) return;

    const updatedFIR = {
      ...selectedFIR,
      evidence: (selectedFIR.evidence || []).filter(evidence => evidence.id !== evidenceId),
      updates: [
        ...(selectedFIR.updates || []),
        {
          id: Date.now(),
          type: 'Evidence Removed',
          description: 'Evidence item deleted from case',
          officer: 'You',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    await onUpdateFIR(updatedFIR);
  };

  // Delete update
  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;

    const updatedFIR = {
      ...selectedFIR,
      updates: (selectedFIR.updates || []).filter(update => update.id !== updateId)
    };

    await onUpdateFIR(updatedFIR);
  };

  const evidenceTypes = [
    'Photo Evidence',
    'Video Footage',
    'Audio Recording',
    'Written Statement',
    'Document',
    'Witness Statement',
    'CCTV Footage',
    'Weapon Recovery',
    'Forensic Report',
    'Other'
  ];

  const updateTypes = [
    'Investigation Progress',
    'Witness Interviewed',
    'Suspect Identified',
    'Suspect Arrested',
    'Property Recovered',
    'Court Hearing',
    'Case Status Change',
    'Other'
  ];

  const renderEvidencePreview = (item) => {
    if (!item.fileUrl) return null;

    const isImage = item.type.toLowerCase().includes('photo') || item.fileName.match(/\.(jpg|jpeg|png|gif)$/i);
    const isVideo = item.type.toLowerCase().includes('video') || item.fileName.match(/\.(mp4|webm)$/i);
    const isAudio = item.type.toLowerCase().includes('audio') || item.fileName.match(/\.(mp3|wav|ogg)$/i);

    if (isImage) return <img src={item.fileUrl} alt="Evidence" style={{ width: '100%', borderRadius: '4px', marginTop: '0.5rem' }} />;
    if (isVideo) return <video src={item.fileUrl} controls style={{ width: '100%', borderRadius: '4px', marginTop: '0.5rem' }} />;
    if (isAudio) return <audio src={item.fileUrl} controls style={{ width: '100%', marginTop: '0.5rem' }} />;

    return <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '0.8rem', display: 'block', marginTop: '0.5rem' }}>📎 View Document: {item.fileName}</a>;
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Evidence Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Evidence Collected</h4>
            <button
              onClick={() => setShowAddEvidenceModal(true)}
              style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              + Add Evidence
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedFIR.evidence?.map(item => (
              <div key={item.id} style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#10b981', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.type}</strong>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveLogEvidenceId(item.id)}
                      style={{ border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                    >
                      LOG
                    </button>
                    <button onClick={() => handleDeleteEvidence(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', margin: '0.75rem 0', color: '#f8fafc' }}>{item.description}</p>
                <div onClick={() => logEvidenceAction(item.id, 'viewed')}>
                  {renderEvidencePreview(item)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.75rem', fontWeight: '800' }}>
                  CERTIFIED ON: {new Date(item.addedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
            {(!selectedFIR.evidence || selectedFIR.evidence.length === 0) && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', border: '1px dashed #1e293b', borderRadius: '1rem' }}>
                No tactical evidence indexed.
              </div>
            )}
          </div>
        </div>

        {/* Updates Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '950', color: '#f8fafc' }}>CHRONO LOGS</h4>
            <button
              onClick={() => setShowAddUpdateModal(true)}
              style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f644', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '900' }}
            >
              + NEW LOG
            </button>
          </div>

          <div style={{
            background: '#020617',
            borderRadius: '1rem',
            border: '1px solid #1e293b',
            padding: '1.5rem',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.8rem',
            color: '#10b981',
            height: '300px',
            overflowY: 'auto',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }}>
            {selectedFIR.updates?.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)).map(update => (
              <div key={update.id} style={{ marginBottom: '1rem', opacity: 0.9 }}>
                <div style={{ color: '#3b82f6', fontWeight: '900', marginBottom: '0.2rem' }}>
                  [{update.date?.replace(/-/g, '/')} | {update.time}] AUTH_ID: {update.officer?.split(' ')[0].toUpperCase()}
                </div>
                <div>
                  <span style={{ color: '#f59e0b' }}>{'>'} {(update.type || 'EVENT').toUpperCase()}:</span> {update.description}
                </div>
                <div style={{ height: '1px', background: 'rgba(59, 130, 246, 0.1)', marginTop: '0.5rem' }} />
              </div>
            ))}
            <div style={{ animation: 'blink 1s infinite' }}>{'>'} AWAITING_UPSTREAM_MODS_</div>
          </div>
          <style jsx>{`
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          `}</style>
        </div>
      </div>

      {/* CHAIN OF CUSTODY LOG MODAL */}
      {activeLogEvidenceId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '1.5rem', width: '500px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#f8fafc' }}>⛓️ Chain of Custody</h3>
              <button onClick={() => setActiveLogEvidenceId(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {custodyLogs.map(log => (
                <div key={log.id} style={{ padding: '0.75rem', background: '#020617', borderRadius: '0.75rem', border: '1px solid #1e293b', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3b82f6', fontWeight: '900', fontSize: '0.7rem' }}>
                    <span>{log.action.toUpperCase()}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div style={{ color: '#f8fafc', marginTop: '0.25rem' }}>
                    Officer: {log.officerName} ({log.officerId})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidenceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '1.5rem', width: '90%', maxWidth: '500px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#f8fafc', fontWeight: '950' }}>Tactical Evidence Record</h3>
            <form onSubmit={handleAddEvidence}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Evidence Type</label>
                <select
                  required
                  value={newEvidence.type}
                  onChange={e => setNewEvidence({ ...newEvidence, type: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #334155', background: '#020617', color: 'white', outline: 'none' }}
                >
                  <option value="">Select protocol type</option>
                  {evidenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload File (Optional)</label>
                <input
                  type="file"
                  onChange={e => setSelectedFile(e.target.files[0])}
                  style={{ width: '100%' }}
                />
                {isUploading && (
                  <div style={{ marginTop: '0.5rem', height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#10b981', transition: 'width 0.2s', borderRadius: '2px' }}></div>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  required
                  rows="3"
                  value={newEvidence.description}
                  onChange={e => setNewEvidence({ ...newEvidence, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #334155', background: '#020617', color: 'white', resize: 'none', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddEvidenceModal(false)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #334155', borderRadius: '0.75rem', color: '#64748b', cursor: 'pointer', fontWeight: '800' }}>DISCARD</button>
                <button disabled={isUploading} type="submit" style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '900', opacity: isUploading ? 0.5 : 1 }}>
                  {isUploading ? 'SYNCHRONIZING...' : 'INDEX EVIDENCE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Update Modal */}
      {showAddUpdateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '1.5rem', width: '90%', maxWidth: '500px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#f8fafc', fontWeight: '950' }}>Append Case Chrono</h3>
            <form onSubmit={handleAddUpdate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Update Type</label>
                <select
                  required
                  value={newUpdate.type}
                  onChange={e => setNewUpdate({ ...newUpdate, type: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #334155', background: '#020617', color: 'white', outline: 'none' }}
                >
                  <option value="">Select update category</option>
                  {updateTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  required
                  rows="3"
                  value={newUpdate.description}
                  onChange={e => setNewUpdate({ ...newUpdate, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #334155', background: '#020617', color: 'white', resize: 'none', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddUpdateModal(false)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #334155', borderRadius: '0.75rem', color: '#64748b', cursor: 'pointer', fontWeight: '800' }}>CANCEL</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '900' }}>APPEND LOG</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingEvidenceSection;