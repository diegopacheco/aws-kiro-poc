import React from 'react';
import { FeedbackForm } from '../forms';
import { FeedbackHistory } from '../common/FeedbackHistory';
import { useTeamMembers, useTeams, useFeedback } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';

export const GiveFeedbackPage: React.FC = () => {
  const { teamMembers } = useTeamMembers();
  const { teams } = useTeams();
  const { feedback, addFeedback, loading } = useFeedback();
  const { showToast } = useToast();

  const handleSubmit = async (data: { target_type: 'team' | 'member'; target_id: number; content: string }) => {
    const result = await addFeedback(data);
    if (result) {
      showToast('Feedback submitted successfully!', 'success');
    } else {
      showToast('Failed to submit feedback', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackForm
          teamMembers={teamMembers}
          teams={teams}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <FeedbackHistory
          feedback={feedback}
          teamMembers={teamMembers}
          teams={teams}
        />
      </div>
    </div>
  );
};