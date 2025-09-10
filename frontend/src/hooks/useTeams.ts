import { useState } from 'react';
import { Team, CreateTeamRequest, ApiError } from '../types';
import { apiService } from '../services/api';
import { useAppData } from '../contexts/AppDataContext';

export const useTeams = () => {
  const { teams, refreshTeams: refreshData } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTeam = async (teamData: CreateTeamRequest): Promise<Team | null> => {
    setLoading(true);
    setError(null);
    try {
      const newTeam = await apiService.createTeam(teamData);
      await refreshData(); // Refresh global data
      return newTeam;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to create team');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteTeam(teamId);
      await refreshData(); // Refresh global data
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete team');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeMemberFromTeam = async (teamId: number, memberId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiService.removeMemberFromTeam(teamId, memberId);
      await refreshData(); // Refresh global data
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to remove member from team');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshTeams = () => {
    refreshData();
  };

  return {
    teams,
    loading,
    error,
    addTeam,
    deleteTeam,
    removeMemberFromTeam,
    refreshTeams
  };
};