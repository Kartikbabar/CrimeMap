'use client';
import { useState, useEffect } from 'react';
import { BOLOService } from '../../lib/firebase';

const GlobalBOLOTicker = ({ userData }) => {
    const [bolos, setBolos] = useState([]);
    const district = userData?.district || 'MUMBAI';
    const officerName = userData?.name || 'Officer';

    useEffect(() => {
        const unsub = BOLOService.subscribeToActiveBOLOs(setBolos);
        return () => unsub();
    }, []);

    const handleIntercept = async (boloId) => {
        try {
            await BOLOService.interceptBOLO(boloId, district, officerName);
            alert("BOLO Intercepted. Lead claim registered for " + district + " station.");
        } catch (e) {
            console.error(e);
        }
    };

    if (bolos.length === 0) return null;

    return (
        <div style={{
            background: '#ef4444',
            color: 'white',
            height: '40px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '2px solid #b91c1c',
            zIndex: 1100
        }}>
            <div style={{
                background: '#b91c1c',
                padding: '0 1rem',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '900',
                fontSize: '0.7rem',
                letterSpacing: '2px',
                zIndex: 2,
                boxShadow: '10px 0 20px rgba(0,0,0,0.3)'
            }}>
                STATE-WIDE BOLO
            </div>

            <div className="marquee-container" style={{
                flex: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                display: 'flex'
            }}>
                <div style={{
                    display: 'inline-flex',
                    animation: 'marquee 30s linear infinite',
                    paddingLeft: '100%'
                }}>
                    {bolos.map((bolo, i) => (
                        <div key={bolo.id} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginRight: '4rem',
                            fontSize: '0.85rem',
                            fontWeight: '700'
                        }}>
                            <span style={{ background: 'white', color: '#ef4444', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', marginRight: '1rem' }}>
                                {bolo.type.toUpperCase()}
                            </span>
                            {bolo.details} ({bolo.district.toUpperCase()})
                            <button
                                onClick={() => handleIntercept(bolo.id)}
                                style={{
                                    marginLeft: '1rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid white',
                                    color: 'white',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.65rem',
                                    fontWeight: '900'
                                }}
                            >
                                INTERCEPT
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .marquee-container:hover div {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default GlobalBOLOTicker;
