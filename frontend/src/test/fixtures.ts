import { TeamMember, Team, Feedback, AppState } from '../types';

export const mockTeamMember: TeamMember = {
  id: 'member-1',
  name: 'John Doe',
  email: 'john@example.com',
  picture: 'data:image/jpeg;base64,fake-image-data',
  teamIds: ['team-1']
};

export const mockTeam: Team = {
  id: 'team-1',
  name: 'Development Team',
  logo: 'data:image/jpeg;base64,fake-logo-data',
  memberIds: ['member-1']
};

export const mockFeedback: Feedback = {
  id: 'feedback-1',
  recipientType: 'member',
  recipientId: 'member-1',
  content: 'Great work on the project!',
  timestamp: new Date('2024-01-01T10:00:00Z')
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