require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432, // default PostgreSQL port; change if yours is different
  ssl: {
    rejectUnauthorized: false //set to true if you want to enforce SSL certification validation
  }
});

module.exports = pool;
