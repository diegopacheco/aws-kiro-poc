import { useState } from 'react';
import { Feedback, CreateFeedbackRequest, ApiError } from '../types';
import { apiService } from '../services/api';
import { useAppData } from '../contexts/AppDataContext';

export const useFeedback = () => {
  const { feedback, refreshFeedback: refreshData } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFeedback = async (feedbackData: CreateFeedbackRequest): Promise<Feedback | null> => {
    setLoading(true);
    setError(null);
    try {
      const newFeedback = await apiService.createFeedback(feedbackData);
      await refreshData(); // Refresh global data
      return newFeedback;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to create feedback');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackByTarget = (targetType: 'team' | 'member', targetId: number) => {
    return feedback.filter(f => 
      f.target_type === targetType && f.target_id === targetId
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const refreshFeedback = () => {
    refreshData();
  };

  return {
    feedback,
    loading,
    error,
    addFeedback,
    getFeedbackByTarget,
    refreshFeedback
  };
};