# Wereda Poverty Support Registration, Assessment, Beneficiary Management and Accountability System

A Wereda-level household-centered poverty support registration and accountability platform.

## Overview

This system provides:
- Public household registration without requiring a system account
- Kebele-level review, assessment and decision-making
- Wereda Super Admin final authorization (accept-all, reject-all, selective)
- Beneficiary management and support distribution tracking
- Independent public feedback and complaint submission
- Role-based access control with Kebele data isolation
- Full audit trail for all critical actions

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React + TypeScript + Tailwind CSS   |
| Backend    | Node.js + Express.js REST API       |
| Database   | PostgreSQL                          |
| Auth       | JWT (admin users only)              |
| Storage    | Secure object/file storage          |

## Project Structure

```
Poverty_support/
├── client/          # React frontend
├── server/          # Node.js/Express backend
├── database/        # Migrations, seeds, schema
├── docs/            # SRS, API docs, architecture diagrams
├── scripts/         # Dev/deployment utility scripts
└── docker-compose.yml
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14
- npm >= 9.x
- Docker & Docker Compose (optional but recommended)

### Quick Start with Docker

To spin up the entire stack (PostgreSQL, API Server, and React Client):

```bash
docker-compose up -d
```

*The API server will run on port 5000 and the React client on port 3000.*

### Manual Setup (Local Development)

If you prefer to run the Node.js and React servers locally on your machine instead of inside Docker:

#### 1. Install Dependencies

Install the dependencies for the root, server, and client:

```bash
# In the root directory
npm install

# In the server directory
cd server && npm install
cd ..

# In the client directory
cd client && npm install
cd ..
```

#### 2. Configure Environment Variables

Create `.env` files based on the provided examples.

```bash
cp .env.example .env
```
Ensure your `DB_USER` and `DB_PASSWORD` in `.env` match your local PostgreSQL configuration.

#### 3. Start Database

If you have Docker, you can start just the database container:

```bash
docker-compose up -d db
```

#### 4. Run Migrations

Set up the database tables by running migrations:

```bash
cd server
npm run db:migrate
cd ..
```

#### 5. Start the Application

You can start both the client and server concurrently from the root directory:

```bash
npm run dev
```

* The React client will be available at `http://localhost:3000`
* The API server will be available at `http://localhost:5000`
## User Roles

| Role                        | Description                                      |
|-----------------------------|--------------------------------------------------|
| Wereda Super Admin          | Final authorization, Wereda-wide access          |
| Kebele Admin                | Local review, assessment, Kebele decisions       |
| Kebele Facilitator          | Assisted registration, document upload           |
| Public (no account needed)  | Register, submit feedback and complaints         |
