import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeTicketInput } from '../utils/sanitization';

describe('Security & XSS Prevention Unit Tests', () => {
  it('sanitizes malicious script tags from user input string', () => {
    const malicious = "<script>alert('XSS')</script>";
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toBe('&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;');
  });

  it('neutralizes HTML event handler injections', () => {
    const malicious = '<img src=x onerror=alert("HACKED")>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain('<img');
    expect(sanitized).toContain('&lt;img');
    expect(sanitized).toContain('&quot;HACKED&quot;');
  });

  it('sanitizes an entire ticket input object without data corruption', () => {
    const rawInput = {
      ticketNumber: '<b>TCK-99</b>',
      eventName: '<script>evil()</script>Annual Meeting',
      attendeeName: "O'Connor & Sons <iframe src='malicious.com'></iframe>",
      attendeeEmail: 'test@example.com',
      ticketType: 'VIP',
      price: '100',
      currency: 'USD',
    };

    const sanitized = sanitizeTicketInput(rawInput);
    expect(sanitized.ticketNumber).toBe('&lt;b&gt;TCK-99&lt;/b&gt;');
    expect(sanitized.eventName).toBe('&lt;script&gt;evil()&lt;/script&gt;Annual Meeting');
    expect(sanitized.attendeeName).toBe('O&#39;Connor &amp; Sons &lt;iframe src=&#39;malicious.com&#39;&gt;&lt;/iframe&gt;');
    expect(sanitized.attendeeEmail).toBe('test@example.com');
  });

  it('trims whitespace and handles null or undefined values safely', () => {
    expect(sanitizeInput('   normal text   ')).toBe('normal text');
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(null as unknown as string)).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });
});
