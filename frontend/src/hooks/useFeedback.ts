import { useState, useEffect } from 'react';
import { Feedback } from '../types';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const data = loadFromStorage();
    setFeedback(data.feedback);
  }, []);

  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'timestamp'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: generateId(),
      timestamp: new Date()
    };
    
    const updatedFeedback = [...feedback, newFeedback];
    setFeedback(updatedFeedback);
    
    const currentData = loadFromStorage();
    saveToStorage({
      ...currentData,
      feedback: updatedFeedback
    });
    
    return newFeedback;
  };

  const getFeedbackByRecipient = (recipientType: 'team' | 'member', recipientId: string) => {
    return feedback.filter(f => 
      f.recipientType === recipientType && f.recipientId === recipientId
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  return {
    feedback,
    addFeedback,
    getFeedbackByRecipient
  };
};