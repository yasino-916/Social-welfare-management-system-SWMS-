# System Architecture

## High-Level Overview

```
Browser / Mobile Browser
        │
        ▼ HTTPS
React Frontend (port 3000)
        │
        ▼ REST API (HTTPS)
Node.js / Express API (port 5000)
        │
        ├── Authentication & Authorization (JWT + RBAC + Kebele scope)
        ├── Business Logic Layer
        ├── Audit Service (all critical actions)
        │
        ├── PostgreSQL Database
        └── Secure File/Document Storage
```

## Domain Modules

### Public
- `public/` — Register New Applicant, Feedback, Complaint (no account required)

### Registration & Workflow
- `households/` — Household records and household members
- `persons/` — Person identity records (National ID, FAN, FIN)
- `applications/` — Application workflow and status management
- `assessments/` — Kebele assessment criteria and results
- `documents/` — Document upload, verification, version history
- `decisions/` — Application decision history (Kebele + Wereda levels)

### Administration
- `auth/` — Login, JWT, session management
- `users/` — Admin user management
- `roles/` — Role definitions and permissions
- `wereda/` — Wereda configuration
- `kebele/` — Kebele configuration and assignment

### Accountability
- `feedback/` — Independent public feedback records
- `complaints/` — Full complaint lifecycle management
- `audit/` — Audit trail for all critical operations
- `notifications/` — In-app and optional SMS/email notifications

### Reporting
- `reports/` — Aggregated statistics and exportable reports
- `search/` — Multi-field search with role/Kebele scoping

## Data Isolation

Kebele-scoped users can only access records belonging to their assigned Kebele.
This is enforced at the API/database layer, not just the UI.

## Authentication Flow

Public users (applicants, feedback/complaint submitters) — NO account required.
Admin users — authenticate via POST /api/auth/login → receive JWT → include in Authorization header.
