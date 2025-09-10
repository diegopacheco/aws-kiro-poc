import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamForm } from '../forms';
import { useTeams } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';

export const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTeam, loading } = useTeams();
  const { showToast } = useToast();

  const handleSubmit = async (data: { name: string; logo?: string }) => {
    const result = await addTeam(data);
    if (result) {
      showToast('Team created successfully!', 'success');
      navigate('/');
    } else {
      showToast('Failed to create team', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <TeamForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};