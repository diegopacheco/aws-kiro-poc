import React from 'react';
import { AssignmentForm } from '../forms';
import { useTeamMembers, useTeams } from '../../hooks';

export const AssignToTeamPage: React.FC = () => {
  const { teamMembers, updateTeamMember } = useTeamMembers();
  const { teams, updateTeam } = useTeams();

  const handleAssign = (memberId: string, teamId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    const team = teams.find(t => t.id === teamId);
    
    if (member && team) {
      if (!member.teamIds.includes(teamId)) {
        updateTeamMember(memberId, {
          teamIds: [...member.teamIds, teamId]
        });
      }
      
      if (!team.memberIds.includes(memberId)) {
        updateTeam(teamId, {
          memberIds: [...team.memberIds, memberId]
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AssignmentForm
        teamMembers={teamMembers}
        teams={teams}
        onAssign={handleAssign}
      />
    </div>
  );
};