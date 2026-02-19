// app/dashboard/page.js
'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CrimeMap = dynamic(() => import('../../components/dashboard/CrimeMap'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', borderRadius: '1rem', color: '#8b949e' }}>Loading Map...</div>
});

import Sidebar from '../../components/police/layout/Sidebar';
import TopBar from '../../components/police/layout/TopBar';
import DashboardHome from '../../components/police/dashboard/DashboardHome';
import FIRManagement from '../../components/police/FIRManagement';
import PatrolManagement from '../../components/police/PatrolManagement';
import PersonnelManagement from '../../components/police/PersonnelManagement';
import PoliceConnectiveHub from '../../components/police/PoliceConnectiveHub';
import AnalyticsDashboard from '../../components/police/AnalyticsDashboard';
import InterStationNexus from '../../components/police/InterStationNexus';
import CrimeReports from '../../components/police/CrimeReports';
import Settings from '../../components/police/Settings';
import GlobalBOLOTicker from '../../components/police/GlobalBOLOTicker';
import ConnectivityMatrix from '../../components/police/ConnectivityMatrix';
import { DataSeedingService } from '../../lib/firebase';

export default function Dashboard() {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userDistrict, setUserDistrict] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth');
      } else if (userData?.role === 'citizen') {
        // Prevent citizens from accessing police dashboard
        router.push('/citizen/dashboard');
      }
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (userData?.role === 'police') {
      const district = userData.district || 'Mumbai';
      setUserDistrict(district);
      // Seed initial data for this district
      DataSeedingService.seedInitialData(district).catch(err =>
        console.error('Seeding error:', err)
      );
    }
  }, [userData]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0d1117',
      color: '#c9d1d9',
      fontFamily: "'Inter', sans-serif"
    },
    mainContent: {
      marginLeft: '180px',
      marginTop: '60px',
      minHeight: 'calc(100vh - 60px)'
    },
    contentArea: {
      padding: '0',
      display: 'grid',
      gridTemplateColumns: activeTab === 'dashboard' ? '1fr 300px' : '1fr',
      gap: '0'
    }
  };

  if (loading) return (
    <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#f59e0b', fontWeight: '600' }}>Loading System...</div>
    </div>
  );

  if (!user) return null;

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) router.push('/auth');
  };

  return (
    <div style={styles.container}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <TopBar userData={userData} onLogout={handleLogout} />
      <GlobalBOLOTicker userData={userData} />

      <main style={styles.mainContent}>
        <div style={styles.contentArea}>
          {activeTab === 'dashboard' && (
            <DashboardHome setActiveTab={setActiveTab} userDistrict={userDistrict} />
          )}

          {activeTab === 'fir' && (
            <div style={{ padding: '2rem' }}>
              <FIRManagement
                userDistrict={userDistrict}
                userRole="police"
                activeTab={activeTab}
              />
            </div>
          )}

          {activeTab === 'patrol' && (
            <div style={{ padding: '2rem' }}>
              <PatrolManagement
                userDistrict={userDistrict}
              />
            </div>
          )}

          {activeTab === 'personnel' && (
            <div style={{ padding: '2rem' }}>
              <PersonnelManagement
                userDistrict={userDistrict}
              />
            </div>
          )}


          {activeTab === 'nexus' && (
            <div style={{ padding: '2rem' }}>
              <InterStationNexus
                userDistrict={userDistrict}
                userData={userData}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div style={{ padding: '2rem' }}>
              <AnalyticsDashboard userDistrict={userDistrict} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ padding: '2rem' }}>
              <Settings userData={userData} />
            </div>
          )}
        </div>

        {activeTab === 'dashboard' && (
          <aside style={{
            width: '300px',
            height: 'calc(100vh - 100px)',
            position: 'fixed',
            right: 0,
            padding: '1.5rem',
            zIndex: 10
          }}>
            <ConnectivityMatrix userDistrict={userDistrict} />
          </aside>
        )}
      </main>
    </div>
  );
}