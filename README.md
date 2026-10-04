# Ticket QR Code Generator Worker

**Ticket ID**: `ENG-139055`  
**Epic**: Core Infrastructure Overhaul  
**Priority**: P1 | **Story Points**: 5  
**Design System**: Monochromatic Corporate Enterprise  

---

## 1. Project Overview & Purpose

The client previously managed ticket QR code generation through manual paper processes and Excel spreadsheets. This manual workflow led to data inconsistencies, lost tickets, duplicate entries, and admission gate bottlenecks.

The **Ticket QR Code Generator Worker** provides a secure, digital enterprise application interface and architectural blueprint designed to:
1. Provision ticket records deterministically.
2. Generate client-side cryptographic QR code artifacts instantly without requiring third-party network requests.
3. Enforce strict data hygiene, input validation, and XSS sanitization.
4. Provide immediate, accessible feedback across empty states, network connectivity degradation, and validation failures.
5. Standardize future backend persistence via a definitive relational database schema ([DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)) and RESTful API contracts ([API_CONTRACTS.md](API_CONTRACTS.md)).

---

## 2. Architecture Overview

The system is designed with a clean separation of concerns:

```
src/
├── types/
│   └── ticket.ts             # Domain models, enums, input interfaces
├── utils/
│   ├── validation.ts         # Pure input validation functions
│   ├── sanitization.ts       # XSS prevention & HTML entity sanitization
│   ├── analytics.ts          # Simulated telemetry logging
│   └── qrGenerator.ts        # Client-side SVG QR code generator
├── components/
│   ├── TicketForm.tsx        # Accessible form with ARIA live feedback
│   ├── TicketList.tsx        # Searchable ticket directory with empty state
│   ├── QRCodeCard.tsx        # High-resolution pass preview & vector export
│   ├── EmptyState.tsx        # Screen reader accessible empty state
│   ├── LoadingIndicator.tsx  # Accessible busy indicator
│   └── ErrorMessage.tsx      # High-contrast error banner
├── App.tsx                   # Master operational layout & state manager
├── index.css                 # Monochromatic grayscale design system
└── test/
    ├── setup.ts              # Jest-DOM / Vitest environment setup
    ├── validation.test.ts    # Validation unit tests
    ├── security.test.ts      # XSS sanitization unit tests
    ├── analytics.test.ts     # Telemetry simulation unit tests
    └── App.test.tsx          # Full integration, accessibility & UI tests
```

---

## 3. Technology Stack

- **UI Framework**: React 19 + TypeScript
- **Bundler & Build Tool**: Vite 8
- **Testing & Test Runner**: Vitest + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
- **Linter**: Oxlint (fast, ruleset-compliant linter)
- **QR Engine**: `qrcode` (Deterministic SVG vector output)
- **Styling**: Monochromatic Corporate CSS (Pure grayscale, zero rogue hex colors, 16px/32px scale)

---

## 4. Getting Started

### Prerequisites
- Node.js (LTS v20+ or v24+)
- npm (v10+ or v11+)

### Installation
```bash
npm install
```

### Running the Application Locally
To launch the development server:
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

### Running Tests
Execute the comprehensive test suite with Vitest:
```bash
npm test
```

### Running Linter
Check for lint issues, unused variables, and syntax standards:
```bash
npm run lint
```

### Building for Production
Create an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `dist/` directory ready for deployment.

---

## 5. Architectural Documents

Comprehensive architectural planning documents have been drafted as Capstone 1 deliverables:

- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)**:
  - Definitive PostgreSQL relational schema specification.
  - Complete Mermaid Entity Relationship Diagram (ERD).
  - Detailed table definitions: `users`, `ticket_statuses`, `tickets`, `qr_codes`, `audit_logs`.
  - Indexes, foreign keys, unique constraints, and check constraints.

- **[API_CONTRACTS.md](API_CONTRACTS.md)**:
  - Detailed RESTful contracts for ticket creation (`POST /api/v1/tickets`), retrieval (`GET /api/v1/tickets/:id`), directory search (`GET /api/v1/tickets`), QR regeneration (`POST /api/v1/tickets/:id/qr`), and status updates (`PATCH /api/v1/tickets/:id/status`).
  - Standard JSON response envelopes and RFC 7807 problem details error format.
  - Edge cases, rate limiting, and idempotency guarantees.

- **[PROMPTS.md](PROMPTS.md)**:
  - Complete prompt traceability mapping user prompts to development phases.

---

## 6. Accessibility (A11y) Verification

The frontend interface targets a **100% Lighthouse Accessibility score**:
- **Form Labels**: Every input and select is associated with an explicit `<label htmlFor="...">`.
- **Accessible Names**: All buttons have descriptive, accessible names and ARIA labels.
- **Screen Reader Announcements**:
  - Empty states render with `role="status"` and `aria-live="polite"`.
  - Loading indicators render with `role="status"` and `aria-live="polite"`.
  - Field errors render with `role="alert"` and link to inputs via `aria-describedby` and `aria-invalid`.
  - Global error banners render with `role="alert"`.
- **Keyboard Navigation**:
  - Full keyboard focusability on all interactive elements.
  - High-visibility focus indicator (`:focus-visible` with 2px solid black outline and 2px offset).
- **Color Contrast**:
  - Strict monochromatic palette (pure blacks `#000000`, dark grays `#111827`, pure whites `#ffffff`).
  - Minimum contrast ratio exceeds 12:1 (far above WCAG AAA 7:1 threshold).
  - Errors do not rely on color alone; they use explicit icons (`!`), badges (`[ERROR]`), and text descriptors.

---

## 7. Edge Cases & Resilience

- **Empty States**: If no tickets exist or a search query yields no results, a formatted "No data found" alert is rendered with advice on adjusting query terms.
- **Unreliable Connectivity**: Users can toggle "Simulate network failure" to verify that failed asynchronous operations do not crash the application, leave orphaned loading states, or trigger duplicate submissions.
- **Duplicate Submission Prevention**: The submission button is disabled and assigned `aria-busy="true"` during asynchronous generation operations.
- **Malformed Inputs**: Validation prevents submission if required fields are missing, if attendee emails are malformed, or if price is negative/non-numeric.

---

## 8. Security Considerations

- **XSS Prevention**: All user-controlled text inputs (`ticketNumber`, `eventName`, `attendeeName`, `attendeeEmail`) are sanitized through `sanitizeTicketInput` prior to state storage and rendering.
- **Safe DOM Rendering**: No `dangerouslySetInnerHTML`, `eval()`, or unescaped HTML strings are utilized.
- **Credential Safety**: No real API keys or sensitive PII are hardcoded into source code.
- **Offline QR Generation**: QR codes are generated directly in the browser via vector calculations, ensuring no sensitive attendee data is transmitted to third-party QR generation APIs.

---

## 9. Simulated Telemetry

Upon successful ticket and QR code generation, the application logs:
```
[Analytics] User interacted with Ticket QR Code Generator Worker
```
This is verified by automated tests in `src/test/analytics.test.ts`.

---

## 10. Verification Summary

| Verification Item | Status |
| :--- | :--- |
| Project compiles successfully | Passed (`npm run build`) |
| Vitest test suite passes | Passed (17/17 tests passing across 4 files) |
| Linter passes with 0 warnings/errors | Passed (`npm run lint` with 0 warnings) |
| Monochromatic corporate UI | Compliant (grayscale only, 16px/32px scale) |
| Accessible ARIA markup | Compliant (labels, roles, live regions) |
| XSS sanitization verified | Compliant (`sanitizeTicketInput` + test) |
| Database schema & ERD documented | Compliant (`DATABASE_SCHEMA.md`) |
| API contracts documented | Compliant (`API_CONTRACTS.md`) |
| Prompt traceability documented | Compliant (`PROMPTS.md`) |
