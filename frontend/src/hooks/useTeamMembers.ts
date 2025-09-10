import { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const data = loadFromStorage();
    setTeamMembers(data.teamMembers);
  }, []);

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'teamIds'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: generateId(),
      teamIds: []
    };
    
    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    
    const currentData = loadFromStorage();
    saveToStorage({
      ...currentData,
      teamMembers: updatedMembers
    });
    
    return newMember;
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    const updatedMembers = teamMembers.map(member =>
      member.id === id ? { ...member, ...updates } : member
    );
    setTeamMembers(updatedMembers);
    
    const currentData = loadFromStorage();
    saveToStorage({
      ...currentData,
      teamMembers: updatedMembers
    });
  };

  return {
    teamMembers,
    addTeamMember,
    updateTeamMember
  };
};