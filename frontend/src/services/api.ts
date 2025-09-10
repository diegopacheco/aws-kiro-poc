interface ApiError {
  message: string;
  status: number;
  details?: any;
}

interface CreateTeamMemberRequest {
  name: string;
  email: string;
  picture?: string;
}

interface CreateTeamRequest {
  name: string;
  logo?: string;
}

interface CreateFeedbackRequest {
  target_type: 'team' | 'member';
  target_id: number;
  content: string;
}

interface AssignmentRequest {
  team_id: number;
  team_member_id: number;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  picture?: string;
  teams?: Team[];
}

interface Team {
  id: number;
  name: string;
  logo?: string;
  members?: TeamMember[];
}

interface Feedback {
  id: number;
  target_type: 'team' | 'member';
  target_id: number;
  content: string;
  created_at: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status
      };
      
      try {
        const errorData = await response.json();
        error.details = errorData;
        error.message = errorData.error || error.message;
      } catch {
        // Use default message if JSON parsing fails
      }
      
      throw error;
    }
    
    return response.json();
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response);
  }

  // Team Members
  async createTeamMember(member: CreateTeamMemberRequest): Promise<TeamMember> {
    return this.request<TeamMember>('/team-members', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    return this.request<TeamMember[]>('/team-members');
  }

  // Teams
  async createTeam(team: CreateTeamRequest): Promise<Team> {
    return this.request<Team>('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async getTeams(): Promise<Team[]> {
    return this.request<Team[]>('/teams');
  }

  async getTeamById(teamId: number): Promise<Team> {
    return this.request<Team>(`/teams/${teamId}`);
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return this.request<TeamMember[]>(`/teams/${teamId}/members`);
  }

  async deleteTeam(teamId: number): Promise<void> {
    await this.request<void>(`/teams/${teamId}`, {
      method: 'DELETE',
    });
  }

  async removeMemberFromTeam(teamId: number, memberId: number): Promise<void> {
    await this.request<void>(`/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Feedback
  async createFeedback(feedback: CreateFeedbackRequest): Promise<Feedback> {
    return this.request<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return this.request<Feedback[]>('/feedback');
  }

  async getFeedbackByTeam(teamId: number): Promise<Feedback[]> {
    return this.request<Feedback[]>(`/feedback/team/${teamId}`);
  }

  async getFeedbackByMember(memberId: number): Promise<Feedback[]> {
    return this.request<Feedback[]>(`/feedback/member/${memberId}`);
  }

  // Assignments
  async assignMemberToTeam(assignment: AssignmentRequest): Promise<void> {
    await this.request<void>('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  async getAllAssignments(): Promise<any[]> {
    return this.request<any[]>('/assignments');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  ApiError,
  CreateTeamMemberRequest,
  CreateTeamRequest,
  CreateFeedbackRequest,
  AssignmentRequest,
  TeamMember,
  Team,
  Feedback
};