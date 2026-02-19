'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, userData, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link href="/" className="nav-logo">
          Suraksha Map
        </Link>

        <div className="nav-links">
          <Link href="/legal-advice" className="nav-link">Legal Advice</Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {userData?.fullName || user.email}
                {userData?.role && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                    {userData.role}
                  </span>
                )}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}