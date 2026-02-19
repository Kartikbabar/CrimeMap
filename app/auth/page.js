'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import CitizenAuth from '../../components/auth/CitizenAuth';
import PoliceAuth from '../../components/auth/PoliceAuth';

export default function AuthPage() {
  const [authType, setAuthType] = useState('citizen');
  const [isLogin, setIsLogin] = useState(true);
  const { shouldRedirect } = useAuth();
  const router = useRouter();

  // Redirect to dashboard after successful login/signup
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/dashboard');
    }
  }, [shouldRedirect, router]);

  return (
    <div className="auth-container">
      <div className="max-w-md mx-auto">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="auth-subtitle">
              {isLogin ? 'Sign in to your account' : 'Join Suraksha Map today'}
            </p>
          </div>

          {/* Toggle between Login/Signup */}
          <div className="toggle-group">
            <button
              className={`toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Toggle between Citizen/Police */}
          <div className="toggle-group">
            <button
              className={`toggle-btn ${authType === 'citizen' ? 'active' : ''}`}
              onClick={() => setAuthType('citizen')}
            >
              Citizen
            </button>
            <button
              className={`toggle-btn ${authType === 'police' ? 'active' : ''}`}
              onClick={() => setAuthType('police')}
            >
              Police
            </button>
          </div>

          {/* Auth Components */}
          {authType === 'citizen' ? (
            <CitizenAuth isLogin={isLogin} />
          ) : (
            <PoliceAuth isLogin={isLogin} />
          )}
        </div>
      </div>
    </div>
  );
}