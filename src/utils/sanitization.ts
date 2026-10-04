import type { TicketInput } from '../types/ticket';

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Sanitizes user-controlled string by trimming and encoding HTML entities.
 * Neutralizes scripts, event handlers, and malicious DOM injection vectors.
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (input === null || input === undefined) {
    return '';
  }

  const trimmed = String(input).trim();
  return trimmed.replace(/[&<>"']/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Sanitizes all string properties of a TicketInput object before storage in application state.
 */
export function sanitizeTicketInput(input: Partial<TicketInput>): Partial<TicketInput> {
  const sanitized: Partial<TicketInput> = {};

  if (input.ticketNumber !== undefined) {
    sanitized.ticketNumber = sanitizeInput(input.ticketNumber);
  }
  if (input.eventName !== undefined) {
    sanitized.eventName = sanitizeInput(input.eventName);
  }
  if (input.attendeeName !== undefined) {
    sanitized.attendeeName = sanitizeInput(input.attendeeName);
  }
  if (input.attendeeEmail !== undefined) {
    sanitized.attendeeEmail = sanitizeInput(input.attendeeEmail);
  }
  if (input.ticketType !== undefined) {
    sanitized.ticketType = sanitizeInput(input.ticketType);
  }
  if (input.price !== undefined) {
    sanitized.price = sanitizeInput(input.price);
  }
  if (input.currency !== undefined) {
    sanitized.currency = sanitizeInput(input.currency);
  }

  return sanitized;
}
