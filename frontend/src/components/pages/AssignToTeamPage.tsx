import React from 'react';
import { AssignmentForm } from '../forms';
import { useTeamMembers, useTeams, useAssignments } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';

export const AssignToTeamPage: React.FC = () => {
  const { teamMembers, refreshTeamMembers } = useTeamMembers();
  const { teams, refreshTeams } = useTeams();
  const { assignMemberToTeam, loading } = useAssignments();
  const { showToast } = useToast();

  const handleAssign = async (memberId: number, teamId: number) => {
    const result = await assignMemberToTeam({
      team_member_id: memberId,
      team_id: teamId
    });
    
    if (result) {
      showToast('Member assigned to team successfully!', 'success');
      // Refresh data to show updated assignments
      refreshTeamMembers();
      refreshTeams();
    } else {
      showToast('Failed to assign member to team', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AssignmentForm
        teamMembers={teamMembers}
        teams={teams}
        onAssign={handleAssign}
        loading={loading}
      />
    </div>
  );
};