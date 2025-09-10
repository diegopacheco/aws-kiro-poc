import React from 'react';
import { FeedbackForm } from '../forms';
import { FeedbackHistory } from '../common/FeedbackHistory';
import { useTeamMembers, useTeams, useFeedback } from '../../hooks';

export const GiveFeedbackPage: React.FC = () => {
  const { teamMembers } = useTeamMembers();
  const { teams } = useTeams();
  const { feedback, addFeedback } = useFeedback();

  const handleSubmit = (data: { recipientType: 'team' | 'member'; recipientId: string; content: string }) => {
    addFeedback(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackForm
          teamMembers={teamMembers}
          teams={teams}
          onSubmit={handleSubmit}
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