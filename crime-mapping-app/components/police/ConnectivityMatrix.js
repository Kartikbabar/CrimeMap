'use client';
import { useState, useEffect } from 'react';
import { ConnectivityService } from '../../lib/firebase';

const ConnectivityMatrix = ({ userDistrict }) => {
    const [neighborStations, setNeighborStations] = useState([]);

    useEffect(() => {
        const unsub = ConnectivityService.subscribeToNeighboringStations(userDistrict, setNeighborStations);
        return () => unsub();
    }, [userDistrict]);

    const handleMutualAid = async (stationName) => {
        try {
            await ConnectivityService.requestMutualAid(stationName, 'GLOBAL-SYNC', userDistrict);
            alert(`Mutual Aid Request Pinned to ${stationName} Command Center.`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '1.5rem', border: '1px solid #1e293b', height: '100%', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#64748b', marginBottom: '1.5rem', letterSpacing: '2px', textAlign: 'center' }}>
                NEIGHBOR_CONNECTIVITY_MATRIX
            </div>

            {neighborStations.map((station, i) => (
                <div key={i} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '1rem', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#f8fafc' }}>{station.name.toUpperCase()}</div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{station.district.toUpperCase()} SECTOR</div>
                        </div>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: station.status === 'Active' ? '#10b981' : '#f59e0b',
                            boxShadow: `0 0 10px ${station.status === 'Active' ? '#10b981' : '#f59e0b'}`
                        }} />
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                            <span>FORCE STRENGTH</span>
                            <span>{station.forceStrength}%</span>
                        </div>
                        <div style={{ height: '4px', background: '#020617', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${station.forceStrength}%`, height: '100%', background: '#3b82f6' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                            <span>FLEET READINESS</span>
                            <span>{station.fleetReadiness}%</span>
                        </div>
                        <div style={{ height: '4px', background: '#020617', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${station.fleetReadiness}%`, height: '100%', background: '#10b981' }} />
                        </div>
                    </div>

                    <button
                        onClick={() => handleMutualAid(station.name)}
                        style={{
                            width: '100%',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid #3b82f644',
                            color: '#3b82f6',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        MUTUAL AID REQUEST
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ConnectivityMatrix;
