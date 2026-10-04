import React, { useState } from 'react';
import type { TicketInput, TicketRecord } from './types/ticket';
import { sanitizeTicketInput } from './utils/sanitization';
import { generateTicketQRCode } from './utils/qrGenerator';
import { logWorkerTelemetry } from './utils/analytics';
import { TicketForm } from './components/TicketForm';
import { TicketList } from './components/TicketList';
import { QRCodeCard } from './components/QRCodeCard';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorMessage } from './components/ErrorMessage';

// Seed sample tickets for immediate operational review
const INITIAL_SEED_TICKETS: TicketRecord[] = [
  {
    id: 'seed-01',
    ticketNumber: 'TCK-2026-001',
    eventName: 'Enterprise Infrastructure Expo',
    attendeeName: 'Marcus Vance',
    attendeeEmail: 'm.vance@enterprise.corp',
    ticketType: 'VIP',
    price: 350.00,
    currency: 'USD',
    status: 'ISSUED',
    workerId: 'worker_09',
    validFrom: '2026-11-01T08:00:00Z',
    validUntil: '2026-11-03T18:00:00Z',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    qrCode: {
      id: 'qr_seed_01',
      payload: 'TKT:TCK-2026-001:EVT:Enterprise Infrastructure Expo:USER:m.vance@enterprise.corp:SIG-V90A1:EXP-1794938400',
      svgDataUri: '',
      format: 'SVG',
      errorCorrectionLevel: 'M',
      version: 4,
      scanCount: 1,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  },
];

export default function App() {
  const [tickets, setTickets] = useState<TicketRecord[]>(INITIAL_SEED_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(INITIAL_SEED_TICKETS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulateNetworkError, setSimulateNetworkError] = useState<boolean>(false);

  // Initialize seed ticket QR code on first load
  React.useEffect(() => {
    generateTicketQRCode(
      INITIAL_SEED_TICKETS[0].ticketNumber,
      INITIAL_SEED_TICKETS[0].eventName,
      INITIAL_SEED_TICKETS[0].attendeeEmail
    ).then((qr) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === 'seed-01' ? { ...t, qrCode: qr } : t))
      );
      setSelectedTicket((prev) =>
        prev && prev.id === 'seed-01' ? { ...prev, qrCode: qr } : prev
      );
    }).catch(() => {
      // Non-critical fallback
    });
  }, []);

  const handleCreateTicket = async (rawInput: TicketInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Sanitize user inputs strictly against XSS before storing in state
    const sanitizedInput = sanitizeTicketInput(rawInput);

    try {
      // Simulate realistic worker async network/dispatch latency (400ms)
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (simulateNetworkError) {
        throw new Error('Network connection failed. Unable to reach ticket worker service. Please verify connectivity and try again.');
      }

      // Generate verifiable client-side QR artifact
      const qrData = await generateTicketQRCode(
        sanitizedInput.ticketNumber || '',
        sanitizedInput.eventName || '',
        sanitizedInput.attendeeEmail || ''
      );

      const newRecord: TicketRecord = {
        id: `tck_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ticketNumber: sanitizedInput.ticketNumber || '',
        eventName: sanitizedInput.eventName || '',
        attendeeName: sanitizedInput.attendeeName || '',
        attendeeEmail: sanitizedInput.attendeeEmail || '',
        ticketType: sanitizedInput.ticketType || 'GENERAL',
        price: Number(sanitizedInput.price) || 0,
        currency: sanitizedInput.currency || 'USD',
        status: 'ISSUED',
        workerId: 'worker_current',
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
        qrCode: qrData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTickets((prev) => [newRecord, ...prev]);
      setSelectedTicket(newRecord);

      // Trigger mandated telemetry simulation
      logWorkerTelemetry();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during ticket generation.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      {/* Enterprise Application Header */}
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="header-branding">
            <div className="header-logo-badge" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="8" height="8" rx="1" />
                <rect x="14" y="2" width="8" height="8" rx="1" />
                <rect x="2" y="14" width="8" height="8" rx="1" />
                <rect x="14" y="14" width="4" height="4" />
                <rect x="18" y="18" width="4" height="4" />
              </svg>
            </div>
            <div>
              <h1 className="header-title">Ticket QR Code Generator Worker</h1>
              <div className="header-metadata">
                <span className="metadata-tag">Ticket: ENG-139055</span>
                <span className="metadata-tag">Epic: Core Infrastructure Overhaul</span>
                <span className="metadata-tag status-active">Worker Node: Active</span>
              </div>
            </div>
          </div>

          <div className="header-controls">
            <span className="worker-badge" aria-label="Authenticated Worker Status">
              Worker Session: Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Operational Container */}
      <main id="main-content" className="app-main" role="main">
        {/* Global Alert Notification Banner */}
        {errorMessage && (
          <div className="error-container">
            <ErrorMessage
              message={errorMessage}
              onDismiss={() => setErrorMessage(null)}
            />
          </div>
        )}

        {/* Async Operation Busy Indicator */}
        {isLoading && (
          <div className="global-loading-wrapper">
            <LoadingIndicator label="Generating cryptographic QR code & provisioning ticket..." />
          </div>
        )}

        {/* Operational 2-Column Responsive Workspace */}
        <div className="workspace-grid">
          {/* Left Column: Form Provisioning */}
          <div className="workspace-column">
            <TicketForm
              onSubmit={handleCreateTicket}
              isLoading={isLoading}
              simulateNetworkError={simulateNetworkError}
              onToggleSimulateNetworkError={setSimulateNetworkError}
            />
          </div>

          {/* Right Column: Issued Directory & QR Preview Card */}
          <div className="workspace-column right-panel">
            {selectedTicket && (
              <div className="qr-preview-wrapper">
                <QRCodeCard
                  ticket={selectedTicket}
                  onClose={() => setSelectedTicket(null)}
                />
              </div>
            )}

            <TicketList
              tickets={tickets}
              selectedTicketId={selectedTicket?.id || null}
              onSelectTicket={(t) => setSelectedTicket(t)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </div>
      </main>

      {/* Corporate Monochromatic Footer */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-inner">
          <p className="footer-text">
            Enterprise QR Code Generator Worker &bull; Ticket ID ENG-139055 &bull; Monochromatic High-Contrast System
          </p>
          <p className="footer-subtext">
            Compliant with WCAG 2.1 AA / AAA Accessibility Standards &bull; Simulated Telemetry Active
          </p>
        </div>
      </footer>
    </div>
  );
}
