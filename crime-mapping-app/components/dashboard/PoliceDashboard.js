'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import FIRManagement from './FIRManagement';
import StatsOverview from './StatsOverview';
import { FileText, Users, MapPin, BarChart3 } from 'lucide-react';




export default function PoliceDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'fir', name: 'FIR Management', icon: FileText },
    { id: 'personnel', name: 'Personnel', icon: Users },
    { id: 'patrol', name: 'Patrol Routes', icon: MapPin },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatsOverview />
            
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">New FIR Registered</p>
                    <p className="text-sm text-gray-600">Case #FIR-2024-001</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Case Resolved</p>
                    <p className="text-sm text-gray-600">Case #FIR-2023-456</p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'fir':
        return <FIRManagement />;
      case 'personnel':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel Management</h3>
            <p className="text-gray-600">Personnel management features coming soon...</p>
          </div>
        );
      case 'patrol':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patrol Route Optimization</h3>
            <p className="text-gray-600">Patrol route optimization features coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Police Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, Officer {user?.displayName || 'User'}. Manage cases and monitor crime patterns.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}