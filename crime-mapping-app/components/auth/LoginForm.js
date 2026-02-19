'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm = ({ darkMode = false, expectedRole = 'citizen' }) => {
  const { login, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    district: '',
    stationId: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const maharashtraDistricts = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded", "Nandurbar", "Nashik",
    "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli",
    "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ].sort();

  const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    errorBox: { backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.75rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' },
    errorIcon: { height: '1.25rem', width: '1.25rem', color: '#ef4444' },
    errorText: { margin: 0, fontSize: '0.875rem', color: '#b91c1c' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.875rem', fontWeight: '600', color: darkMode ? '#94a3b8' : '#475569' },
    input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', background: darkMode ? 'rgba(255,255,255,0.05)' : 'white', color: darkMode ? 'white' : 'black', fontSize: '1rem', transition: 'all 0.2s', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', background: darkMode ? '#0f172a' : 'white', color: darkMode ? 'white' : 'black', fontSize: '1rem', transition: 'all 0.2s' },
    loginBtn: (disabled) => ({ marginTop: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: '0.75rem', backgroundColor: disabled ? '#94a3b8' : '#6366f1', color: 'white', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' })
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (expectedRole === 'police' && (!formData.district || !formData.stationId)) {
        setError('District and Station ID are mandatory for Department login.');
        setLoading(false);
        return;
      }

      const result = await login(formData.email, formData.password, formData.district, formData.stationId);
      if (result.success) {
        if (expectedRole && result.role !== expectedRole) {
          await logout();
          setError(`Access Denied: This account is not authorized for ${expectedRole === 'police' ? 'Department' : 'Citizen'} access.`);
        } else {
          router.push(result.redirectPath || '/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && (
          <div style={styles.errorBox}>
            <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>Official Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="officer@police.gov.in"
            style={styles.input}
          />
        </div>

        {expectedRole === 'police' && (
          <>
            <div style={styles.fieldGroup}>
              <label htmlFor="district" style={styles.label}>Assigned District</label>
              <select
                id="district"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select District</option>
                {maharashtraDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="stationId" style={styles.label}>Station ID (Verification Code)</label>
              <input
                id="stationId"
                name="stationId"
                type="text"
                required
                value={formData.stationId}
                onChange={handleChange}
                placeholder="MUM-COL-ID"
                style={styles.input}
              />
            </div>
          </>
        )}

        <div style={styles.fieldGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <Link href="/auth/forgot-password" style={{ fontSize: '0.8125rem', fontWeight: '500', color: '#6366f1', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            style={styles.input}
          />
        </div>

        {expectedRole === 'police' && (
          <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px', marginBottom: '0.5rem' }}>MISSION INTELLIGENCE // DEMO MODE</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
              Password: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Police@123</span><br />
              Email: <span style={{ color: '#f59e0b' }}>officer1.[district]@police.gov.in</span><br />
              Station ID: <span style={{ color: '#f59e0b' }}>[DI]-[PS]-ID</span> (e.g., MU-COL-ID)
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} style={styles.loginBtn(loading)}>
          {loading ? 'Sign-in Protocol Active...' : 'Enter Network'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;