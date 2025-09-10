import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamMemberForm } from '../forms';
import { useTeamMembers } from '../../hooks';

export const AddTeamMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTeamMember } = useTeamMembers();

  const handleSubmit = (data: { name: string; email: string; picture?: string }) => {
    addTeamMember(data);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <TeamMemberForm onSubmit={handleSubmit} />
    </div>
  );
};