import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div role="alert" className="error-banner">
      <div className="error-banner-content">
        <span className="error-banner-badge" aria-hidden="true">
          [ERROR]
        </span>
        <p className="error-banner-text">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="error-banner-dismiss"
          aria-label="Dismiss error notification"
        >
          &times;
        </button>
      )}
    </div>
  );
};
