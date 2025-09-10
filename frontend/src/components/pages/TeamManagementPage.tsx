import React, { useState } from 'react';
import { useTeams } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import { Card, Button } from '../common';

export const TeamManagementPage: React.FC = () => {
  const { teams, loading, error, deleteTeam, removeMemberFromTeam } = useTeams();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<{ teamId: number; memberId: number } | null>(null);

  const handleDeleteTeam = async (teamId: number) => {
    const success = await deleteTeam(teamId);
    if (success) {
      showToast('Team deleted successfully!', 'success');
      setConfirmDelete(null);
    } else {
      showToast('Failed to delete team', 'error');
    }
  };

  const handleRemoveMember = async (teamId: number, memberId: number) => {
    const success = await removeMemberFromTeam(teamId, memberId);
    if (success) {
      showToast('Member removed from team successfully!', 'success');
      setConfirmRemove(null);
    } else {
      showToast('Failed to remove member from team', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading teams...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading teams: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
        <p className="text-gray-600">Manage your teams and their members</p>
      </div>

      {teams.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            No teams created yet. Create your first team to get started.
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {teams.map((team) => (
            <Card key={team.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {team.logo && (
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                    <p className="text-sm text-gray-600">
                      {team.members?.length || 0} member(s)
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmDelete(team.id)}
                  disabled={loading}
                >
                  Delete Team
                </Button>
              </div>

              {/* Team Members */}
              {team.members && team.members.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Team Members</h3>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div 
                        key={member.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {member.picture && (
                            <img 
                              src={member.picture} 
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-600">{member.email}</div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmRemove({ teamId: team.id, memberId: member.id })}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                  No members assigned to this team yet.
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Team Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Team</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this team? This action cannot be undone and will remove all team assignments.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteTeam(confirmDelete)}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Team'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Member</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove this member from the team?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setConfirmRemove(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleRemoveMember(confirmRemove.teamId, confirmRemove.memberId)}
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove Member'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};