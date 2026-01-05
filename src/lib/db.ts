import { Pool } from 'pg';

// Log untuk debugging di production
console.log('Initializing database connection...');
console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased from 2000ms
  statement_timeout: 60000,
  query_timeout: 60000,
  // Add connection retry settings
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Test connection on initialization
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export default pool;