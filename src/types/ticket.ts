export type TicketType = 'GENERAL' | 'VIP' | 'EARLY_BIRD' | 'STAFF' | 'PRESS';

export type TicketStatus = 'DRAFT' | 'ISSUED' | 'CHECKED_IN' | 'CANCELLED' | 'VOIDED';

export interface TicketInput {
  ticketNumber: string;
  eventName: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketType: string;
  price: string;
  currency: string;
}

export interface TicketValidationErrors {
  ticketNumber?: string;
  eventName?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  ticketType?: string;
  price?: string;
  currency?: string;
}

export interface QRCodeData {
  id: string;
  payload: string;
  svgDataUri: string;
  format: 'SVG' | 'PNG';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  version: number;
  scanCount: number;
  createdAt: string;
}

export interface TicketRecord {
  id: string;
  ticketNumber: string;
  eventName: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketType: TicketType | string;
  price: number;
  currency: string;
  status: TicketStatus;
  workerId: string;
  validFrom: string;
  validUntil: string;
  qrCode?: QRCodeData;
  createdAt: string;
  updatedAt: string;
}
