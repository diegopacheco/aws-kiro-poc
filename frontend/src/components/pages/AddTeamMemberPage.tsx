import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamMemberForm } from '../forms';
import { useTeamMembers } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';

export const AddTeamMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTeamMember, loading } = useTeamMembers();
  const { showToast } = useToast();

  const handleSubmit = async (data: { name: string; email: string; picture?: string }) => {
    const result = await addTeamMember(data);
    if (result) {
      showToast('Team member added successfully!', 'success');
      navigate('/');
    } else {
      showToast('Failed to add team member', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <TeamMemberForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};