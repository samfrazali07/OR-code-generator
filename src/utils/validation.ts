import type { TicketInput, TicketValidationErrors } from '../types/ticket';

// Robust email pattern matching standard enterprise format
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface ValidationResult {
  isValid: boolean;
  errors: TicketValidationErrors;
}

export function validateTicketInput(input: Partial<TicketInput>): ValidationResult {
  const errors: TicketValidationErrors = {};

  // Ticket Number Validation
  if (!input.ticketNumber || input.ticketNumber.trim().length === 0) {
    errors.ticketNumber = 'Ticket number is required.';
  }

  // Event Name Validation
  if (!input.eventName || input.eventName.trim().length === 0) {
    errors.eventName = 'Event name is required.';
  }

  // Attendee Name Validation
  if (!input.attendeeName || input.attendeeName.trim().length === 0) {
    errors.attendeeName = 'Attendee name is required.';
  }

  // Attendee Email Validation
  if (!input.attendeeEmail || input.attendeeEmail.trim().length === 0) {
    errors.attendeeEmail = 'Attendee email is required.';
  } else if (!EMAIL_REGEX.test(input.attendeeEmail.trim())) {
    errors.attendeeEmail = 'Please enter a valid email address.';
  }

  // Ticket Type Validation
  if (!input.ticketType || input.ticketType.trim().length === 0) {
    errors.ticketType = 'Ticket type is required.';
  }

  // Price Validation
  if (input.price === undefined || input.price === null || String(input.price).trim().length === 0) {
    errors.price = 'Price is required.';
  } else {
    const numericPrice = Number(input.price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      errors.price = 'Price must be zero or a positive number.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
