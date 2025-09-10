import { AppState, TeamMember, Team, Feedback } from '../types';

const STORAGE_KEY = 'coaching-app-data';

const defaultState: AppState = {
  teamMembers: [],
  teams: [],
  feedback: []
};

export const loadFromStorage = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultState;
    
    const parsed = JSON.parse(data);
    return {
      ...defaultState,
      ...parsed,
      feedback: parsed.feedback?.map((f: any) => ({
        ...f,
        timestamp: new Date(f.timestamp)
      })) || []
    };
  } catch {
    return defaultState;
  }
};

export const saveToStorage = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};