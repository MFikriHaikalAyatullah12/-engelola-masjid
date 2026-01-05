const { Pool } = require('pg');
require('dotenv').config();

async function testRegistration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Testing database connection and user creation...\n');
    
    // Test 1: Check connection
    const testQuery = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', testQuery.rows[0].now);
    
    // Test 2: Check users table
    const tableCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('\n✓ Users table columns:', tableCheck.rows.map(r => r.column_name).join(', '));
    
    // Test 3: Try to query with username
    const testUsername = await pool.query('SELECT username FROM users LIMIT 1');
    console.log('\n✓ Can query username column:', testUsername.rows.length > 0 ? testUsername.rows[0].username : 'No users yet');
    
    // Test 4: Check if we can insert (dry run - we'll rollback)
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const testEmail = `test-${Date.now()}@example.com`;
      const testUser = `testuser${Date.now()}`;
      
      const result = await client.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
        [testUser, testEmail, 'test_hash', 'user']
      );
      
      console.log('\n✓ Can insert user (test):', result.rows[0]);
      
      await client.query('ROLLBACK');
      console.log('✓ Test rollback successful\n');
    } finally {
      client.release();
    }
    
    console.log('All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testRegistration();
