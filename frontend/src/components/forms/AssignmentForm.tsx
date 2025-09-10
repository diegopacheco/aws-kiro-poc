import React, { useState } from 'react';
import { Button, Card } from '../common';
import { TeamMember, Team } from '../../types';

interface AssignmentFormProps {
  teamMembers: TeamMember[];
  teams: Team[];
  onAssign: (memberId: number, teamId: number) => void;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  teamMembers,
  teams,
  onAssign
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMemberId && selectedTeamId) {
      onAssign(parseInt(selectedMemberId, 10), parseInt(selectedTeamId, 10));
      setSelectedMemberId('');
      setSelectedTeamId('');
    }
  };

  if (teamMembers.length === 0 && teams.length === 0) {
    return (
      <Card title="Assign to Team">
        <p className="text-gray-500">No team members or teams available. Please create some first.</p>
      </Card>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <Card title="Assign to Team">
        <p className="text-gray-500">No team members available. Please add some team members first.</p>
      </Card>
    );
  }

  if (teams.length === 0) {
    return (
      <Card title="Assign to Team">
        <p className="text-gray-500">No teams available. Please create some teams first.</p>
      </Card>
    );
  }

  return (
    <Card title="Assign to Team">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Team Member <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a team member...</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Team <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={!selectedMemberId || !selectedTeamId}>
          Assign to Team
        </Button>
      </form>
    </Card>
  );
};