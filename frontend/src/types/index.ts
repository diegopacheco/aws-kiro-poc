export interface TeamMember {
  id: string;
  name: string;
  email: string;
  picture?: string;
  teamIds: string[];
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  memberIds: string[];
}

export interface Feedback {
  id: string;
  recipientType: 'team' | 'member';
  recipientId: string;
  content: string;
  timestamp: Date;
}

export interface AppState {
  teamMembers: TeamMember[];
  teams: Team[];
  feedback: Feedback[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}