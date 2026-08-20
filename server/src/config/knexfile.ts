import path from 'path';
import dotenv from 'dotenv';
import type { Knex } from 'knex';

// Load .env from project root (one level above /server)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const migrationsDir = path.resolve(__dirname, '../../../database/migrations');
const seedsDir      = path.resolve(__dirname, '../../../database/seeds');

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST     || 'localhost',
      port:     Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME     || 'poverty_support_db',
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || '',
    },
    migrations: {
      directory: migrationsDir,
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
    seeds: {
      directory: seedsDir,
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
    pool: { min: 2, max: 10 },
  },

  test: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST       || 'localhost',
      port:     Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME_TEST  || 'poverty_support_test',
      user:     process.env.DB_USER       || 'postgres',
      password: process.env.DB_PASSWORD   || '',
    },
    migrations: {
      directory: migrationsDir,
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
    seeds: {
      directory: seedsDir,
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: migrationsDir },
    pool: { min: 2, max: 20 },
  },
};

export default config;
