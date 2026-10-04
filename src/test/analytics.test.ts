import { describe, it, expect, vi } from 'vitest';
import { logWorkerTelemetry, TELEMETRY_MESSAGE } from '../utils/analytics';

describe('Telemetry Simulation Unit Tests', () => {
  it('logs exact simulated analytics message to console upon successful action', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logWorkerTelemetry();

    expect(consoleSpy).toHaveBeenCalledWith(TELEMETRY_MESSAGE);
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] User interacted with Ticket QR Code Generator Worker');

    consoleSpy.mockRestore();
  });
});
