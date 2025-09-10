import { renderHook, act } from '@testing-library/react';
import { useTeams } from '../useTeams';
import { mockTeam, mockAppState } from '../../test/fixtures';
import * as storage from '../../utils/storage';

// Mock the storage utilities
vi.mock('../../utils/storage', () => ({
  loadFromStorage: vi.fn(),
  saveToStorage: vi.fn(),
  generateId: vi.fn()
}));

const mockLoadFromStorage = vi.mocked(storage.loadFromStorage);
const mockSaveToStorage = vi.mocked(storage.saveToStorage);
const mockGenerateId = vi.mocked(storage.generateId);

describe('useTeams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadFromStorage.mockReturnValue(mockAppState);
    mockGenerateId.mockReturnValue('new-team-id');
  });

  it('loads teams from storage on mount', () => {
    const { result } = renderHook(() => useTeams());
    
    expect(mockLoadFromStorage).toHaveBeenCalled();
    expect(result.current.teams).toEqual(mockAppState.teams);
  });

  it('adds a new team', () => {
    const { result } = renderHook(() => useTeams());
    
    const newTeamData = {
      name: 'Design Team',
      logo: 'data:image/jpeg;base64,design-logo'
    };
    
    act(() => {
      const newTeam = result.current.addTeam(newTeamData);
      
      expect(newTeam).toEqual({
        ...newTeamData,
        id: 'new-team-id',
        memberIds: []
      });
    });
    
    expect(mockGenerateId).toHaveBeenCalled();
    expect(mockSaveToStorage).toHaveBeenCalledWith({
      ...mockAppState,
      teams: [
        ...mockAppState.teams,
        {
          ...newTeamData,
          id: 'new-team-id',
          memberIds: []
        }
      ]
    });
  });

  it('updates an existing team', () => {
    const { result } = renderHook(() => useTeams());
    
    const updates = {
      name: 'Updated Development Team',
      logo: 'data:image/jpeg;base64,updated-logo'
    };
    
    act(() => {
      result.current.updateTeam('team-1', updates);
    });
    
    expect(result.current.teams[0]).toEqual({
      ...mockTeam,
      ...updates
    });
    
    expect(mockSaveToStorage).toHaveBeenCalledWith({
      ...mockAppState,
      teams: [{
        ...mockTeam,
        ...updates
      }]
    });
  });

  it('does not update non-existent team', () => {
    const { result } = renderHook(() => useTeams());
    
    const originalTeams = result.current.teams;
    
    act(() => {
      result.current.updateTeam('non-existent-id', { name: 'Updated' });
    });
    
    expect(result.current.teams).toEqual(originalTeams);
  });

  it('handles empty storage gracefully', () => {
    mockLoadFromStorage.mockReturnValue({
      teamMembers: [],
      teams: [],
      feedback: []
    });
    
    const { result } = renderHook(() => useTeams());
    
    expect(result.current.teams).toEqual([]);
  });
});