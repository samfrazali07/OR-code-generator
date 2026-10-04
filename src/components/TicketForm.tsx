import React, { useState } from 'react';
import type { TicketInput, TicketValidationErrors } from '../types/ticket';
import { validateTicketInput } from '../utils/validation';

interface TicketFormProps {
  onSubmit: (ticketData: TicketInput) => Promise<void>;
  isLoading: boolean;
  simulateNetworkError: boolean;
  onToggleSimulateNetworkError: (value: boolean) => void;
}

const INITIAL_FORM_STATE: TicketInput = {
  ticketNumber: '',
  eventName: '',
  attendeeName: '',
  attendeeEmail: '',
  ticketType: 'GENERAL',
  price: '99.00',
  currency: 'USD',
};

export const TicketForm: React.FC<TicketFormProps> = ({
  onSubmit,
  isLoading,
  simulateNetworkError,
  onToggleSimulateNetworkError,
}) => {
  const [formData, setFormData] = useState<TicketInput>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<TicketValidationErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If user changes a field that previously had error, revalidate that field
    if (errors[name as keyof TicketValidationErrors]) {
      const updated = { ...formData, [name]: value };
      const validation = validateTicketInput(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name as keyof TicketValidationErrors],
      }));
    }
  };

  const handleBlur = () => {
    const validation = validateTicketInput(formData);
    setErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTicketInput(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  return (
    <section className="form-card" aria-labelledby="form-heading">
      <div className="card-header">
        <h2 id="form-heading" className="card-title">
          Ticket Provisioning & Generation
        </h2>
        <p className="card-subtitle">
          Enter validated ticket metadata to issue an encrypted QR verification artifact.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="ticket-form">
        {/* Ticket Number Field */}
        <div className="form-group">
          <label htmlFor="ticketNumber" className="form-label">
            Ticket Number <span className="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="ticketNumber"
            name="ticketNumber"
            type="text"
            className={`form-input ${errors.ticketNumber ? 'input-error' : ''}`}
            value={formData.ticketNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={errors.ticketNumber ? 'true' : 'false'}
            aria-describedby={errors.ticketNumber ? 'ticketNumber-error' : undefined}
            placeholder="e.g. TCK-2026-9081"
            disabled={isLoading}
          />
          {errors.ticketNumber && (
            <div id="ticketNumber-error" role="alert" className="field-error">
              <span className="error-icon" aria-hidden="true">!</span>
              {errors.ticketNumber}
            </div>
          )}
        </div>

        {/* Event Name Field */}
        <div className="form-group">
          <label htmlFor="eventName" className="form-label">
            Event Name <span className="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="eventName"
            name="eventName"
            type="text"
            className={`form-input ${errors.eventName ? 'input-error' : ''}`}
            value={formData.eventName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={errors.eventName ? 'true' : 'false'}
            aria-describedby={errors.eventName ? 'eventName-error' : undefined}
            placeholder="e.g. Global Tech Summit 2026"
            disabled={isLoading}
          />
          {errors.eventName && (
            <div id="eventName-error" role="alert" className="field-error">
              <span className="error-icon" aria-hidden="true">!</span>
              {errors.eventName}
            </div>
          )}
        </div>

        {/* Attendee Full Name Field */}
        <div className="form-group">
          <label htmlFor="attendeeName" className="form-label">
            Attendee Full Name <span className="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="attendeeName"
            name="attendeeName"
            type="text"
            className={`form-input ${errors.attendeeName ? 'input-error' : ''}`}
            value={formData.attendeeName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={errors.attendeeName ? 'true' : 'false'}
            aria-describedby={errors.attendeeName ? 'attendeeName-error' : undefined}
            placeholder="e.g. Jane Doe"
            disabled={isLoading}
          />
          {errors.attendeeName && (
            <div id="attendeeName-error" role="alert" className="field-error">
              <span className="error-icon" aria-hidden="true">!</span>
              {errors.attendeeName}
            </div>
          )}
        </div>

        {/* Attendee Email Address Field */}
        <div className="form-group">
          <label htmlFor="attendeeEmail" className="form-label">
            Attendee Email Address <span className="required-indicator" aria-hidden="true">*</span>
          </label>
          <input
            id="attendeeEmail"
            name="attendeeEmail"
            type="email"
            className={`form-input ${errors.attendeeEmail ? 'input-error' : ''}`}
            value={formData.attendeeEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={errors.attendeeEmail ? 'true' : 'false'}
            aria-describedby={errors.attendeeEmail ? 'attendeeEmail-error' : undefined}
            placeholder="e.g. jane.doe@enterprise.corp"
            disabled={isLoading}
          />
          {errors.attendeeEmail && (
            <div id="attendeeEmail-error" role="alert" className="field-error">
              <span className="error-icon" aria-hidden="true">!</span>
              {errors.attendeeEmail}
            </div>
          )}
        </div>

        {/* Dual Column: Tier and Price */}
        <div className="form-row-grid">
          <div className="form-group">
            <label htmlFor="ticketType" className="form-label">
              Ticket Tier <span className="required-indicator" aria-hidden="true">*</span>
            </label>
            <select
              id="ticketType"
              name="ticketType"
              className={`form-select ${errors.ticketType ? 'input-error' : ''}`}
              value={formData.ticketType}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={errors.ticketType ? 'true' : 'false'}
              aria-describedby={errors.ticketType ? 'ticketType-error' : undefined}
              disabled={isLoading}
            >
              <option value="GENERAL">General Admission</option>
              <option value="VIP">VIP All-Access</option>
              <option value="EARLY_BIRD">Early Bird Pass</option>
              <option value="STAFF">Crew / Staff</option>
              <option value="PRESS">Media & Press</option>
            </select>
            {errors.ticketType && (
              <div id="ticketType-error" role="alert" className="field-error">
                <span className="error-icon" aria-hidden="true">!</span>
                {errors.ticketType}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Ticket Price (USD) <span className="required-indicator" aria-hidden="true">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="text"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={errors.price ? 'true' : 'false'}
              aria-describedby={errors.price ? 'price-error' : undefined}
              placeholder="0.00"
              disabled={isLoading}
            />
            {errors.price && (
              <div id="price-error" role="alert" className="field-error">
                <span className="error-icon" aria-hidden="true">!</span>
                {errors.price}
              </div>
            )}
          </div>
        </div>

        {/* Resilience Testing Controls */}
        <div className="simulation-box">
          <label htmlFor="simulateNetworkError" className="checkbox-label">
            <input
              id="simulateNetworkError"
              type="checkbox"
              checked={simulateNetworkError}
              onChange={(e) => onToggleSimulateNetworkError(e.target.checked)}
              className="checkbox-input"
            />
            <span className="checkbox-text">
              Simulate network failure (Unhappy path resilience test)
            </span>
          </label>
        </div>

        {/* Action Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            aria-busy={isLoading ? 'true' : 'false'}
          >
            {isLoading ? 'Processing Provisioning...' : 'Generate QR Code Ticket'}
          </button>
        </div>
      </form>
    </section>
  );
};
