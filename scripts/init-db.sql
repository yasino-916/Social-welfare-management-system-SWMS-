-- Initial PostgreSQL setup script
-- Runs once when the container is first created

-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable the pg_trgm extension for full-text similarity search (optional)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a separate test database if running in development
-- (the main DB is created by POSTGRES_DB env var automatically)
