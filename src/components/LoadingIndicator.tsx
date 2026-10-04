import React from 'react';

interface LoadingIndicatorProps {
  label?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  label = 'Generating QR code...',
}) => {
  return (
    <div
      data-testid="loading-indicator"
      role="status"
      aria-live="polite"
      className="loading-indicator-container"
    >
      <div className="loading-spinner" aria-hidden="true" />
      <span className="loading-text">{label}</span>
    </div>
  );
};
