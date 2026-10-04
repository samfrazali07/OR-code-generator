# API Contracts Specification

## Project: Ticket QR Code Generator Worker
**Ticket ID**: ENG-139055  
**Version**: 1.0.0 (Architectural Specification)  
**Standard**: RESTful JSON over HTTPS, RFC 7807 Problem Details for Error Responses  

---

## 1. Overview & Architectural Principles

These API contracts define the standardized communication interface between the Ticket QR Code Generator Worker frontend/client application and the future enterprise backend service.

### Standard Response Envelope
All successful responses return a predictable JSON payload:
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "timestamp": "2026-10-01T12:00:00.000Z",
    "requestId": "req_8f2910ab31e"
  }
}
```

### Standard Error Envelope (RFC 7807 compliant)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more input fields are invalid.",
    "details": [
      {
        "field": "attendeeEmail",
        "issue": "Invalid email address format"
      }
    ],
    "timestamp": "2026-10-01T12:00:00.000Z",
    "requestId": "req_8f2910ab31e"
  }
}
```

---

## 2. API Endpoints

### 2.1 Create Ticket
- **Method**: `POST`
- **Endpoint**: `/api/v1/tickets`
- **Purpose**: Creates a new ticket record and triggers automatic QR code generation.
- **Authentication**: Bearer JWT (Roles: `WORKER`, `MANAGER`, `ADMIN`).

#### Request Headers:
```http
Authorization: Bearer <worker_jwt_token>
Content-Type: application/json
Idempotency-Key: <unique-uuid-v4>
```

#### Request Body:
```json
{
  "ticketNumber": "TCK-2026-9081",
  "eventName": "Global Tech Summit 2026",
  "attendeeName": "Jane Doe",
  "attendeeEmail": "jane.doe@enterprise.corp",
  "ticketType": "VIP",
  "price": 299.00,
  "currency": "USD",
  "validFrom": "2026-11-15T09:00:00Z",
  "validUntil": "2026-11-17T18:00:00Z"
}
```

#### Success Response:
- **Status Code**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "7f8b919a-243e-4b2b-92ea-286a039be501",
    "ticketNumber": "TCK-2026-9081",
    "eventName": "Global Tech Summit 2026",
    "attendeeName": "Jane Doe",
    "attendeeEmail": "jane.doe@enterprise.corp",
    "ticketType": "VIP",
    "price": 299.00,
    "currency": "USD",
    "status": "ISSUED",
    "workerId": "usr_91238472",
    "validFrom": "2026-11-15T09:00:00Z",
    "validUntil": "2026-11-17T18:00:00Z",
    "qrCode": {
      "id": "qr_1028374",
      "payload": "TKT:TCK-2026-9081:SIG-d38f8a1e8093:EXP-1794938400",
      "format": "SVG",
      "svgString": "<svg ...></svg>",
      "scanCount": 0
    },
    "createdAt": "2026-10-01T12:00:00.000Z",
    "updatedAt": "2026-10-01T12:00:00.000Z"
  }
}
```

#### Validation Errors:
- **Status Code**: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for ticket creation.",
    "details": [
      { "field": "ticketNumber", "issue": "Ticket number is required." },
      { "field": "attendeeEmail", "issue": "Invalid email address format." },
      { "field": "price", "issue": "Price must be a positive number or zero." }
    ]
  }
}
```

#### Edge Cases:
- **Duplicate Ticket Number**: Returns `409 Conflict` with code `TICKET_ALREADY_EXISTS`.
- **Invalid Date Span**: Returns `400 Bad Request` if `validUntil` is earlier than `validFrom`.
- **Idempotent Retry**: If `Idempotency-Key` was already executed, returns the cached `201 Created` without duplicating records.

---

### 2.2 List and Search Tickets
- **Method**: `GET`
- **Endpoint**: `/api/v1/tickets`
- **Purpose**: Retrieves paginated list of tickets with optional search filter by ticket number, attendee name, event name, or status.
- **Authentication**: Bearer JWT.

#### Query Parameters:
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `search` | string | No | `""` | Search query for ticket number, attendee, or event |
| `status` | string | No | `""` | Filter by status (`DRAFT`, `ISSUED`, `CHECKED_IN`, `CANCELLED`) |
| `ticketType` | string | No | `""` | Filter by ticket type |
| `page` | integer | No | `1` | Page number (1-indexed) |
| `limit` | integer | No | `20` | Items per page (max `100`) |
| `sortBy` | string | No | `'createdAt'` | Field to sort by (`createdAt`, `ticketNumber`, `eventName`) |
| `sortOrder`| string | No | `'desc'` | Sort direction (`asc`, `desc`) |

#### Success Response (With Data):
- **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "7f8b919a-243e-4b2b-92ea-286a039be501",
      "ticketNumber": "TCK-2026-9081",
      "eventName": "Global Tech Summit 2026",
      "attendeeName": "Jane Doe",
      "attendeeEmail": "jane.doe@enterprise.corp",
      "ticketType": "VIP",
      "price": 299.00,
      "currency": "USD",
      "status": "ISSUED",
      "createdAt": "2026-10-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

#### Empty-State Response:
- **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 0,
    "totalPages": 0
  }
}
```
*Client Handling*: If `data` is empty, the UI must render an accessible "No data found" alert rather than a blank container.

---

### 2.3 Get Ticket by ID
- **Method**: `GET`
- **Endpoint**: `/api/v1/tickets/:id`
- **Purpose**: Fetches complete ticket details including associated QR code payload and audit trail.
- **Authentication**: Bearer JWT.

#### Success Response:
- **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "7f8b919a-243e-4b2b-92ea-286a039be501",
    "ticketNumber": "TCK-2026-9081",
    "eventName": "Global Tech Summit 2026",
    "attendeeName": "Jane Doe",
    "attendeeEmail": "jane.doe@enterprise.corp",
    "ticketType": "VIP",
    "status": "ISSUED",
    "qrCode": {
      "payload": "TKT:TCK-2026-9081:SIG-d38f8a1e8093:EXP-1794938400",
      "format": "SVG",
      "svgString": "<svg ...></svg>",
      "scanCount": 0,
      "lastScannedAt": null
    }
  }
}
```

#### Error Response:
- **Status Code**: `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Ticket with ID '7f8b919a-243e-4b2b-92ea-286a039be501' does not exist."
  }
}
```

---

### 2.4 Generate / Re-generate QR Code
- **Method**: `POST`
- **Endpoint**: `/api/v1/tickets/:id/qr`
- **Purpose**: Re-generates or refreshes the QR code artifact for a ticket (e.g. if security policy mandates periodic rotation or payload invalidation).
- **Authentication**: Bearer JWT (Roles: `WORKER`, `MANAGER`, `ADMIN`).

#### Request Body:
```json
{
  "errorCorrectionLevel": "M",
  "format": "SVG",
  "forceRotatePayload": false
}
```

#### Success Response:
- **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": {
    "ticketId": "7f8b919a-243e-4b2b-92ea-286a039be501",
    "qrPayload": "TKT:TCK-2026-9081:SIG-f94a10e7b8:EXP-1794938400",
    "svgString": "<svg ...></svg>",
    "generatedAt": "2026-10-01T12:05:00.000Z"
  }
}
```

---

### 2.5 Update Ticket Status
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/tickets/:id/status`
- **Purpose**: Transitions a ticket through its operational state machine (e.g., mark as `CHECKED_IN`, `CANCELLED`, `VOIDED`).
- **Authentication**: Bearer JWT.

#### Request Body:
```json
{
  "status": "CHECKED_IN",
  "reason": "Attendee verified at Gate 3 entrance",
  "clientTimestamp": "2026-11-15T09:12:00Z"
}
```

#### Success Response:
- **Status Code**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "7f8b919a-243e-4b2b-92ea-286a039be501",
    "ticketNumber": "TCK-2026-9081",
    "status": "CHECKED_IN",
    "updatedAt": "2026-10-01T12:12:00.000Z"
  }
}
```

#### State Transition Error:
- **Status Code**: `422 Unprocessable Entity`
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Cannot transition ticket from 'CANCELLED' to 'CHECKED_IN'."
  }
}
```

---

## 3. Resilience, Security & Edge Cases

1. **Rate Limiting**:
   - Worker endpoints are limited to 120 requests/minute per worker IP with `429 Too Many Requests` returned when exceeded.
2. **Network Failures & Offline Retry**:
   - Client workers cache unsent generation events in local storage; on reconnect, requests are dispatched with original `Idempotency-Key` headers.
3. **Cross-Site Scripting (XSS) Prevention**:
   - All input text parameters are sanitized (HTML entities escaped, stripped of dangerous payloads like `<script>` or event handlers) both on client-side state entry and server validation.
4. **Data Hygiene**:
   - All emails are normalized to lowercase. String fields are trimmed of leading/trailing whitespace.
