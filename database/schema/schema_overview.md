# Database Schema Overview

## Migration Order

| # | Migration File                          | Tables Created                                              |
|---|-----------------------------------------|-------------------------------------------------------------|
| 001 | `001_create_weredas`                  | `weredas`                                                   |
| 002 | `002_create_kebeles`                  | `kebeles`                                                   |
| 003 | `003_create_roles_and_users`          | `roles`, `permissions`, `users`                             |
| 004 | `004_create_user_kebele_assignments`  | `user_kebele_assignments`                                   |
| 005 | `005_create_persons`                  | `persons`                                                   |
| 006 | `006_create_registration_reasons`     | `registration_reasons`                                      |
| 007 | `007_create_households`               | `households`                                                |
| 008 | `008_create_household_members`        | `household_members`                                         |
| 009 | `009_create_applications`             | `applications`                                              |
| 010 | `010_create_assessments`              | `assessment_criteria`, `assessments`, `assessment_results`  |
| 011 | `011_create_documents`                | `documents`, `document_versions`                            |
| 012 | `012_create_decisions`                | `decision_batches`, `application_decisions`                 |
| 013 | `013_create_support`                  | `support_programs`, `support_distributions`                 |
| 014 | `014_create_feedback`                 | `feedback_categories`, `feedback`                           |
| 015 | `015_create_complaints`               | `complaint_categories`, `complaints`,                       |
|     |                                       | `complaint_assignments`, `complaint_actions`                |
| 016 | `016_create_notifications`            | `notifications`                                             |
| 017 | `017_create_audit_logs`               | `audit_logs`                                                |

## Key Design Decisions

### Identity (SRS §7)
- `persons.national_id`, `persons.fan`, `persons.fin` are **attributes** of the person record — NOT independent entities.
- System-generated `persons.id` (UUID) is the primary key.

### Household (SRS §6, BR-01)
- The household is the central registration unit.
- `households.household_head_person_id` is nullable — the design does not assume a father.

### Applications (SRS §11)
- One household can have multiple applications over time.
- `applications.submitted_by_person_id` — self-registration (no user account).
- `applications.registered_by_user_id` — assisted registration by authorized employee.

### Decision History (SRS §32)
- `application_decisions` preserves every decision. Status is never overwritten without a trace.
- `decision_batches` links batch (Accept All / Reject All) decisions.

### Feedback & Complaints (SRS §5, FR-23)
- **Independently scoped** — no mandatory FK to applications or households.
- Optional FKs allow citizens to link their feedback/complaint to a case if they choose.
- Anonymous submissions have no `user_id`.

### Audit (SRS §25)
- `audit_logs.old_value` and `new_value` are JSONB for flexible change capture.
- Every critical action type from SRS §25 maps to a distinct `action` string.

### Kebele Data Isolation (SRS §23)
- All queries involving Kebele-scoped users filter by `kebele_id`.
- Enforced at API/service layer — NOT just by hiding UI controls.
