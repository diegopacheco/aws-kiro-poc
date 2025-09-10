import React from 'react';
import { Feedback, TeamMember, Team } from '../../types';
import { Card } from './Card';

interface FeedbackHistoryProps {
  feedback: Feedback[];
  teamMembers: TeamMember[];
  teams: Team[];
}

export const FeedbackHistory: React.FC<FeedbackHistoryProps> = ({
  feedback,
  teamMembers,
  teams
}) => {
  const getRecipientName = (feedback: Feedback): string => {
    if (feedback.recipientType === 'member') {
      const member = teamMembers.find(m => m.id === feedback.recipientId);
      return member ? member.name : 'Unknown Member';
    } else {
      const team = teams.find(t => t.id === feedback.recipientId);
      return team ? team.name : 'Unknown Team';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (feedback.length === 0) {
    return (
      <Card title="Feedback History">
        <p className="text-gray-500">No feedback has been given yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Feedback History">
      <div className="space-y-4">
        {feedback.map((item) => (
          <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">
                {getRecipientName(item)} ({item.recipientType})
              </h4>
              <span className="text-sm text-gray-500">
                {formatDate(item.timestamp)}
              </span>
            </div>
            <p className="text-gray-700">{item.content}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};