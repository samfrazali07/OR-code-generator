import React from 'react';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data found',
  description = 'No ticket records match your current search query or filter criteria.',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="empty-state-container"
    >
      <div className="empty-state-icon" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h3 className="empty-state-title">{message}</h3>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
};
