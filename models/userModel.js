const db = require('../config/db');

// Create table if not exists
const createUserTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) DEFAULT 'user',
      is_verified BOOLEAN DEFAULT false,
      verification_token TEXT,
      reset_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

createUserTable();

const createUser = async (name, email, password, role = 'user') => {
  return db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [name, email, password, role]
  );
};

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserByEmailAndPassword = async (email, password) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailAndPassword
};
