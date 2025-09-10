import { renderHook, act } from '@testing-library/react';
import { useTeamMembers } from '../useTeamMembers';
import { mockTeamMember, mockAppState } from '../../test/fixtures';
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

describe('useTeamMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadFromStorage.mockReturnValue(mockAppState);
    mockGenerateId.mockReturnValue('new-member-id');
  });

  it('loads team members from storage on mount', () => {
    const { result } = renderHook(() => useTeamMembers());
    
    expect(mockLoadFromStorage).toHaveBeenCalled();
    expect(result.current.teamMembers).toEqual(mockAppState.teamMembers);
  });

  it('adds a new team member', () => {
    const { result } = renderHook(() => useTeamMembers());
    
    const newMemberData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      picture: 'data:image/jpeg;base64,jane-image'
    };
    
    act(() => {
      const newMember = result.current.addTeamMember(newMemberData);
      
      expect(newMember).toEqual({
        ...newMemberData,
        id: 'new-member-id',
        teamIds: []
      });
    });
    
    expect(mockGenerateId).toHaveBeenCalled();
    expect(mockSaveToStorage).toHaveBeenCalledWith({
      ...mockAppState,
      teamMembers: [
        ...mockAppState.teamMembers,
        {
          ...newMemberData,
          id: 'new-member-id',
          teamIds: []
        }
      ]
    });
  });

  it('updates an existing team member', () => {
    const { result } = renderHook(() => useTeamMembers());
    
    const updates = {
      name: 'John Updated',
      email: 'john.updated@example.com'
    };
    
    act(() => {
      result.current.updateTeamMember('member-1', updates);
    });
    
    expect(result.current.teamMembers[0]).toEqual({
      ...mockTeamMember,
      ...updates
    });
    
    expect(mockSaveToStorage).toHaveBeenCalledWith({
      ...mockAppState,
      teamMembers: [{
        ...mockTeamMember,
        ...updates
      }]
    });
  });

  it('does not update non-existent team member', () => {
    const { result } = renderHook(() => useTeamMembers());
    
    const originalMembers = result.current.teamMembers;
    
    act(() => {
      result.current.updateTeamMember('non-existent-id', { name: 'Updated' });
    });
    
    expect(result.current.teamMembers).toEqual(originalMembers);
  });

  it('handles empty storage gracefully', () => {
    mockLoadFromStorage.mockReturnValue({
      teamMembers: [],
      teams: [],
      feedback: []
    });
    
    const { result } = renderHook(() => useTeamMembers());
    
    expect(result.current.teamMembers).toEqual([]);
  });
});