'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function CrimeMap({ userRole }) {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [crimeType, setCrimeType] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  // Maharashtra boundary coordinates (simplified)
  const maharashtraBoundary = [
    [21.1466, 79.0886], // Nagpur area
    [20.5510, 78.8336],
    [19.7515, 75.7139], // Central Maharashtra
    [18.5204, 73.8567], // Pune
    [17.6599, 73.8063], // West coast
    [16.7050, 73.6866], // Konkan coast
    [15.5998, 73.7970],
    [15.8497, 74.4977],
    [16.8516, 74.5811],
    [17.6868, 75.9064], // Solapur
    [19.0760, 72.8777], // Mumbai
    [19.2183, 72.9781], // Thane
    [20.0059, 73.7900], // Nashik
    [21.1466, 79.0886]  // Back to Nagpur
  ];

  // Maharashtra districts data with precise coordinates
  const districts = [
    { 
      id: 'mumbai', 
      name: 'Mumbai City', 
      crimes: 347, 
      risk: 'high', 
      lat: 19.0760, 
      lng: 72.8777,
      population: '20.4M',
      topCrimes: ['Theft', 'Robbery', 'Cyber Crime']
    },
    { 
      id: 'thane', 
      name: 'Thane', 
      crimes: 189, 
      risk: 'high', 
      lat: 19.2183, 
      lng: 72.9781,
      population: '1.8M',
      topCrimes: ['Burglary', 'Vehicle Theft', 'Assault']
    },
    { 
      id: 'pune', 
      name: 'Pune', 
      crimes: 215, 
      risk: 'medium', 
      lat: 18.5204, 
      lng: 73.8567,
      population: '7.2M',
      topCrimes: ['Vehicle Theft', 'Fraud', 'Domestic Violence']
    },
    { 
      id: 'nagpur', 
      name: 'Nagpur', 
      crimes: 128, 
      risk: 'medium', 
      lat: 21.1458, 
      lng: 79.0882,
      population: '2.4M',
      topCrimes: ['Assault', 'Theft', 'Burglary']
    },
    { 
      id: 'nashik', 
      name: 'Nashik', 
      crimes: 95, 
      risk: 'low', 
      lat: 20.0059, 
      lng: 73.7900,
      population: '1.6M',
      topCrimes: ['Theft', 'Fraud']
    },
    { 
      id: 'aurangabad', 
      name: 'Aurangabad', 
      crimes: 87, 
      risk: 'low', 
      lat: 19.8762, 
      lng: 75.3433,
      population: '1.2M',
      topCrimes: ['Burglary', 'Assault']
    },
    { 
      id: 'solapur', 
      name: 'Solapur', 
      crimes: 76, 
      risk: 'low', 
      lat: 17.6599, 
      lng: 75.9064,
      population: '1.1M',
      topCrimes: ['Theft', 'Domestic Violence']
    },
    { 
      id: 'kolhapur', 
      name: 'Kolhapur', 
      crimes: 68, 
      risk: 'low', 
      lat: 16.7050, 
      lng: 74.2433,
      population: '0.9M',
      topCrimes: ['Fraud', 'Vehicle Theft']
    },
    { 
      id: 'ratnagiri', 
      name: 'Ratnagiri', 
      crimes: 45, 
      risk: 'low', 
      lat: 16.9944, 
      lng: 73.3000,
      population: '0.8M',
      topCrimes: ['Theft', 'Fraud']
    },
    { 
      id: 'amravati', 
      name: 'Amravati', 
      crimes: 52, 
      risk: 'low', 
      lat: 20.9374, 
      lng: 77.7796,
      population: '0.7M',
      topCrimes: ['Burglary', 'Assault']
    },
    { 
      id: 'latur', 
      name: 'Latur', 
      crimes: 48, 
      risk: 'low', 
      lat: 18.4088, 
      lng: 76.5604,
      population: '0.6M',
      topCrimes: ['Theft', 'Fraud']
    },
    { 
      id: 'jalna', 
      name: 'Jalna', 
      crimes: 42, 
      risk: 'low', 
      lat: 19.8348, 
      lng: 75.8816,
      population: '0.5M',
      topCrimes: ['Domestic Violence', 'Theft']
    }
  ];

  const crimeTypes = [
    'Theft', 'Robbery', 'Assault', 'Burglary', 'Fraud', 
    'Cyber Crime', 'Vehicle Theft', 'Domestic Violence'
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRadius = (crimeCount) => {
    return Math.max(12, Math.min(35, crimeCount / 12));
  };

  // Maharashtra center coordinates and bounds
  const maharashtraCenter = [19.7515, 76.7139];
  const mapZoom = 7;

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Maharashtra Crime Heatmap</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{ 
              padding: '0.5rem 1rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">All Districts</option>
            {districts.map(district => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>

          <select 
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            style={{ 
              padding: '0.5rem 1rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">All Crime Types</option>
            {crimeTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ 
              padding: '0.5rem 1rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div style={{ 
        height: '600px',
        borderRadius: '0.75rem',
        marginBottom: '2rem',
        overflow: 'hidden',
        border: '2px solid #e2e8f0',
        position: 'relative'
      }}>
        <MapContainer
          center={maharashtraCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          minZoom={6}
          maxZoom={10}
          maxBounds={[
            [15.0, 72.0], // Southwest corner
            [22.0, 81.0]  // Northeast corner
          ]}
          maxBoundsViscosity={1.0}
        >
          {/* Light theme tile layer for better visibility */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Maharashtra State Boundary */}
          <Polygon
            positions={maharashtraBoundary}
            pathOptions={{
              fillColor: '#f0f9ff',
              fillOpacity: 0.2,
              color: '#0ea5e9',
              weight: 3,
              opacity: 0.8
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0ea5e9' }}>
                  Maharashtra State
                </h3>
                <p style={{ margin: 0 }}>Total Population: ~120 Million</p>
                <p style={{ margin: 0 }}>Area: 307,713 km²</p>
              </div>
            </Popup>
          </Polygon>
          
          {/* Crime Heat Markers */}
          {districts.map(district => (
            <CircleMarker
              key={district.id}
              center={[district.lat, district.lng]}
              radius={getRadius(district.crimes)}
              fillColor={getRiskColor(district.risk)}
              color={getRiskColor(district.risk)}
              weight={2}
              opacity={0.9}
              fillOpacity={0.7}
            >
              <Tooltip permanent direction="center" className="custom-tooltip">
                <div style={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  color: '#1f2937',
                  fontSize: '11px',
                  textShadow: '1px 1px 2px white'
                }}>
                  {district.crimes}
                </div>
              </Tooltip>
              
              <Popup>
                <div style={{ minWidth: '220px' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: getRiskColor(district.risk),
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {district.name} District
                  </h3>
                  
                  <div style={{ 
                    backgroundColor: getRiskColor(district.risk) + '20',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '1.75rem', 
                        fontWeight: 'bold',
                        color: getRiskColor(district.risk),
                        marginBottom: '0.25rem'
                      }}>
                        {district.crimes}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Crimes Reported (30 Days)
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <strong>Risk Level:</strong>
                    </div>
                    <div>
                      <span style={{ 
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getRiskColor(district.risk),
                        color: 'white',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {district.risk.toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <strong>Population:</strong>
                    </div>
                    <div>{district.population}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Top Crime Types:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {district.topCrimes.map((crime, index) => (
                        <span 
                          key={index}
                          style={{
                            padding: '0.2rem 0.5rem',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          {crime}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {userRole === 'police' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        View Report
                      </button>
                      <button style={{
                        padding: '0.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        Patrol
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          zIndex: 1000,
          minWidth: '220px'
        }}>
          <h3 style={{ 
            marginBottom: '0.75rem', 
            fontSize: '1rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Maharashtra Crime Heatmap
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: '#ef4444', 
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              <div>
                <div style={{ fontWeight: '500' }}>High Risk</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>200+ crimes</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: '#f59e0b', 
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              <div>
                <div style={{ fontWeight: '500' }}>Medium Risk</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>100-199 crimes</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              <div>
                <div style={{ fontWeight: '500' }}>Low Risk</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>0-99 crimes</div>
              </div>
            </div>
          </div>
          <div style={{ 
            marginTop: '0.75rem', 
            paddingTop: '0.75rem', 
            borderTop: '1px solid #e5e7eb',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <div>• Larger circles = more crimes</div>
            <div>• Click districts for details</div>
          </div>
        </div>

        {/* Maharashtra State Info */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          fontSize: '0.875rem',
          zIndex: 1000,
          maxWidth: '200px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>Maharashtra State</div>
          <div style={{ marginBottom: '0.25rem' }}>• 12 Districts Shown</div>
          <div style={{ marginBottom: '0.25rem' }}>• Total Crimes: 1,394</div>
          <div style={{ marginBottom: '0.25rem' }}>• Period: Last 30 Days</div>
          <div>• Map restricted to state</div>
        </div>
      </div>

      {/* District Summary */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
          District Crime Summary
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {districts.slice(0, 6).map(district => (
            <div 
              key={district.id}
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: `2px solid ${getRiskColor(district.risk)}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontWeight: '600', color: '#1f2937', fontSize: '1rem' }}>{district.name}</h4>
                <span style={{ 
                  padding: '0.25rem 0.5rem',
                  backgroundColor: getRiskColor(district.risk),
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {district.crimes} crimes
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {district.topCrimes.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}