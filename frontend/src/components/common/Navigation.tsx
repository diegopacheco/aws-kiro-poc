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
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo section - left side */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/logo-app.png" 
              alt="NoSugar Coaching Logo" 
              className="h-6 w-6 object-contain"
            />
            <span className="text-lg font-bold text-gray-800 hidden sm:block">
              NoSugar Coaching
            </span>
          </Link>
          
          {/* Navigation menu - right side */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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