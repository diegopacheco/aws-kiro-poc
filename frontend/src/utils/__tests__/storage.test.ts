import { loadFromStorage, saveToStorage, generateId } from '../storage';
import { mockAppState, emptyAppState } from '../../test/fixtures';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('storage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadFromStorage', () => {
    it('returns default state when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = loadFromStorage();
      
      expect(result).toEqual(emptyAppState);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('coaching-app-data');
    });

    it('returns parsed data from localStorage', () => {
      const storedData = {
        teamMembers: [mockAppState.teamMembers[0]],
        teams: [mockAppState.teams[0]],
        feedback: [{
          ...mockAppState.feedback[0],
          timestamp: mockAppState.feedback[0].timestamp.toISOString()
        }]
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));
      
      const result = loadFromStorage();
      
      expect(result.teamMembers).toEqual(mockAppState.teamMembers);
      expect(result.teams).toEqual(mockAppState.teams);
      expect(result.feedback[0].timestamp).toBeInstanceOf(Date);
    });

    it('returns default state when JSON parsing fails', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = loadFromStorage();
      
      expect(result).toEqual(emptyAppState);
    });

    it('handles missing feedback array gracefully', () => {
      const storedData = {
        teamMembers: [],
        teams: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));
      
      const result = loadFromStorage();
      
      expect(result.feedback).toEqual([]);
    });
  });

  describe('saveToStorage', () => {
    it('saves state to localStorage', () => {
      saveToStorage(mockAppState);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'coaching-app-data',
        JSON.stringify(mockAppState)
      );
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => saveToStorage(mockAppState)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save to localStorage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('generates string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('generates IDs with reasonable length', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(10);
    });
  });
});