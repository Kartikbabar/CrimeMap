// app/auth/page.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '../../components/auth/LoginForm';

export default function AuthPage() {
  const [authType, setAuthType] = useState('citizen');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ensure baseline officers are seeded so demo login works
    import('../../lib/firebase').then(({ DataSeedingService }) => {
      DataSeedingService.ensureBaselineOfficers().catch(err => console.error("Baseline seed error", err));
    });
  }, []);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'police') {
        router.push('/dashboard');
      } else {
        router.push('/citizen/dashboard');
      }
    }
  }, [user, loading, router]);

  const styles = {
    authContainer: {
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    bgMesh: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.1) 0%, transparent 40%)',
      zIndex: 0
    },
    authWrapper: {
      width: '100%',
      maxWidth: '480px',
      position: 'relative',
      zIndex: 1
    },
    authCard: {
      background: authType === 'police' ? '#0f172a' : 'white',
      borderRadius: '2rem',
      padding: '2.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: authType === 'police' ? '1px solid rgba(255,255,255,0.1)' : 'none'
    },
    header: { textAlign: 'center', marginBottom: '2rem' },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      color: authType === 'police' ? 'white' : '#1e293b',
      margin: '0 0 0.5rem 0',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '0.95rem',
      color: authType === 'police' ? '#94a3b8' : '#64748b',
      margin: 0
    },
    toggleGroup: {
      display: 'flex',
      background: authType === 'police' ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
      padding: '0.4rem',
      borderRadius: '1rem',
      marginBottom: '1.5rem',
      gap: '0.25rem'
    },
    toggleBtn: (active) => ({
      flex: 1,
      padding: '0.75rem',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: active ? (authType === 'police' ? '#3b82f6' : '#6366f1') : 'transparent',
      color: active ? 'white' : (authType === 'police' ? '#94a3b8' : '#64748b')
    }),
    footerLink: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: authType === 'police' ? '#94a3b8' : '#64748b'
    },
    link: {
      color: authType === 'police' ? '#60a5fa' : '#6366f1',
      textDecoration: 'none',
      fontWeight: '600'
    }
  };

  if (loading) return <div style={styles.authContainer}><div style={{ color: '#6366f1', fontWeight: 'bold' }}>INITIALIZING SENTINEL...</div></div>;

  return (
    <div style={styles.authContainer}>
      <div style={styles.bgMesh}></div>
      <div style={styles.authWrapper}>
        <div style={styles.authCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              {authType === 'citizen' ? 'Citizen Login' : 'Department Login'}
            </h1>
            <p style={styles.subtitle}>
              Secure access to {authType === 'citizen' ? 'public services' : 'police network'}
            </p>
          </div>

          <div style={styles.toggleGroup}>
            <button
              style={styles.toggleBtn(authType === 'citizen')}
              onClick={() => setAuthType('citizen')}
            >
              Citizen
            </button>
            <button
              style={styles.toggleBtn(authType === 'police')}
              onClick={() => setAuthType('police')}
            >
              Police
            </button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <LoginForm
              darkMode={authType === 'police'}
              expectedRole={authType}
            />
          </div>

          <div style={styles.footerLink}>
            Don't have an account?{' '}
            <Link href={authType === 'citizen' ? "/auth/register" : "/auth/police-register"} style={styles.link}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
