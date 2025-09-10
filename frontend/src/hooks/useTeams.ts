import { useState, useEffect } from 'react';
import { Team } from '../types';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const data = loadFromStorage();
    setTeams(data.teams);
  }, []);

  const addTeam = (teamData: Omit<Team, 'id' | 'memberIds'>) => {
    const newTeam: Team = {
      ...teamData,
      id: generateId(),
      memberIds: []
    };
    
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    
    const currentData = loadFromStorage();
    saveToStorage({
      ...currentData,
      teams: updatedTeams
    });
    
    return newTeam;
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    const updatedTeams = teams.map(team =>
      team.id === id ? { ...team, ...updates } : team
    );
    setTeams(updatedTeams);
    
    const currentData = loadFromStorage();
    saveToStorage({
      ...currentData,
      teams: updatedTeams
    });
  };

  return {
    teams,
    addTeam,
    updateTeam
  };
};