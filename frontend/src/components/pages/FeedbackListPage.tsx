import React, { useState, useMemo } from 'react';
import { useFeedback, useTeamMembers, useTeams } from '../../hooks';
import { Card } from '../common';

interface FeedbackFilters {
  type: 'all' | 'team' | 'member';
  targetId?: number;
}

export const FeedbackListPage: React.FC = () => {
  const { feedback, loading, error } = useFeedback();
  const { teamMembers } = useTeamMembers();
  const { teams } = useTeams();
  const [filters, setFilters] = useState<FeedbackFilters>({ type: 'all' });

  const filteredFeedback = useMemo(() => {
    if (filters.type === 'all') {
      return feedback;
    }
    
    return feedback.filter(f => 
      f.target_type === filters.type && 
      (filters.targetId ? f.target_id === filters.targetId : true)
    );
  }, [feedback, filters]);

  const getTargetName = (targetType: 'team' | 'member', targetId: number) => {
    if (targetType === 'team') {
      const team = teams.find(t => t.id === targetId);
      return team ? team.name : 'Unknown Team';
    } else {
      const member = teamMembers.find(m => m.id === targetId);
      return member ? member.name : 'Unknown Member';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading feedback...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading feedback: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Feedback</h1>
        
        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by:
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ 
                  type: e.target.value as 'all' | 'team' | 'member',
                  targetId: undefined 
                })}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Feedback</option>
                <option value="team">Teams Only</option>
                <option value="member">Members Only</option>
              </select>
            </div>

            {filters.type === 'team' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Team:
                </label>
                <select
                  value={filters.targetId || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    targetId: e.target.value ? Number(e.target.value) : undefined
                  })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Teams</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filters.type === 'member' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Member:
                </label>
                <select
                  value={filters.targetId || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    targetId: e.target.value ? Number(e.target.value) : undefined
                  })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Members</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(filters.type !== 'all' || filters.targetId) && (
              <button
                onClick={() => setFilters({ type: 'all' })}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredFeedback.length} of {feedback.length} feedback entries
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            {filters.type === 'all' 
              ? 'No feedback available yet.' 
              : 'No feedback matches the selected filters.'
            }
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedback
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((feedbackItem) => (
              <Card key={feedbackItem.id}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${feedbackItem.target_type === 'team' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                      }
                    `}>
                      {feedbackItem.target_type === 'team' ? 'Team' : 'Member'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {getTargetName(feedbackItem.target_type, feedbackItem.target_id)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(feedbackItem.created_at)}
                  </span>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {feedbackItem.content}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};