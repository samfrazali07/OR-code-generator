export const TELEMETRY_MESSAGE = '[Analytics] User interacted with Ticket QR Code Generator Worker';

/**
 * Simulates enterprise telemetry logging upon primary user actions.
 * Logs directly to console in accordance with telemetry simulation NFR.
 */
export function logWorkerTelemetry(): void {
  console.log(TELEMETRY_MESSAGE);
}
