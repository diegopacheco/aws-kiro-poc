import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common';

export const HomePage: React.FC = () => {
  const navigationItems = [
    { path: '/add-member', title: 'Add Team Member', description: 'Add new team members with their details' },
    { path: '/create-team', title: 'Create Team', description: 'Create new teams with names and logos' },
    { path: '/assign-team', title: 'Assign to Team', description: 'Assign team members to teams' },
    { path: '/give-feedback', title: 'Give Feedback', description: 'Provide feedback to teams or individuals' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to NoSugar Coaching</h1>
        <p className="text-gray-600">Honest coaching, zero sweet talk.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navigationItems.map((item) => (
          <Link key={item.path} to={item.path} className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};