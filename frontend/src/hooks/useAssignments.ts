import { useState } from 'react';
import { AssignmentRequest, ApiError } from '../types';
import { apiService } from '../services/api';
import { useAppData } from '../contexts/AppDataContext';

export const useAssignments = () => {
  const { refreshData } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignMemberToTeam = async (assignment: AssignmentRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiService.assignMemberToTeam(assignment);
      await refreshData(); // Refresh global data
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to assign member to team');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    assignMemberToTeam
  };
};