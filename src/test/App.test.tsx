import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as analyticsModule from '../utils/analytics';

describe('Ticket QR Code Generator Worker - Integration & Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders enterprise header, navigation, and all form controls with proper accessible labels', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /ticket qr code generator worker/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/ticket number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/attendee full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/attendee email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ticket tier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ticket price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate qr code ticket/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByAltText(/QR Code for Ticket TCK-2026-001/i)).toBeInTheDocument();
    });
  });

  it('displays an accessible "No data found" empty state when no tickets exist in search/list', async () => {
    render(<App />);

    // Clear search or filter to show empty state if initial tickets exist
    const searchInput = screen.getByLabelText(/search tickets/i);
    await userEvent.type(searchInput, 'NONEXISTENT_QUERY_XYZ_999');

    const emptyAlert = await screen.findByRole('status');
    expect(emptyAlert).toBeInTheDocument();
    expect(emptyAlert).toHaveTextContent(/no data found/i);
  });

  it('prevents submission, highlights fields, and links accessible ARIA error messages when inputs are invalid', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByAltText(/QR Code for Ticket TCK-2026-001/i)).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /generate qr code ticket/i });
    await userEvent.click(submitBtn);

    // Form inputs should have aria-invalid set to true
    const ticketInput = screen.getByLabelText(/ticket number/i);
    expect(ticketInput).toHaveAttribute('aria-invalid', 'true');
    const emailInput = screen.getByLabelText(/attendee email address/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    // Associated accessible error messages must exist with role alert
    const errorAlerts = screen.getAllByRole('alert');
    expect(errorAlerts.length).toBeGreaterThan(0);
    expect(screen.getByText(/ticket number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/attendee email is required/i)).toBeInTheDocument();
  });

  it('shows loading indicator during generation, prevents duplicate submissions, and cleans up state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/ticket number/i), 'TCK-2026-X01');
    await user.type(screen.getByLabelText(/event name/i), 'DevOps Global Summit');
    await user.type(screen.getByLabelText(/attendee full name/i), 'Alice Engineer');
    await user.type(screen.getByLabelText(/attendee email address/i), 'alice@devops.org');
    await user.clear(screen.getByLabelText(/ticket price/i));
    await user.type(screen.getByLabelText(/ticket price/i), '199.00');

    const submitBtn = screen.getByRole('button', { name: /generate qr code ticket/i });
    expect(submitBtn).not.toBeDisabled();

    await user.click(submitBtn);

    // Check loading indicator appears and submit button is disabled
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveAttribute('aria-busy', 'true');

    // Wait for operation to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).toHaveAttribute('aria-busy', 'false');
  });

  it('logs simulated analytics telemetry upon successful ticket & QR code generation', async () => {
    const telemetrySpy = vi.spyOn(analyticsModule, 'logWorkerTelemetry');
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/ticket number/i), 'TCK-2026-X02');
    await user.type(screen.getByLabelText(/event name/i), 'Cloud Architecture Forum');
    await user.type(screen.getByLabelText(/attendee full name/i), 'Bob Architect');
    await user.type(screen.getByLabelText(/attendee email address/i), 'bob@cloud.io');
    await user.clear(screen.getByLabelText(/ticket price/i));
    await user.type(screen.getByLabelText(/ticket price/i), '250.00');

    const submitBtn = screen.getByRole('button', { name: /generate qr code ticket/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(telemetrySpy).toHaveBeenCalled();
    });
  });

  it('handles simulated network errors gracefully without crashing the application', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Toggle simulated network failure mode
    const networkFailToggle = screen.getByLabelText(/simulate network failure/i);
    await user.click(networkFailToggle);

    await user.type(screen.getByLabelText(/ticket number/i), 'TCK-2026-FAIL');
    await user.type(screen.getByLabelText(/event name/i), 'Failure Test Summit');
    await user.type(screen.getByLabelText(/attendee full name/i), 'Charlie Tester');
    await user.type(screen.getByLabelText(/attendee email address/i), 'charlie@test.com');

    const submitBtn = screen.getByRole('button', { name: /generate qr code ticket/i });
    await user.click(submitBtn);

    // App should not crash, error message banner should appear with role="alert"
    const errorBanner = await screen.findByRole('alert');
    expect(errorBanner).toHaveTextContent(/network connection failed/i);
    expect(submitBtn).not.toBeDisabled();
  });

  it('sanitizes user input to prevent XSS before storing in state and rendering', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/ticket number/i), 'TCK-XSS');
    await user.type(screen.getByLabelText(/event name/i), "<script>alert('xss')</script>Security Con");
    await user.type(screen.getByLabelText(/attendee full name/i), "<img src=x onerror=alert('xss')>Bob");
    await user.type(screen.getByLabelText(/attendee email address/i), 'bob.xss@security.org');

    const submitBtn = screen.getByRole('button', { name: /generate qr code ticket/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Security Con/).length).toBeGreaterThan(0);
    });

    // Make sure no raw unescaped script tag is injected into DOM
    expect(document.querySelector('script[src="x"]')).toBeNull();
    expect(document.querySelector('img[onerror]')).toBeNull();
  });
});
