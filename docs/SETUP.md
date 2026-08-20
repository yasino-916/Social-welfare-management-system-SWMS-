# Local Development Setup

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14
- npm >= 9.x
- Docker & Docker Compose (optional but recommended)

## Quick Start with Docker

```bash
docker-compose up -d
```

This starts PostgreSQL and the API server. The React client runs separately.

## Manual Setup

### 1. Clone and install dependencies

```bash
# Install root-level dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

### 3. Run database migrations

```bash
cd server
npm run db:migrate
npm run db:seed   # optional — loads sample data
```

### 4. Start development servers

```bash
# Terminal 1 — API server (port 5000)
cd server && npm run dev

# Terminal 2 — React client (port 3000)
cd client && npm run dev
```

## Environment Variables

See `.env.example` for all required variables.
