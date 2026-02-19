// components/auth/PoliceAuth.js
'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const PoliceRegisterForm = () => {
  const { policeSignup } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    badgeNumber: '',
    stationId: '',
    district: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const maharashtraDistricts = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded", "Nandurbar", "Nashik",
    "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli",
    "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ].sort();

  const styles = {
    authCard: { background: '#0f172a', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' },
    policeHeader: { textAlign: 'center', marginBottom: '2rem' },
    badgeIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
    headerTitle: { fontSize: '1.5rem', margin: 0, color: '#fff' },
    headerSub: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' },
    policeForm: { display: 'grid', gap: '1.5rem' },
    inputGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
    input: { background: 'rgba(255, 255, 255, 0.05)', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.85rem', fontSize: '0.95rem', color: 'white', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' },
    select: { background: 'rgba(255, 255, 255, 0.05)', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.85rem', fontSize: '0.95rem', color: 'white', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' },
    submitBtn: (disabled) => ({ background: '#1e40af', color: 'white', padding: '1.1rem', border: 'none', borderRadius: '1rem', fontWeight: '800', fontSize: '1rem', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '1rem', width: '100%' }),
    errorMsg: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '0.85rem', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)' },
    successMsg: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '0.85rem', fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.2)' }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await policeSignup(formData.email, formData.password, {
        fullName: formData.fullName,
        badgeNumber: formData.badgeNumber,
        stationId: formData.stationId,
        district: formData.district,
        phone: formData.phone
      });

      if (result.success) {
        setSuccess('Registration submitted! Awaiting department approval.');
        setTimeout(() => window.location.href = '/auth', 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authCard}>
      <div style={styles.policeHeader}>
        <div style={styles.badgeIcon}>🚔</div>
        <h3 style={styles.headerTitle}>Officer Registration</h3>
        <p style={styles.headerSub}>Department of Maharashtra State Police</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.policeForm}>
        {error && <div style={styles.errorMsg}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <div style={styles.inputGroup}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name (as per ID)</label>
            <input name="fullName" placeholder="Officer Name" value={formData.fullName} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Badge Number</label>
            <input name="badgeNumber" placeholder="MS-XXXXX" value={formData.badgeNumber} onChange={handleChange} style={styles.input} required />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.field}>
            <label style={styles.label}>Police Station ID</label>
            <input name="stationId" placeholder="PS-CODE-XXX" value={formData.stationId} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Assigned District</label>
            <select name="district" value={formData.district} onChange={handleChange} style={styles.select} required>
              <option value="">Select District</option>
              {maharashtraDistricts.map(d => <option key={d} value={d} style={{ color: 'black' }}>{d}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.field}>
            <label style={styles.label}>Official Email</label>
            <input name="email" type="email" placeholder="officer@police.gov.in" value={formData.email} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contact Number</label>
            <input name="phone" placeholder="9XXXXXXXXX" value={formData.phone} onChange={handleChange} style={styles.input} required />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.field}>
            <label style={styles.label}>Create Password</label>
            <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} style={styles.input} required />
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn(loading)}>
          {loading ? 'Submitting to HQ...' : 'Initialize Duty Registration'}
        </button>
      </form>
    </div>
  );
};

export default PoliceRegisterForm;