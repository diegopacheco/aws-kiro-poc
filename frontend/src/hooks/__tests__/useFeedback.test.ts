import { renderHook, act } from '@testing-library/react';
import { useFeedback } from '../useFeedback';
import { mockFeedback, mockAppState } from '../../test/fixtures';
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

describe('useFeedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadFromStorage.mockReturnValue(mockAppState);
    mockGenerateId.mockReturnValue('new-feedback-id');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-02T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads feedback from storage on mount', () => {
    const { result } = renderHook(() => useFeedback());
    
    expect(mockLoadFromStorage).toHaveBeenCalled();
    expect(result.current.feedback).toEqual(mockAppState.feedback);
  });

  it('adds new feedback', () => {
    const { result } = renderHook(() => useFeedback());
    
    const newFeedbackData = {
      recipientType: 'team' as const,
      recipientId: 'team-1',
      content: 'Excellent teamwork this sprint!'
    };
    
    act(() => {
      const newFeedback = result.current.addFeedback(newFeedbackData);
      
      expect(newFeedback).toEqual({
        ...newFeedbackData,
        id: 'new-feedback-id',
        timestamp: new Date('2024-01-02T10:00:00Z')
      });
    });
    
    expect(mockGenerateId).toHaveBeenCalled();
    expect(mockSaveToStorage).toHaveBeenCalledWith({
      ...mockAppState,
      feedback: [
        ...mockAppState.feedback,
        {
          ...newFeedbackData,
          id: 'new-feedback-id',
          timestamp: new Date('2024-01-02T10:00:00Z')
        }
      ]
    });
  });

  it('gets feedback by recipient (member)', () => {
    const additionalFeedback = {
      id: 'feedback-2',
      recipientType: 'member' as const,
      recipientId: 'member-1',
      content: 'Keep up the good work!',
      timestamp: new Date('2024-01-02T10:00:00Z')
    };

    mockLoadFromStorage.mockReturnValue({
      ...mockAppState,
      feedback: [...mockAppState.feedback, additionalFeedback]
    });

    const { result } = renderHook(() => useFeedback());
    
    const memberFeedback = result.current.getFeedbackByRecipient('member', 'member-1');
    
    expect(memberFeedback).toHaveLength(2);
    expect(memberFeedback[0]).toEqual(additionalFeedback); // Most recent first
    expect(memberFeedback[1]).toEqual(mockFeedback);
  });

  it('gets feedback by recipient (team)', () => {
    const teamFeedback = {
      id: 'feedback-team',
      recipientType: 'team' as const,
      recipientId: 'team-1',
      content: 'Great team collaboration!',
      timestamp: new Date('2024-01-02T10:00:00Z')
    };

    mockLoadFromStorage.mockReturnValue({
      ...mockAppState,
      feedback: [...mockAppState.feedback, teamFeedback]
    });

    const { result } = renderHook(() => useFeedback());
    
    const teamFeedbackResult = result.current.getFeedbackByRecipient('team', 'team-1');
    
    expect(teamFeedbackResult).toHaveLength(1);
    expect(teamFeedbackResult[0]).toEqual(teamFeedback);
  });

  it('returns empty array for non-existent recipient', () => {
    const { result } = renderHook(() => useFeedback());
    
    const feedback = result.current.getFeedbackByRecipient('member', 'non-existent');
    
    expect(feedback).toEqual([]);
  });

  it('sorts feedback by timestamp (most recent first)', () => {
    const oldFeedback = {
      id: 'feedback-old',
      recipientType: 'member' as const,
      recipientId: 'member-1',
      content: 'Old feedback',
      timestamp: new Date('2023-12-01T10:00:00Z')
    };

    const newFeedback = {
      id: 'feedback-new',
      recipientType: 'member' as const,
      recipientId: 'member-1',
      content: 'New feedback',
      timestamp: new Date('2024-01-02T10:00:00Z')
    };

    mockLoadFromStorage.mockReturnValue({
      ...mockAppState,
      feedback: [oldFeedback, mockFeedback, newFeedback]
    });

    const { result } = renderHook(() => useFeedback());
    
    const memberFeedback = result.current.getFeedbackByRecipient('member', 'member-1');
    
    expect(memberFeedback[0]).toEqual(newFeedback);
    expect(memberFeedback[1]).toEqual(mockFeedback);
    expect(memberFeedback[2]).toEqual(oldFeedback);
  });

  it('handles empty storage gracefully', () => {
    mockLoadFromStorage.mockReturnValue({
      teamMembers: [],
      teams: [],
      feedback: []
    });
    
    const { result } = renderHook(() => useFeedback());
    
    expect(result.current.feedback).toEqual([]);
  });
});