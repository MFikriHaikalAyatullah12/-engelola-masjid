const { Pool } = require('pg');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

async function setupProductionDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Setting up production database...\n');
    
    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Users table does not exist. Creating tables...\n');
      
      // Read and execute schema.sql
      const fs = require('fs');
      const schema = fs.readFileSync('./database/schema.sql', 'utf8');
      await pool.query(schema);
      
      console.log('✓ Tables created successfully\n');
    } else {
      console.log('✓ Users table already exists\n');
    }
    
    // Verify table structure
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Users table structure:');
    console.table(columns.rows);
    
    // Check if there are any users
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`\n👥 Current users: ${userCount.rows[0].count}\n`);
    
    if (userCount.rows[0].count === 0) {
      console.log('Creating default admin user...');
      
      const hashedPassword = await bcryptjs.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['admin', 'admin@masjid.com', hashedPassword, 'admin']
      );
      
      console.log('✓ Default admin user created');
      console.log('  Username: admin');
      console.log('  Email: admin@masjid.com');
      console.log('  Password: admin123\n');
    }
    
    console.log('✅ Production database setup complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupProductionDatabase();
