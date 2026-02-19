'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { FIRService, CommunityAlertService } from '../../lib/firebase';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Comprehensive Maharashtra crime data
const maharashtraCrimeData = [
  // Mumbai - High Crime Density
  { id: 1, lat: 19.0760, lng: 72.8777, type: 'Robbery', severity: 'High', district: 'Mumbai', status: 'Under Investigation', date: '2024-01-15', intensity: 0.95 },
  { id: 2, lat: 19.0176, lng: 72.8561, type: 'Cyber Crime', severity: 'High', district: 'Mumbai', status: 'Case Filed', date: '2024-01-14', intensity: 0.90 },
  { id: 3, lat: 19.1073, lng: 72.8373, type: 'Assault', severity: 'High', district: 'Mumbai', status: 'Under Investigation', date: '2024-01-14', intensity: 0.85 },
  { id: 4, lat: 19.2183, lng: 72.9781, type: 'Theft', severity: 'Medium', district: 'Mumbai', status: 'Resolved', date: '2024-01-13', intensity: 0.80 },

  // Pune
  { id: 5, lat: 18.5204, lng: 73.8567, type: 'Vehicle Theft', severity: 'High', district: 'Pune', status: 'Under Investigation', date: '2024-01-15', intensity: 0.75 },
  { id: 6, lat: 18.5520, lng: 73.9470, type: 'Burglary', severity: 'Medium', district: 'Pune', status: 'Investigated', date: '2024-01-14', intensity: 0.70 },
  { id: 7, lat: 18.5060, lng: 73.8070, type: 'Domestic Violence', severity: 'High', district: 'Pune', status: 'Case Filed', date: '2024-01-13', intensity: 0.65 },

  // Nagpur
  { id: 8, lat: 21.1458, lng: 79.0882, type: 'Assault', severity: 'Medium', district: 'Nagpur', status: 'Under Investigation', date: '2024-01-15', intensity: 0.60 },
  { id: 9, lat: 21.1359, lng: 79.0750, type: 'Theft', severity: 'Medium', district: 'Nagpur', status: 'Resolved', date: '2024-01-14', intensity: 0.55 },

  // Thane
  { id: 10, lat: 19.2183, lng: 72.9781, type: 'Robbery', severity: 'High', district: 'Thane', status: 'Under Investigation', date: '2024-01-15', intensity: 0.70 },
  { id: 11, lat: 19.2572, lng: 73.1850, type: 'Fraud', severity: 'Medium', district: 'Thane', status: 'Investigated', date: '2024-01-14', intensity: 0.65 },

  // Nashik
  { id: 12, lat: 20.0059, lng: 73.7900, type: 'Vehicle Theft', severity: 'Medium', district: 'Nashik', status: 'Under Investigation', date: '2024-01-15', intensity: 0.50 },

  // Aurangabad
  { id: 13, lat: 19.8762, lng: 75.3433, type: 'Burglary', severity: 'Medium', district: 'Aurangabad', status: 'Case Filed', date: '2024-01-14', intensity: 0.45 },

  // Other districts
  { id: 14, lat: 17.6599, lng: 75.9064, type: 'Theft', severity: 'Low', district: 'Solapur', status: 'Resolved', date: '2024-01-13', intensity: 0.40 },
  { id: 15, lat: 16.7050, lng: 74.2433, type: 'Assault', severity: 'Low', district: 'Kolhapur', status: 'Under Investigation', date: '2024-01-15', intensity: 0.35 },
  { id: 16, lat: 19.6633, lng: 76.7794, type: 'Fraud', severity: 'Low', district: 'Amravati', status: 'Investigated', date: '2024-01-14', intensity: 0.30 },
];

// District-wise crime statistics
const districtStats = {
  'Mumbai': { total: 347, highRisk: 45, mediumRisk: 28, lowRisk: 12, trend: 'increasing' },
  'Pune': { total: 295, highRisk: 32, mediumRisk: 35, lowRisk: 18, trend: 'stable' },
  'Nagpur': { total: 128, highRisk: 15, mediumRisk: 22, lowRisk: 10, trend: 'increasing' },
  'Thane': { total: 215, highRisk: 28, mediumRisk: 25, lowRisk: 12, trend: 'decreasing' },
  'Nashik': { total: 142, highRisk: 18, mediumRisk: 20, lowRisk: 8, trend: 'stable' },
  'Aurangabad': { total: 118, highRisk: 12, mediumRisk: 18, lowRisk: 6, trend: 'increasing' },
};

// Heatmap Layer Component
function HeatmapLayer({ data, map }) {
  useEffect(() => {
    if (!map || !data.length) return;

    const heatPoints = data.map(crime => [
      crime.lat,
      crime.lng,
      crime.intensity
    ]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 20,
      maxZoom: 15,
      minOpacity: 0.4,
      max: 1.0,
      gradient: {
        0.2: 'blue',     // Low intensity
        0.4: 'cyan',     // Medium-low
        0.6: 'lime',     // Medium
        0.8: 'yellow',   // Medium-high
        1.0: 'red'       // High intensity
      }
    }).addTo(map);

    return () => {
      if (map && heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, data]);

  return null;
}

// Map Controller
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const AdvancedCrimeHeatmap = ({ userRole, userDistrict }) => {
  const [viewport, setViewport] = useState({
    center: [19.6633, 76.7794], // Maharashtra center
    zoom: 7
  });
  const [liveCrimes, setLiveCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('heatmap'); // 'heatmap' or 'points'
  const [crimeFilter, setCrimeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [areaReports, setAreaReports] = useState([]);
  const [showCommunityReports, setShowCommunityReports] = useState(true);
  const mapRef = useRef();
  const mapInstanceRef = useRef();

  useEffect(() => {
    const unsub = FIRService.subscribeToFIRs((firs) => {
      const formatted = firs.map(f => ({
        id: f.id,
        lat: f.coordinates?.lat || 19.0760, // Fallback to Mumbai
        lng: f.coordinates?.lng || 72.8777,
        type: f.type,
        severity: f.priority === 'Critical' ? 'High' : f.priority || 'Medium',
        district: f.district,
        status: f.status,
        date: f.registrationDate || f.createdAt,
        intensity: f.priority === 'Critical' ? 1.0 : f.priority === 'High' ? 0.8 : 0.5
      }));
      setLiveCrimes(formatted);
      setLoading(false);
    });
    const unsubArea = CommunityAlertService.subscribeToAllReports((reports) => {
      setAreaReports(reports);
    });

    return () => { unsub(); unsubArea(); };
  }, []);

  const handleMapReady = (map) => {
    mapInstanceRef.current = map;
  };

  // Filter crimes based on selections
  const getFilteredCrimes = () => {
    // Combine manual tactical data with live database data
    let filtered = [...maharashtraCrimeData, ...liveCrimes];

    // Filter by crime type
    if (crimeFilter !== 'all') {
      filtered = filtered.filter(crime =>
        crime.type.toLowerCase().includes(crimeFilter.toLowerCase())
      );
    }

    // Filter by time (last 7 days, 30 days, etc.)
    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      if (timeFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (timeFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      }

      filtered = filtered.filter(crime => new Date(crime.date) >= filterDate);
    }

    // Filter by user district for police
    if (userRole === 'police' && userDistrict) {
      filtered = filtered.filter(crime => crime.district === userDistrict);
    }

    return filtered;
  };

  const filteredCrimes = getFilteredCrimes();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Investigation': return '#ef4444';
      case 'Case Filed': return '#f59e0b';
      case 'Investigated': return '#3b82f6';
      case 'Resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskLevel = (district) => {
    const stats = districtStats[district];
    if (!stats) return 'low';

    const riskScore = (stats.highRisk * 3 + stats.mediumRisk * 2 + stats.lowRisk) / stats.total;
    if (riskScore > 2) return 'high';
    if (riskScore > 1.5) return 'medium';
    return 'low';
  };

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
      border: '1px solid #334155',
      color: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#f8fafc',
            marginBottom: '0.5rem'
          }}>
            Crime Intelligence Map
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            {userRole === 'police'
              ? `Monitoring crime activity in ${userDistrict || 'your district'}`
              : 'Public safety intelligence map'
            }
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '0.5rem',
            padding: '4px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setSelectedView('heatmap')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: selectedView === 'heatmap' ? '#2563eb' : 'transparent',
                color: selectedView === 'heatmap' ? 'white' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              Heatmap
            </button>
            <button
              onClick={() => setSelectedView('points')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: selectedView === 'points' ? '#2563eb' : 'transparent',
                color: selectedView === 'points' ? 'white' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              Points
            </button>
          </div>

          {/* Crime Type Filter */}
          <select
            value={crimeFilter}
            onChange={(e) => setCrimeFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#f1f5f9',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            <option value="all">All Crime Types</option>
            <option value="theft">Theft & Robbery</option>
            <option value="assault">Assault & Violence</option>
            <option value="cyber">Cyber Crime</option>
            <option value="vehicle">Vehicle Theft</option>
            <option value="burglary">Burglary</option>
            <option value="fraud">Fraud</option>
          </select>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#f1f5f9',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        height: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #334155',
        position: 'relative'
      }}>
        <MapContainer
          center={viewport.center}
          zoom={viewport.zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          ref={mapRef}
          whenReady={({ target }) => handleMapReady(target)}
        >
          <MapController center={viewport.center} zoom={viewport.zoom} />

          {/* Base Layers */}
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Tactical Dark Map">
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Command Center Map">
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Crime Heatmap">
              {selectedView === 'heatmap' && mapInstanceRef.current && (
                <HeatmapLayer data={filteredCrimes} map={mapInstanceRef.current} />
              )}
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Community Red Zones">
              <div style={{ display: 'none' }}>
                {/* Trigger for the circle markers below */}
              </div>
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Jurisdiction View">
              {Object.entries(MAHARASHTRA_DISTRICTS).map(([name, data]) => (
                <CircleMarker
                  key={name}
                  center={[data.lat, data.lng]}
                  radius={50}
                  color="#3b82f6"
                  weight={1}
                  fillOpacity={0.05}
                >
                  <Popup>
                    <strong>Jurisdiction: {name} District</strong><br />
                    Status: High Readiness
                  </Popup>
                </CircleMarker>
              ))}
            </LayersControl.Overlay>
          </LayersControl>

          {/* Heatmap Layer */}
          {selectedView === 'heatmap' && mapInstanceRef.current && (
            <HeatmapLayer data={filteredCrimes} map={mapInstanceRef.current} />
          )}

          {/* Individual Crime Points */}
          {selectedView === 'points' && filteredCrimes.map(crime => (
            <CircleMarker
              key={crime.id}
              center={[crime.lat, crime.lng]}
              radius={8}
              fillColor={getSeverityColor(crime.severity)}
              color={getSeverityColor(crime.severity)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
              eventHandlers={{
                click: () => setSelectedCrime(crime)
              }}
            >
              <Popup>
                <div style={{ minWidth: '250px' }}>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: getSeverityColor(crime.severity),
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}>
                    {crime.type}
                  </h3>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>District:</strong> {crime.district}
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Date:</strong> {new Date(crime.date).toLocaleDateString('en-IN')}
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Status:</strong>
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.2rem 0.5rem',
                      backgroundColor: getStatusColor(crime.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {crime.status}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getSeverityColor(crime.severity),
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {crime.severity} Risk
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Community Reported Red Zones */}
          {showCommunityReports && areaReports.map(report => (
            <CircleMarker
              key={report.id}
              center={[report.lat || 19.0760, report.lng || 72.8777]}
              radius={12}
              fillColor="#f59e0b"
              color="#f59e0b"
              weight={1}
              opacity={0.4}
              fillOpacity={0.2}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                    <strong style={{ color: '#f59e0b' }}>COMMUNITY CONCERN</strong>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>{report.type}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}> Landmark: {report.location}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px' }}>
                    "{report.description}"
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                    Reported by: {report.userName}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          border: '1px solid #334155',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <h4 style={{
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#f8fafc',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {selectedView === 'heatmap' ? 'Crime Density' : 'Crime Severity'}
          </h4>

          {selectedView === 'heatmap' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'linear-gradient(to right, blue, cyan, lime, yellow, orange, red)',
                  borderRadius: '4px'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                <span>Low</span>
                <span>High</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                <span>High Risk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
                <span>Medium Risk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                <span>Low Risk</span>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Panel */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          border: '1px solid #334155',
          zIndex: 1000,
          minWidth: '280px'
        }}>
          <h4 style={{
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#f8fafc'
          }}>
            📊 Crime Statistics
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '0.25rem' }}>Total Crimes Displayed</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
              {filteredCrimes.length}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.25rem' }}>High Risk</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>
                {filteredCrimes.filter(c => c.severity === 'High').length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.25rem' }}>Medium Risk</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>
                {filteredCrimes.filter(c => c.severity === 'Medium').length}
              </div>
            </div>
          </div>

          {userRole !== 'police' && (
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              fontSize: '12px',
              color: '#666'
            }}>
              <strong>Top Districts:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {Object.entries(districtStats)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .slice(0, 3)
                  .map(([district, stats]) => (
                    <div key={district} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>{district}</span>
                      <span style={{
                        color: getRiskLevel(district) === 'high' ? '#ef4444' :
                          getRiskLevel(district) === 'medium' ? '#f59e0b' : '#10b981',
                        fontWeight: '500'
                      }}>
                        {stats.total} crimes
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '1.25rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.5rem' }}>
            {filteredCrimes.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '500' }}>
            Crimes Displayed
          </div>
        </div>

        <div style={{
          backgroundColor: '#fef2f2',
          padding: '1.25rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
            {filteredCrimes.filter(c => c.severity === 'High').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '500' }}>
            High Priority Cases
          </div>
        </div>

        <div style={{
          backgroundColor: '#fffbeb',
          padding: '1.25rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.5rem' }}>
            {Array.from(new Set(filteredCrimes.map(c => c.district))).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: '500' }}>
            Affected Districts
          </div>
        </div>

        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '1.25rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
            {filteredCrimes.filter(c => c.status === 'Resolved').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
            Cases Resolved
          </div>
        </div>
      </div>

      {/* District Intelligence Panel */}
      {userRole !== 'police' && (
        <div style={{
          marginTop: '2rem',
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            📈 District Crime Intelligence
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(districtStats)
              .sort(([, a], [, b]) => b.total - a.total)
              .slice(0, 4)
              .map(([district, stats]) => (
                <div key={district} style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `2px solid ${getRiskLevel(district) === 'high' ? '#fecaca' :
                    getRiskLevel(district) === 'medium' ? '#fed7aa' : '#bbf7d0'
                    }`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {district}
                    </h4>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: getRiskLevel(district) === 'high' ? '#ef4444' :
                        getRiskLevel(district) === 'medium' ? '#f59e0b' : '#10b981',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getRiskLevel(district).toUpperCase()} RISK
                    </span>
                  </div>

                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                    {stats.total} crimes
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>
                    <span>🔴 {stats.highRisk} high</span>
                    <span>🟡 {stats.mediumRisk} medium</span>
                    <span>🟢 {stats.lowRisk} low</span>
                  </div>

                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: stats.trend === 'increasing' ? '#ef4444' :
                      stats.trend === 'decreasing' ? '#10b981' : '#f59e0b',
                    fontWeight: '500'
                  }}>
                    Trend: {stats.trend} {stats.trend === 'increasing' ? '📈' : stats.trend === 'decreasing' ? '📉' : '➡️'}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Crime Details Modal */}
      {selectedCrime && (
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
          zIndex: 10000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                Crime Case Details
              </h3>
              <button
                onClick={() => setSelectedCrime(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: getSeverityColor(selectedCrime.severity),
                color: 'white',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {selectedCrime.type}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <strong style={{ color: '#64748b' }}>District:</strong>
                <div style={{ color: '#1e293b', marginTop: '0.25rem' }}>{selectedCrime.district}</div>
              </div>

              <div>
                <strong style={{ color: '#64748b' }}>Date Reported:</strong>
                <div style={{ color: '#1e293b', marginTop: '0.25rem' }}>
                  {new Date(selectedCrime.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div>
                <strong style={{ color: '#64748b' }}>Status:</strong>
                <div style={{
                  display: 'inline-block',
                  marginTop: '0.25rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getStatusColor(selectedCrime.status),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {selectedCrime.status}
                </div>
              </div>

              <div>
                <strong style={{ color: '#64748b' }}>Risk Level:</strong>
                <div style={{
                  display: 'inline-block',
                  marginTop: '0.25rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getSeverityColor(selectedCrime.severity),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {selectedCrime.severity} Risk
                </div>
              </div>
            </div>

            {userRole === 'police' && (
              <div style={{
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>Police Actions</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Update Status
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Escalate Case
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Assign Officer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCrimeHeatmap;