import React, { useState } from 'react';
import { Button, Card } from '../common';
import { TeamMember, Team } from '../../types';
import { validateFeedback } from '../../utils/validation';
import { FormErrors } from '../../types';

interface FeedbackFormProps {
  teamMembers: TeamMember[];
  teams: Team[];
  onSubmit: (data: { recipientType: 'team' | 'member'; recipientId: string; content: string }) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  teamMembers,
  teams,
  onSubmit
}) => {
  const [recipientType, setRecipientType] = useState<'team' | 'member'>('member');
  const [recipientId, setRecipientId] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateFeedback(content);
    setErrors(validation.errors);

    if (validation.isValid && recipientId) {
      onSubmit({
        recipientType,
        recipientId,
        content
      });
      setRecipientId('');
      setContent('');
    }
  };

  const recipients = recipientType === 'team' ? teams : teamMembers;

  return (
    <Card title="Give Feedback">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="member"
                checked={recipientType === 'member'}
                onChange={(e) => {
                  setRecipientType(e.target.value as 'member');
                  setRecipientId('');
                }}
                className="mr-2"
              />
              Individual
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="team"
                checked={recipientType === 'team'}
                onChange={(e) => {
                  setRecipientType(e.target.value as 'team');
                  setRecipientId('');
                }}
                className="mr-2"
              />
              Team
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select {recipientType === 'team' ? 'Team' : 'Team Member'} <span className="text-red-500">*</span>
          </label>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a {recipientType === 'team' ? 'team' : 'team member'}...</option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name}
                {recipientType === 'member' && ` (${(recipient as TeamMember).email})`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            placeholder="Enter your feedback..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <Button type="submit" disabled={!recipientId || !content.trim()}>
          Submit Feedback
        </Button>
      </form>
    </Card>
  );
};