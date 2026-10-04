import React from 'react';
import type { TicketRecord } from '../types/ticket';

interface QRCodeCardProps {
  ticket: TicketRecord;
  onClose?: () => void;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ ticket, onClose }) => {
  const qrCode = ticket.qrCode;

  const handleDownload = () => {
    if (!qrCode?.svgDataUri) return;
    const a = document.createElement('a');
    a.href = qrCode.svgDataUri;
    a.download = `QR_${ticket.ticketNumber}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <article className="qr-preview-card" aria-labelledby="qr-card-title">
      <div className="card-header qr-header">
        <div>
          <h2 id="qr-card-title" className="card-title">
            Digital QR Pass Verification
          </h2>
          <p className="card-subtitle">
            Cryptographically bound to Ticket Reference #{ticket.ticketNumber}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            aria-label="Close QR pass view"
          >
            &times;
          </button>
        )}
      </div>

      <div className="qr-body">
        {/* QR Code Graphic Container */}
        <div className="qr-display-box">
          {qrCode?.svgDataUri ? (
            <img
              src={qrCode.svgDataUri}
              alt={`QR Code for Ticket ${ticket.ticketNumber}`}
              className="qr-image"
              width="220"
              height="220"
            />
          ) : (
            <div className="qr-placeholder" role="status">
              QR Code pending generation
            </div>
          )}
        </div>

        {/* Security & Pass Metadata */}
        <div className="ticket-meta-details">
          <div className="meta-row">
            <span className="meta-label">Event:</span>
            <span className="meta-val font-semibold">{ticket.eventName}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Attendee:</span>
            <span className="meta-val">{ticket.attendeeName} ({ticket.attendeeEmail})</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Pass Tier:</span>
            <span className="meta-val">{ticket.ticketType} &bull; ${ticket.price.toFixed(2)} {ticket.currency}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Status:</span>
            <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
              {ticket.status}
            </span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Format:</span>
            <span className="meta-val">{qrCode?.format || 'SVG'} (ECC Level {qrCode?.errorCorrectionLevel || 'M'})</span>
          </div>
          <div className="meta-payload-box">
            <span className="meta-label">Raw Verification Payload:</span>
            <code className="meta-payload-code">{qrCode?.payload}</code>
          </div>
        </div>
      </div>

      <div className="qr-actions">
        <button
          type="button"
          onClick={handleDownload}
          className="btn btn-secondary"
          aria-label={`Download QR Code SVG for ticket ${ticket.ticketNumber}`}
        >
          Download SVG Vector Pass
        </button>
      </div>
    </article>
  );
};
