import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TeamMember, Team, Feedback } from '../types';
import { apiService } from '../services/api';

interface AppDataState {
  teamMembers: TeamMember[];
  teams: Team[];
  feedback: Feedback[];
  loading: boolean;
  error: string | null;
}

interface AppDataContextType extends AppDataState {
  refreshData: () => Promise<void>;
  refreshTeamMembers: () => Promise<void>;
  refreshTeams: () => Promise<void>;
  refreshFeedback: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppDataState>({
    teamMembers: [],
    teams: [],
    feedback: [],
    loading: true,
    error: null
  });

  const refreshTeamMembers = async () => {
    try {
      const teamMembers = await apiService.getAllTeamMembers();
      setState(prev => ({ ...prev, teamMembers }));
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const refreshTeams = async () => {
    try {
      const teams = await apiService.getTeams();
      setState(prev => ({ ...prev, teams }));
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const refreshFeedback = async () => {
    try {
      const feedback = await apiService.getAllFeedback();
      setState(prev => ({ ...prev, feedback }));
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    }
  };

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await Promise.all([
        refreshTeamMembers(),
        refreshTeams(),
        refreshFeedback()
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const contextValue: AppDataContextType = {
    ...state,
    refreshData,
    refreshTeamMembers,
    refreshTeams,
    refreshFeedback
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};