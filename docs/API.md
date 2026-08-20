# API Reference

Base URL: `http://localhost:5000/api`

## Public Endpoints (no authentication required)

| Method | Path                              | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | /public/register                  | Submit new household application   |
| GET    | /public/application/status        | Check application status           |
| POST   | /public/feedback                  | Submit public feedback             |
| POST   | /public/complaints                | Submit public complaint            |
| GET    | /public/complaints/:ref/status    | Track complaint by reference       |

## Auth

| Method | Path                | Description           |
|--------|---------------------|-----------------------|
| POST   | /auth/login         | Admin user login      |
| POST   | /auth/logout        | Logout / invalidate   |
| GET    | /auth/me            | Current user profile  |

## Users & Roles (Super Admin)

| Method | Path                           | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | /users                         | List all users                 |
| POST   | /users                         | Create new admin user          |
| PUT    | /users/:id                     | Update user                    |
| POST   | /users/:id/assign-kebele       | Assign user to Kebele          |
| POST   | /users/:id/suspend             | Suspend user account           |

## Households & Persons

| Method | Path                              | Description                       |
|--------|-----------------------------------|-----------------------------------|
| GET    | /households                       | List households (role-scoped)     |
| GET    | /households/:id                   | Get household detail              |
| POST   | /households                       | Create household                  |
| PUT    | /households/:id                   | Update household                  |
| GET    | /households/:id/members           | List household members            |
| POST   | /households/:id/members           | Add household member              |
| GET    | /persons/:id                      | Get person detail                 |

## Applications

| Method | Path                                     | Description                        |
|--------|------------------------------------------|------------------------------------|
| GET    | /applications                            | List applications (role-scoped)    |
| GET    | /applications/:id                        | Get application detail             |
| POST   | /applications/:id/kebele-decision        | Kebele accept/reject/return        |
| POST   | /applications/:id/submit-to-wereda       | Submit reviewed list to Wereda     |
| POST   | /applications/batch-decision             | Super Admin batch decision         |
| POST   | /applications/:id/wereda-decision        | Super Admin selective decision     |

## Complaints

| Method | Path                                   | Description                      |
|--------|----------------------------------------|----------------------------------|
| GET    | /complaints                            | List complaints (role-scoped)    |
| GET    | /complaints/:id                        | Complaint detail                 |
| POST   | /complaints/:id/assign                 | Assign complaint handler         |
| POST   | /complaints/:id/action                 | Log investigation action         |
| POST   | /complaints/:id/escalate               | Escalate complaint               |
| POST   | /complaints/:id/resolve                | Resolve complaint                |
| POST   | /complaints/:id/close                  | Close complaint                  |

## Reports & Statistics

| Method | Path                          | Description                        |
|--------|-------------------------------|------------------------------------|
| GET    | /reports/dashboard            | Dashboard summary statistics       |
| GET    | /reports/households           | Households by Kebele report        |
| GET    | /reports/persons/age-range    | People by age range                |
| GET    | /reports/applications/status  | Applications by status             |
| GET    | /reports/support              | Support distribution report        |
| GET    | /reports/complaints           | Complaint statistics               |
| GET    | /reports/export/:type         | Export report (pdf/xlsx)           |
