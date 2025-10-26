'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function PoliceAuth({ isLogin }) {
  const { policeSignup, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    stationId: '',
    batchId: '',
    rank: '',
    designation: '',
    badgeNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success('Logged in successfully!');
        } else {
          toast.error(result.error);
        }
      } else {
        // Signup
        const result = await policeSignup(formData.email, formData.password, {
          fullName: formData.fullName,
          stationId: formData.stationId,
          batchId: formData.batchId,
          rank: formData.rank,
          designation: formData.designation,
          badgeNumber: formData.badgeNumber,
        });
        if (result.success) {
          toast.success('Registration submitted for approval!');
          // Reset form
          setFormData({
            email: '',
            password: '',
            fullName: '',
            stationId: '',
            batchId: '',
            rank: '',
            designation: '',
            badgeNumber: ''
          });
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rank</label>
              <input
                type="text"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Station ID</label>
              <input
                type="text"
                name="stationId"
                value={formData.stationId}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Batch ID</label>
              <input
                type="text"
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Badge Number</label>
              <input
                type="text"
                name="badgeNumber"
                value={formData.badgeNumber}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </>
      )}

      <div className="form-group">
        <label className="form-label">Official Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          required
          minLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="submit-btn police"
      >
        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Register')}
      </button>

      {!isLogin && (
        <div className="alert alert-warning">
          <strong>Note:</strong> Your account requires admin approval. You'll be notified via email once activated.
        </div>
      )}
    </form>
  );
}