'use client';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock crime data with district information
const crimes = [
  {
    id: 1,
    type: 'Vehicle Theft',
    location: 'Kothrud, Pune',
    district: 'Pune',
    lat: 18.5060,
    lng: 73.8070,
    date: '2024-01-15',
    status: 'Under Investigation',
    severity: 'High'
  },
  {
    id: 2,
    type: 'Burglary',
    location: 'Bandra West, Mumbai',
    district: 'Mumbai',
    lat: 19.0540,
    lng: 72.8340,
    date: '2024-01-14',
    status: 'Investigated',
    severity: 'Medium'
  },
  {
    id: 3,
    type: 'Assault',
    location: 'Nagpur Central',
    district: 'Nagpur',
    lat: 21.1458,
    lng: 79.0882,
    date: '2024-01-13',
    status: 'Case Filed',
    severity: 'High'
  },
  {
    id: 4,
    type: 'Theft',
    location: 'Thane Station',
    district: 'Thane',
    lat: 19.2183,
    lng: 72.9781,
    date: '2024-01-13',
    status: 'Resolved',
    severity: 'Medium'
  },
  {
    id: 5,
    type: 'Cyber Fraud',
    location: 'Hinjewadi, Pune',
    district: 'Pune',
    lat: 18.5920,
    lng: 73.7190,
    date: '2024-01-12',
    status: 'Under Investigation',
    severity: 'High'
  },
  {
    id: 6,
    type: 'Domestic Violence',
    location: 'Nashik Road',
    district: 'Nashik',
    lat: 20.0059,
    lng: 73.7900,
    date: '2024-01-12',
    status: 'Under Investigation',
    severity: 'High'
  },
  {
    id: 7,
    type: 'Robbery',
    location: 'Andheri East, Mumbai',
    district: 'Mumbai',
    lat: 19.1190,
    lng: 72.8740,
    date: '2024-01-11',
    status: 'Under Investigation',
    severity: 'High'
  },
  {
    id: 8,
    type: 'Fraud',
    location: 'Aurangabad City',
    district: 'Aurangabad',
    lat: 19.8762,
    lng: 75.3433,
    date: '2024-01-10',
    status: 'Investigated',
    severity: 'Medium'
  }
];

// District coordinates for Maharashtra
const districtCenters = {
  'Mumbai': [19.0760, 72.8777],
  'Pune': [18.5204, 73.8567],
  'Nagpur': [21.1458, 79.0882],
  'Thane': [19.2183, 72.9781],
  'Nashik': [20.0059, 73.7900],
  'Aurangabad': [19.8762, 75.3433],
  'Solapur': [17.6599, 75.9064],
  'Kolhapur': [16.7050, 74.2433]
};

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export default function CrimeMap({ userRole, userDistrict }) {
  const [userCoords, setUserCoords] = useState(null);
  const [mapView, setMapView] = useState('local'); // 'local' or 'state'
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const mapRef = useRef();

  // Detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserCoords(coords);
          detectUserDistrict(coords);
        },
        (error) => {
          // Default to Mumbai if location access denied
          const defaultCoords = [19.0760, 72.8777];
          setUserCoords(defaultCoords);
          setCurrentDistrict('Mumbai');
        }
      );
    }
  }, []);

  // Detect user's district from coordinates
  const detectUserDistrict = (coords) => {
    const [lat, lng] = coords;
    
    // Simple coordinate-based district detection
    if (lat > 18.9 && lat < 19.3 && lng > 72.7 && lng < 73.0) {
      setCurrentDistrict('Mumbai');
    } else if (lat > 18.4 && lat < 18.7 && lng > 73.7 && lng < 74.0) {
      setCurrentDistrict('Pune');
    } else if (lat > 20.9 && lat < 21.3 && lng > 78.9 && lng < 79.3) {
      setCurrentDistrict('Nagpur');
    } else if (lat > 19.1 && lat < 19.4 && lng > 72.9 && lng < 73.1) {
      setCurrentDistrict('Thane');
    } else if (lat > 19.8 && lat < 20.2 && lng > 73.6 && lng < 74.0) {
      setCurrentDistrict('Nashik');
    } else {
      setCurrentDistrict('Mumbai'); // Default fallback
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const getDistance = (coord1, coord2) => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter crimes based on user role and current view
  const getFilteredCrimes = () => {
    if (userRole === 'police') {
      // Police only see crimes in their assigned district
      const policeDistrict = userDistrict || currentDistrict;
      return crimes.filter(crime => crime.district === policeDistrict);
    } else if (mapView === 'local' && userCoords) {
      // Citizens see crimes within 50km radius when in local view
      return crimes.filter(crime => 
        getDistance(userCoords, [crime.lat, crime.lng]) <= 50
      );
    } else {
      // Show all Maharashtra crimes when in state view
      return crimes;
    }
  };

  const getRiskColor = (severity) => {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRadius = (severity) => {
    switch (severity) {
      case 'High': return 12;
      case 'Medium': return 10;
      case 'Low': return 8;
      default: return 8;
    }
  };

  const getMapCenter = () => {
    if (mapView === 'local' && userCoords) {
      return userCoords;
    } else if (userRole === 'police' && userDistrict) {
      return districtCenters[userDistrict] || [19.7515, 75.7139];
    } else {
      return [19.7515, 75.7139]; // Maharashtra center
    }
  };

  const getMapZoom = () => {
    if (mapView === 'local') return 11;
    if (userRole === 'police') return 10;
    return 7; // State view
  };

  const filteredCrimes = getFilteredCrimes();

  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9'
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
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            {userRole === 'police' ? 'Police Crime Map' : 'Crime Heatmap'}
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            {userRole === 'police' 
              ? `Showing crimes in ${userDistrict || currentDistrict || 'your area'}`
              : mapView === 'local' 
                ? 'Showing crimes near your location (50km radius)'
                : 'Showing all crimes across Maharashtra'
            }
          </p>
        </div>

        {/* View Toggle for Citizens */}
        {userRole === 'citizen' && (
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            padding: '4px'
          }}>
            <button
              onClick={() => setMapView('local')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: mapView === 'local' ? '#3b82f6' : 'transparent',
                color: mapView === 'local' ? 'white' : '#64748b',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              My Area
            </button>
            <button
              onClick={() => setMapView('state')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: mapView === 'state' ? '#3b82f6' : 'transparent',
                color: mapView === 'state' ? 'white' : '#64748b',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              Maharashtra
            </button>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div style={{ 
        height: '500px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid #e2e8f0',
        position: 'relative'
      }}>
        <MapContainer
          center={getMapCenter()}
          zoom={getMapZoom()}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <MapController center={getMapCenter()} zoom={getMapZoom()} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          {userCoords && mapView === 'local' && (
            <CircleMarker
              center={userCoords}
              radius={8}
              fillColor="#3b82f6"
              color="#1d4ed8"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong>Your Location</strong>
                  <br />
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {currentDistrict || 'Current area'}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          )}
          
          {/* Crime Markers */}
          {filteredCrimes.map(crime => (
            <CircleMarker
              key={crime.id}
              center={[crime.lat, crime.lng]}
              radius={getRadius(crime.severity)}
              fillColor={getRiskColor(crime.severity)}
              color={getRiskColor(crime.severity)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Tooltip permanent direction="center" className="custom-tooltip">
                <div style={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  color: '#1f2937',
                  fontSize: '10px',
                  textShadow: '1px 1px 2px white'
                }}>
                  {crime.type.split(' ')[0]}
                </div>
              </Tooltip>
              
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: getRiskColor(crime.severity),
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}>
                    {crime.type}
                  </h3>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Location:</strong> {crime.location}
                  </div>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>District:</strong> {crime.district}
                  </div>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Date:</strong> {new Date(crime.date).toLocaleDateString('en-IN')}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: getRiskColor(crime.severity),
                      color: 'white',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {crime.severity}
                    </span>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {crime.status}
                    </span>
                  </div>
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
          minWidth: '180px'
        }}>
          <h3 style={{ 
            marginBottom: '0.75rem', 
            fontSize: '0.875rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Crime Severity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#ef4444', 
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              <span>High Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#f59e0b', 
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              <span>Medium Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              <span>Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.25rem' }}>
            {filteredCrimes.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '500' }}>
            Total Crimes
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.25rem' }}>
            {filteredCrimes.filter(c => c.severity === 'High').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '500' }}>
            High Risk
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#fffbeb',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.25rem' }}>
            {filteredCrimes.filter(c => c.severity === 'Medium').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: '500' }}>
            Medium Risk
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.25rem' }}>
            {filteredCrimes.filter(c => c.severity === 'Low').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
            Low Risk
          </div>
        </div>
      </div>
    </div>
  );
}