import { describe, it, expect } from 'vitest';
import { validateTicketInput } from '../utils/validation';

describe('Validation Unit Tests', () => {
  const validTicket = {
    ticketNumber: 'TCK-2026-001',
    eventName: 'Corporate Annual Gala',
    attendeeName: 'John Doe',
    attendeeEmail: 'john.doe@enterprise.com',
    ticketType: 'VIP',
    price: '150.00',
    currency: 'USD',
  };

  it('passes validation with complete and valid ticket data', () => {
    const result = validateTicketInput(validTicket);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects empty required fields and returns corresponding error messages', () => {
    const emptyTicket = {
      ticketNumber: '   ',
      eventName: '',
      attendeeName: '',
      attendeeEmail: '',
      ticketType: '',
      price: '',
      currency: '',
    };
    const result = validateTicketInput(emptyTicket);
    expect(result.isValid).toBe(false);
    expect(result.errors.ticketNumber).toBe('Ticket number is required.');
    expect(result.errors.eventName).toBe('Event name is required.');
    expect(result.errors.attendeeName).toBe('Attendee name is required.');
    expect(result.errors.attendeeEmail).toBe('Attendee email is required.');
    expect(result.errors.ticketType).toBe('Ticket type is required.');
    expect(result.errors.price).toBe('Price is required.');
  });

  it('rejects malformed email addresses', () => {
    const malformedEmails = ['plainaddress', '@missingusername.com', 'username@.com', 'user@domain..com'];
    malformedEmails.forEach((email) => {
      const result = validateTicketInput({ ...validTicket, attendeeEmail: email });
      expect(result.isValid).toBe(false);
      expect(result.errors.attendeeEmail).toBe('Please enter a valid email address.');
    });
  });

  it('rejects negative prices and non-numeric price inputs', () => {
    const negativeResult = validateTicketInput({ ...validTicket, price: '-25.00' });
    expect(negativeResult.isValid).toBe(false);
    expect(negativeResult.errors.price).toBe('Price must be zero or a positive number.');

    const nonNumericResult = validateTicketInput({ ...validTicket, price: 'abc' });
    expect(nonNumericResult.isValid).toBe(false);
    expect(nonNumericResult.errors.price).toBe('Price must be zero or a positive number.');
  });

  it('accepts zero as a valid free ticket price', () => {
    const result = validateTicketInput({ ...validTicket, price: '0' });
    expect(result.isValid).toBe(true);
    expect(result.errors.price).toBeUndefined();
  });
});
