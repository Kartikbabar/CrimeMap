'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CrimeMap from '../../components/dashboard/CrimeMap';
import StatsOverview from '../../components/dashboard/StatsOverview';
import RecentReports from '../../components/dashboard/RecentReports';
import FIRManagement from '../../components/police/FIRManagement';
import PatrolManagement from '../../components/police/PatrolManagement';
import AnalyticsDashboard from '../../components/police/AnalyticsDashboard';
import PersonnelManagement from '../../components/police/PersonnelManagement';

export default function Dashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userDistrict, setUserDistrict] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Mock police station assignments
  useEffect(() => {
    if (userData?.role === 'police') {
      // Assign police to specific districts
      const policeStations = {
        'police-mumbai@example.com': 'Mumbai',
        'police-pune@example.com': 'Pune',
        'police-nagpur@example.com': 'Nagpur',
        'police-thane@example.com': 'Thane'
      };
      setUserDistrict(policeStations[user.email] || 'Mumbai');
    }
  }, [userData, user]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const policeTabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'map', name: 'Crime Map', icon: '🗺️' },
    { id: 'fir', name: 'FIR Management', icon: '📋' },
    { id: 'patrol', name: 'Patrol Routes', icon: '🚔' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'personnel', name: 'Personnel', icon: '👮' }
  ];

  const citizenTabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'map', name: 'Crime Map', icon: '🗺️' }
  ];

  const tabs = userData?.role === 'police' ? policeTabs : citizenTabs;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-content">
            <StatsOverview userRole={userData?.role} userDistrict={userDistrict} />
            <RecentReports userRole={userData?.role} userDistrict={userDistrict} />
          </div>
        );
      case 'map':
        return <CrimeMap userRole={userData?.role} userDistrict={userDistrict} />;
      case 'fir':
        return <FIRManagement userDistrict={userDistrict} />;
      case 'patrol':
        return <PatrolManagement userDistrict={userDistrict} />;
      case 'analytics':
        return <AnalyticsDashboard userDistrict={userDistrict} />;
      case 'personnel':
        return <PersonnelManagement userDistrict={userDistrict} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        {/* Header */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="dashboard-title">
                {userData?.role === 'police' ? 'Police Command Center' : 'Citizen Dashboard'}
              </h1>
              <p className="dashboard-subtitle">
                {userData?.role === 'police' 
                  ? `Maharashtra Police - ${userDistrict || 'Your Station'}`
                  : 'Maharashtra Crime Awareness System'
                }
              </p>
            </div>
            
            {/* Police Badge */}
            {userData?.role === 'police' && (
              <div style={{
                backgroundColor: '#1e40af',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                minWidth: '200px'
              }}>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Logged in as</div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {userData?.rank || 'Police Officer'}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  Station: {userDistrict || 'Loading...'}
                </div>
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '0.5rem'
          }}>
            <div>
              <strong>Welcome, {userData?.fullName || user.email}</strong>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Role: <span style={{ 
                  textTransform: 'capitalize',
                  color: userData?.role === 'police' ? '#2563eb' : '#10b981'
                }}>
                  {userData?.role}
                </span>
                {userData?.role === 'police' && userDistrict && (
                  <span style={{ 
                    marginLeft: '1rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    District: {userDistrict}
                  </span>
                )}
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Last login: {new Date().toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-card">
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`toggle-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}