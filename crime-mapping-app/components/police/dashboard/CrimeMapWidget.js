'use client';
import { useEffect, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import { useMap } from 'react-leaflet';

// We load Leaflet on the client side only
let L;
if (typeof window !== 'undefined') {
    L = require('leaflet');
    require('leaflet.heat');
}

// Custom Premium SVG Marker with Pulse Effect
const createCustomIcon = (priority) => {
    const color = priority === 'High' ? '#ff3131' : priority === 'Medium' ? '#ff914d' : '#00b4d8';
    const svg = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.5); opacity: 0.3; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                .pulse-circle {
                    animation: pulse 2s ease-in-out infinite;
                    transform-origin: center;
                }
            </style>
            <circle class="pulse-circle" cx="20" cy="20" r="12" fill="${color}" fill-opacity="0.4"/>
            <circle cx="20" cy="20" r="8" fill="${color}" stroke="white" stroke-width="2"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
        </svg>
    `;
    return L.divIcon({
        html: svg,
        className: 'custom-crime-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

const HeatmapLayer = ({ firs, map }) => {
    useEffect(() => {
        if (!map || !firs.length || !L.heatLayer) return;

        const heatPoints = firs.map(fir => [
            fir.coordinates.lat,
            fir.coordinates.lng,
            fir.priority === 'High' ? 1.0 : fir.priority === 'Medium' ? 0.7 : 0.4
        ]);

        const heatLayer = L.heatLayer(heatPoints, {
            radius: 35,
            blur: 15,
            maxZoom: 18,
            minOpacity: 0.5,
            gradient: {
                0.4: '#00ffff', // Electric Cyan
                0.6: '#00ff00', // Neon Lime
                0.8: '#ffff00', // Bright Yellow
                1.0: '#ff0000'  // High-Intensity Red
            }
        }).addTo(map);

        return () => {
            if (map && heatLayer) map.removeLayer(heatLayer);
        };
    }, [map, firs]);

    return null;
};

const MapManager = ({ firs, isMapReady }) => {
    const map = useMap();
    useEffect(() => {
        if (isMapReady) {
            // Fix broken tiles by invalidating size on mount
            setTimeout(() => { map.invalidateSize(); }, 250);

            if (firs.length > 0 && firs[0].coordinates) {
                map.setView([firs[0].coordinates.lat, firs[0].coordinates.lng], 13);
            }
        }
    }, [isMapReady, map]);

    return null;
};

const CrimeMapWidget = ({ firs = [], district, viewType = 'markers' }) => {
    const [isClient, setIsClient] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const styles = {
        container: {
            width: '100%',
            height: '100%',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            background: '#0a0a0b',
            position: 'relative',
            border: '1px solid #1c1c1e'
        },
        overlay: {
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            zIndex: 1000,
            background: 'rgba(10, 10, 11, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.75rem',
            color: '#8e8e93',
            pointerEvents: 'none'
        }
    };

    if (!isClient) return <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e8e93' }}>Initiating Intelligence Map...</div>;

    const center = firs.length > 0 && firs[0].coordinates
        ? [firs[0].coordinates.lat, firs[0].coordinates.lng]
        : [19.0760, 72.8777];

    return (
        <div style={styles.container}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                ref={setMapInstance}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapManager firs={firs} isMapReady={!!mapInstance} />

                {viewType === 'markers' ? (
                    firs.map((fir, idx) => fir.coordinates && (
                        <Marker
                            key={fir.id || idx}
                            position={[fir.coordinates.lat, fir.coordinates.lng]}
                            icon={createCustomIcon(fir.priority)}
                        >
                            <Popup>
                                <div style={{
                                    padding: '0.5rem',
                                    minWidth: '200px',
                                    color: '#1c1c1e',
                                    fontFamily: 'Inter, sans-serif'
                                }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>{fir.firNumber}</div>
                                    <div style={{ color: '#eb445a', fontWeight: '600', fontSize: '0.85rem' }}>{fir.type}</div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>{fir.location}</div>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            background: '#f4f4f5',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem'
                                        }}>Priority: {fir.priority}</span>
                                        <span style={{ color: '#007bff', fontSize: '0.7rem', fontWeight: 'bold' }}>Intelligence Detected</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                ) : (
                    mapInstance && <HeatmapLayer firs={firs} map={mapInstance} />
                )}
            </MapContainer>

            {viewType === 'heatmap' && (
                <div style={styles.overlay}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Crime Density Layer</div>
                    <div style={{ height: '6px', width: '100%', background: 'linear-gradient(90deg, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000)', borderRadius: '3px', marginBottom: '0.25rem' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Low Intensity</span>
                        <span>Hotspot</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(CrimeMapWidget);
