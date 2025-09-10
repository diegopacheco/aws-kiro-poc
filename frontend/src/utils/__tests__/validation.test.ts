import {
  validateEmail,
  validateRequired,
  validateTeamMember,
  validateTeam,
  validateFeedback
} from '../validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('returns true for non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('  test  ')).toBe(true);
    });

    it('returns false for empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired('\t\n')).toBe(false);
    });
  });

  describe('validateTeamMember', () => {
    it('returns valid result for valid team member data', () => {
      const result = validateTeamMember('John Doe', 'john@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns invalid result when name is empty', () => {
      const result = validateTeamMember('', 'john@example.com');
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
    });

    it('returns invalid result when email is empty', () => {
      const result = validateTeamMember('John Doe', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required');
    });

    it('returns invalid result when email is invalid', () => {
      const result = validateTeamMember('John Doe', 'invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    it('returns multiple errors when both name and email are invalid', () => {
      const result = validateTeamMember('', 'invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
      expect(result.errors.email).toBe('Please enter a valid email address');
    });
  });

  describe('validateTeam', () => {
    it('returns valid result for valid team name', () => {
      const result = validateTeam('Development Team');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns invalid result when team name is empty', () => {
      const result = validateTeam('');
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Team name is required');
    });

    it('returns invalid result when team name is whitespace only', () => {
      const result = validateTeam('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Team name is required');
    });
  });

  describe('validateFeedback', () => {
    it('returns valid result for valid feedback content', () => {
      const result = validateFeedback('Great work on the project!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns invalid result when feedback content is empty', () => {
      const result = validateFeedback('');
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('Feedback content is required');
    });

    it('returns invalid result when feedback content is whitespace only', () => {
      const result = validateFeedback('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('Feedback content is required');
    });
  });
});