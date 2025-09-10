import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamForm } from '../forms';
import { useTeams } from '../../hooks';

export const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTeam } = useTeams();

  const handleSubmit = (data: { name: string; logo?: string }) => {
    addTeam(data);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <TeamForm onSubmit={handleSubmit} />
    </div>
  );
};