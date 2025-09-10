import { FormErrors, ValidationResult } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateTeamMember = (name: string, email: string): ValidationResult => {
  const errors: FormErrors = {};

  if (!validateRequired(name)) {
    errors.name = 'Name is required';
  }

  if (!validateRequired(email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateTeam = (name: string): ValidationResult => {
  const errors: FormErrors = {};

  if (!validateRequired(name)) {
    errors.name = 'Team name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateFeedback = (content: string): ValidationResult => {
  const errors: FormErrors = {};

  if (!validateRequired(content)) {
    errors.content = 'Feedback content is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};