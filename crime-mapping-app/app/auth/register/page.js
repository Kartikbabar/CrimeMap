// app/auth/register/page.js
'use client';
import CitizenAuth from '../../../components/auth/CitizenAuth';

import Link from 'next/link';

export default function RegisterPage() {
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
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
    wrapper: {
      width: '100%',
      maxWidth: '800px',
      position: 'relative',
      zIndex: 1
    },
    loginLink: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#94a3b8',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgMesh}></div>
      <div style={styles.wrapper}>
        <CitizenAuth />
        <div style={styles.loginLink}>
          Already have an account?{' '}
          <Link href="/auth" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}