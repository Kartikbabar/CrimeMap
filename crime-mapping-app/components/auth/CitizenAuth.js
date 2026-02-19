// components/auth/CitizenAuth.js
'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const CitizenRegisterForm = () => {
  const { citizenSignup, socialSignIn } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    aadhar: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const styles = {
    authCard: { background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', color: '#1e293b' },
    socialGrid: { display: 'grid', gap: '1rem', marginBottom: '2rem' },
    socialBtn: (disabled) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '1rem', background: 'white', fontWeight: '700', color: '#1e293b', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: disabled ? 0.6 : 1 }),
    socialImg: { width: '1.25rem' },
    divider: { textAlign: 'center', borderBottom: '1px solid #e2e8f0', lineHeight: '0.1rem', margin: '2.5rem 0' },
    dividerSpan: { background: '#fff', padding: '0 1rem', color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '2px' },
    emailForm: { display: 'grid', gap: '1.5rem' },
    inputGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.8rem', fontWeight: '700', color: '#64748b' },
    input: { padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '0.85rem', fontSize: '0.95rem', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' },
    submitBtn: (disabled) => ({ background: '#6366f1', color: 'white', padding: '1.1rem', border: 'none', borderRadius: '1rem', fontWeight: '800', fontSize: '1rem', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)', width: '100%' }),
    errorMsg: { background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '0.85rem', fontSize: '0.85rem', border: '1px solid #fee2e2' },
    successMsg: { background: '#f0fdf4', color: '#10b981', padding: '1rem', borderRadius: '0.85rem', fontSize: '0.85rem', border: '1px solid #dcfce7' }
  };

  const handleSocialAction = async (provider) => {
    setLoading(true);
    setError('');
    try {
      const result = await socialSignIn(provider);
      if (result.success) {
        router.push('/citizen/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Social sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'aadhar') {
      const numbers = value.replace(/\D/g, '').slice(0, 12);
      setFormData(prev => ({ ...prev, [name]: numbers }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSendOtp = () => {
    if (formData.aadhar.length !== 12) { setError('Enter valid 12-digit Aadhaar'); return; }
    setLoading(true);
    setTimeout(() => {
      setShowOtpField(true);
      setLoading(false);
      alert('SIMULATION: OTP sent to your linked mobile number: ******' + formData.phone.slice(-4));
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') { // Simulation code
      setVerifyingOtp(true);
      setTimeout(() => {
        setAadharVerified(true);
        setShowOtpField(false);
        setVerifyingOtp(false);
        setSuccess('Aadhaar Verified & E-KYC Data Fetched.');
      }, 2000);
    } else {
      setError('Invalid OTP. Use 123456 for simulation.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadharVerified) { setError('Aadhaar verification is mandatory.'); return; }
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await citizenSignup(formData.email, formData.password, {
        fullName: formData.fullName,
        phone: formData.phone,
        aadhar: formData.aadhar,
        kycVerified: true
      });

      if (result.success) {
        setSuccess('Verified Account created! Redirecting...');
        setTimeout(() => window.location.href = '/auth', 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authCard}>
      <div style={styles.socialGrid}>
        <button onClick={() => handleSocialAction('google')} style={styles.socialBtn(loading)} disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google" style={styles.socialImg} />
          Continue with Google
        </button>
        <button onClick={() => handleSocialAction('facebook')} style={styles.socialBtn(loading)} disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/facebook.svg" alt="FB" style={styles.socialImg} />
          Continue with Facebook
        </button>
      </div>

      <div style={styles.divider}>
        <span style={styles.dividerSpan}>OR CONTINUE WITH EMAIL</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.emailForm}>
        {error && <div style={styles.errorMsg}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <div style={styles.inputGroup}>
          <div style={styles.field}>
            <label style={styles.label}>Full Legal Name</label>
            <input name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} style={styles.input} required />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>
            <input name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Aadhaar Number (UIDAI)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                name="aadhar"
                placeholder="0000 0000 0000"
                value={formData.aadhar}
                onChange={handleChange}
                maxLength="12"
                style={{ ...styles.input, flex: 1 }}
                disabled={aadharVerified}
                required
              />
              {!aadharVerified && !showOtpField && (
                <button type="button" onClick={handleSendOtp} style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0 1rem', borderRadius: '0.85rem', fontWeight: '800', fontSize: '0.7rem', cursor: 'pointer' }}>VERIFY</button>
              )}
            </div>
          </div>
        </div>

        {showOtpField && (
          <div style={{ ...styles.field, background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <label style={styles.label}>Enter 6-digit OTP (Sent to linked mobile)</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
                maxLength="6"
              />
              <button type="button" onClick={handleVerifyOtp} style={{ ...styles.submitBtn(verifyingOtp), width: '120px', padding: '0' }} disabled={verifyingOtp}>
                {verifyingOtp ? '...' : 'SUBMIT'}
              </button>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>Use 123456 for testing</div>
          </div>
        )}

        {aadharVerified && (
          <div style={{ ...styles.successMsg, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            <div>
              <strong>Identity Verified</strong>
              <div style={{ fontSize: '0.7rem' }}>Secure Token: UIDAI-HASH-{formData.aadhar.slice(-4)}</div>
            </div>
          </div>
        )}

        <div style={styles.inputGroup}>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} style={styles.input} required />
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn(loading)}>
          {loading ? 'Processing...' : 'One-Step Verification & Signup'}
        </button>
      </form>
    </div>
  );
};

export default CitizenRegisterForm;