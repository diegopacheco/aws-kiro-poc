import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/add-member', label: 'Add Member' },
    { path: '/create-team', label: 'Create Team' },
    { path: '/assign-team', label: 'Assign Team' },
    { path: '/give-feedback', label: 'Give Feedback' },
    { path: '/feedback-list', label: 'View Feedback' },
    { path: '/team-management', label: 'Manage Teams' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo-app.png" 
              alt="Coaching App Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-blue-600">
              Coaching App
            </span>
          </Link>
          
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};