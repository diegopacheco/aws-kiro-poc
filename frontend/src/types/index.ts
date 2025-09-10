export interface TeamMember {
  id: number;
  name: string;
  email: string;
  picture?: string;
  teams?: Team[];
}

export interface Team {
  id: number;
  name: string;
  logo?: string;
  members?: TeamMember[];
}

export interface Feedback {
  id: number;
  target_type: 'team' | 'member';
  target_id: number;
  content: string;
  created_at: string;
  // Legacy properties for backward compatibility
  recipientType?: 'team' | 'member';
  recipientId?: number;
  timestamp?: Date;
}

export interface AppState {
  teamMembers: TeamMember[];
  teams: Team[];
  feedback: Feedback[];
}

// API Request types
export interface CreateTeamMemberRequest {
  name: string;
  email: string;
  picture?: string;
}

export interface CreateTeamRequest {
  name: string;
  logo?: string;
}

export interface CreateFeedbackRequest {
  target_type: 'team' | 'member';
  target_id: number;
  content: string;
}

export interface AssignmentRequest {
  team_id: number;
  team_member_id: number;
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}