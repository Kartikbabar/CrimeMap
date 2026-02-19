// app/auth/police-register/page.js
'use client';
import PoliceAuth from '../../../components/auth/PoliceAuth';

export default function PoliceRegisterPage() {
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    card: {
      width: '100%',
      maxWidth: '600px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <PoliceAuth />
      </div>
    </div>
  );
}