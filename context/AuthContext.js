'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Mock authentication system
  useEffect(() => {
    // Check if user is stored in localStorage (mock persistence)
    const storedUser = localStorage.getItem('user');
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUser && storedUserData) {
      setUser(JSON.parse(storedUser));
      setUserData(JSON.parse(storedUserData));
    }
    
    setLoading(false);
  }, []);

  const citizenSignup = async (email, password, userInfo) => {
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const mockUser = {
        uid: 'citizen-' + Date.now(),
        email: email
      };
      
      const mockUserData = {
        ...userInfo,
        role: 'citizen',
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage (mock database)
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      setUser(mockUser);
      setUserData(mockUserData);
      setShouldRedirect(true); // Trigger redirect
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const policeSignup = async (email, password, userInfo) => {
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const mockUser = {
        uid: 'police-' + Date.now(),
        email: email
      };
      
      const mockUserData = {
        ...userInfo,
        role: 'police',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage (mock database)
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      setUser(mockUser);
      setUserData(mockUserData);
      setShouldRedirect(true); // Trigger redirect
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple mock validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      
      // Check if user exists in localStorage (mock database)
      const storedUser = localStorage.getItem('user');
      const storedUserData = localStorage.getItem('userData');
      
      if (storedUser && storedUserData) {
        const user = JSON.parse(storedUser);
        const userData = JSON.parse(storedUserData);
        
        if (user.email === email) {
          setUser(user);
          setUserData(userData);
          setShouldRedirect(true); // Trigger redirect
          return { success: true };
        }
      }
      
      // If no user found, create a mock one
      const mockUser = {
        uid: 'user-' + Date.now(),
        email: email
      };
      
      const mockUserData = {
        fullName: 'Demo User',
        role: email.includes('police') ? 'police' : 'citizen',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      setUser(mockUser);
      setUserData(mockUserData);
      setShouldRedirect(true); // Trigger redirect
      
      return { success: true };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      setUser(null);
      setUserData(null);
      setShouldRedirect(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userData,
    loading,
    shouldRedirect,
    setShouldRedirect,
    citizenSignup,
    policeSignup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};