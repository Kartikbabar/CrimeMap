'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, FileText, Shield, AlertTriangle } from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const recentActivities = [
    {
      id: 1,
      type: 'Crime Alert',
      message: 'Theft reported in your area - Kothrud',
      time: '2 hours ago',
      icon: Bell,
      color: 'text-orange-500'
    },
    {
      id: 2,
      type: 'Safety Tip',
      message: 'Remember to lock your vehicles at night',
      time: '1 day ago',
      icon: Shield,
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.displayName || 'Citizen'}!
        </h1>
        <p className="text-gray-600">
          Stay informed about crime in your area and access legal resources.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Crime Alerts</h3>
          <p className="text-2xl font-bold text-orange-600">12</p>
          <p className="text-sm text-gray-500">in your area this month</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Safety Score</h3>
          <p className="text-2xl font-bold text-green-600">85%</p>
          <p className="text-sm text-gray-500">Your area safety rating</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 text-center">
          <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
          <p className="text-2xl font-bold text-blue-600">24/7</p>
          <p className="text-sm text-gray-500">Legal help available</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities & Alerts</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-gray-600">{activity.message}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-3">Emergency Contacts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-semibold text-red-800">Police</p>
            <p className="text-2xl font-bold text-red-600">100</p>
          </div>
          <div>
            <p className="font-semibold text-red-800">Ambulance</p>
            <p className="text-2xl font-bold text-red-600">108</p>
          </div>
          <div>
            <p className="font-semibold text-red-800">Women Helpline</p>
            <p className="text-2xl font-bold text-red-600">1091</p>
          </div>
          <div>
            <p className="font-semibold text-red-800">Disaster Management</p>
            <p className="text-2xl font-bold text-red-600">108</p>
          </div>
        </div>
      </div>
    </div>
  );
}