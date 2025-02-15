const mysql = require('mysql2/promise');
require('dotenv').config();

const auth_db  = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const userDB = mysql.createPool({
  host: process.env.USER_DB_HOST,
  user: process.env.USER_DB_USER,
  password: process.env.USER_DB_PASSWORD,
  database: process.env.USER_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = { auth_db , userDB };


const testConnection = async () => {
  try {
    // Test Authentication DB Connection
    const authConn = await auth_db.getConnection();
    console.log('✅ Connected to Authentication Database!');
    authConn.release();

    // Test User Management DB Connection
    const userConn = await userDB.getConnection();
    console.log('✅ Connected to User Management Database!');
    userConn.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);  
  }
};

// Run connection test
testConnection();