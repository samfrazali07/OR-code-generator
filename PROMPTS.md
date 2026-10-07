# Prompt Traceability

This document records the prompts used with AI during the development of the **Ticket QR Code Generator Worker**.

**Ticket ID:** `ENG-139055`

AI was used as a learning, planning, development, debugging, and review assistant. The project was developed according to the requirements, acceptance criteria, accessibility, security, and TDD workflow.

---

## Prompt 1 — Requirements Analysis

> Explain the Ticket QR Code Generator Worker requirements in simple terms and break them into smaller development tasks.
>
> Help me understand the functional requirements, unhappy paths, accessibility requirements, security requirements, database requirements, API contracts, and TDD workflow before I start implementation.
>
> Also identify important edge cases and explain what should be completed first.

### What I learned

* The purpose of the Ticket QR Code Generator Worker.
* The difference between functional and non-functional requirements.
* How empty, loading, error, and invalid-input states should behave.
* Why accessibility and input sanitization are important.
* Why the Capstone 1 task focuses on architecture, database schema, ERD, and API contracts before complete backend implementation.

---

## Prompt 2 — Database Schema & ERD

> Help me understand how to design the database for the Ticket QR Code Generator Worker.
>
> Identify the important entities, fields, primary keys, foreign keys, relationships, constraints, and indexes.
>
> Create a clear ERD structure using Mermaid syntax and explain how the entities are connected.
>
> Keep the schema simple and avoid unnecessary tables.

### What I learned

* How to identify database entities from project requirements.
* How primary keys and foreign keys connect tables.
* How to represent one-to-many and one-to-one relationships.
* How an ERD helps explain the database architecture.

---

## Prompt 3 — API Contracts

> Explain how to design API contracts for the Ticket QR Code Generator Worker without implementing the APIs yet.
>
> For each important endpoint, explain the HTTP method, endpoint, purpose, request body, response, status codes, validation errors, and possible edge cases.
>
> Keep the API design consistent with the database schema and project requirements.

### What I learned

* How frontend and backend communicate through APIs.
* How HTTP methods such as GET, POST, and PATCH are used.
* How successful and error responses should be structured.
* Why API contracts should be defined before implementation.

---

## Prompt 4 — Test-Driven Development

> Help me create a TDD test plan from the project requirements.
>
> Identify tests for validation, empty states, loading states, API errors, accessibility, security, and analytics.
>
> Explain what should be tested before implementation and how failing tests can guide development.

### What I learned

* How acceptance criteria can be converted into test cases.
* Why important edge cases should be tested.
* How tests help prevent breaking existing functionality.
* Why tests should be written before implementation in the required TDD workflow.

---

## Prompt 5 — Implementation

> Help me implement the project according to the requirements and test cases.
>
> Do not add unnecessary features. Keep the implementation simple, maintainable, accessible, and secure.
>
> Make sure validation, loading states, error handling, input sanitization, keyboard accessibility, and the required analytics event are handled correctly.

### What I learned

* How to structure the application into reusable components and utilities.
* How validation and UI states work together.
* How to handle asynchronous operations and network failures.
* How to keep security and accessibility requirements in the implementation.

---

## Prompt 6 — Debugging & Error Resolution

> I found errors while running the tests, lint, or build.
>
> Help me understand the cause of each error and explain how to fix it without changing the original requirements or weakening the tests.
>
> Show me what caused the issue and guide me toward the correct solution.

### What I learned

* How to read test failures and error messages.
* How to identify issues in components and test selectors.
* How lint and TypeScript errors can affect the final build.
* How to fix problems without removing required functionality.

---

## Prompt 7 — Accessibility & Security Review

> Review my implementation for accessibility and security.
>
> Check keyboard accessibility, form labels, accessible button names, ARIA attributes, validation messages, focus states, color usage, input sanitization, and possible XSS issues.
>
> Explain any problems and suggest improvements without changing the project requirements.

### What I learned

* Why semantic HTML and proper labels are important.
* How ARIA attributes help screen-reader users.
* Why errors should not depend only on color.
* How sanitizing user input helps prevent XSS.
* How accessibility should be considered throughout development.

---

## Prompt 8 — Final Verification

> Help me perform a final verification of the Ticket QR Code Generator Worker.
>
> Check the project against the requirements and verify tests, lint, build, accessibility, security, database documentation, API contracts, README, and PROMPTS.md.
>
> Give me a final checklist of anything that still needs to be fixed before submission.

### What I learned

* How to perform a final project review.
* How to verify that requirements are actually implemented.
* How tests, lint, and build checks help ensure code quality.
* How documentation and project files are part of the final deliverable.

---

## Final Note

AI was used as a development and learning assistant. I used it to understand requirements, plan the architecture, learn implementation concepts, create and understand tests, debug errors, and review accessibility and security.

The final implementation was checked against the project requirements before submission.
