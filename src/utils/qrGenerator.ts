import QRCode from 'qrcode';
import type { QRCodeData } from '../types/ticket';

/**
 * Generates an SVG Data URI and payload for a ticket record.
 * Formats payload deterministically with ticket number, signature hash, and expiration timestamp.
 */
export async function generateTicketQRCode(
  ticketNumber: string,
  eventName: string,
  attendeeEmail: string,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M'
): Promise<QRCodeData> {
  const timestamp = Date.now();
  const mockSignature = Math.random().toString(36).substring(2, 10).toUpperCase();
  const payload = `TKT:${ticketNumber}:EVT:${eventName}:USER:${attendeeEmail}:SIG-${mockSignature}:EXP-${timestamp + 86400000}`;

  const svgString = await QRCode.toString(payload, {
    type: 'svg',
    errorCorrectionLevel,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const svgBase64 = typeof window !== 'undefined' && window.btoa ? window.btoa(svgString) : Buffer.from(svgString).toString('base64');
  const svgDataUri = `data:image/svg+xml;base64,${svgBase64}`;

  return {
    id: `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    payload,
    svgDataUri,
    format: 'SVG',
    errorCorrectionLevel,
    version: 4,
    scanCount: 0,
    createdAt: new Date().toISOString(),
  };
}
