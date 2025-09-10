import React, { useEffect } from 'react';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  id, 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg 
      transform transition-all duration-300 ease-in-out
      flex items-center space-x-2 min-w-64 max-w-96
      ${getTypeStyles()}
    `}>
      <span className="text-lg font-bold">{getIcon()}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-2 text-white hover:text-gray-200 font-bold text-lg"
      >
        ×
      </button>
    </div>
  );
};