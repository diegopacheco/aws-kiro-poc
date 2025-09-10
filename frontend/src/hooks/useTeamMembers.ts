import { useState } from 'react';
import { TeamMember, CreateTeamMemberRequest, ApiError } from '../types';
import { apiService } from '../services/api';
import { useAppData } from '../contexts/AppDataContext';

export const useTeamMembers = () => {
  const { teamMembers, refreshTeamMembers: refreshData } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTeamMember = async (memberData: CreateTeamMemberRequest): Promise<TeamMember | null> => {
    setLoading(true);
    setError(null);
    try {
      const newMember = await apiService.createTeamMember(memberData);
      await refreshData(); // Refresh global data
      return newMember;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to create team member');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshTeamMembers = () => {
    refreshData();
  };

  return {
    teamMembers,
    loading,
    error,
    addTeamMember,
    refreshTeamMembers
  };
};