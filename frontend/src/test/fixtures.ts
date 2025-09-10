import { TeamMember, Team, Feedback, AppState } from '../types';

export const mockTeamMember: TeamMember = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  picture: 'data:image/jpeg;base64,fake-image-data'
};

export const mockTeam: Team = {
  id: 1,
  name: 'Development Team',
  logo: 'data:image/jpeg;base64,fake-logo-data'
};

export const mockFeedback: Feedback = {
  id: 1,
  target_type: 'member',
  target_id: 1,
  content: 'Great work on the project!',
  created_at: '2024-01-01T10:00:00Z'
};

export const mockAppState: AppState = {
  teamMembers: [mockTeamMember],
  teams: [mockTeam],
  feedback: [mockFeedback]
};

export const emptyAppState: AppState = {
  teamMembers: [],
  teams: [],
  feedback: []
};