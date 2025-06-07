const db = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const createUserTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'Active',
        is_verified BOOLEAN DEFAULT false,
        verification_token TEXT,
        reset_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error('Error creating users table:', err);
  }
};

createUserTable();

const createUser = async (name, email, password, verificationToken) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.query(
    `INSERT INTO users (name, email, password, verification_token) 
     VALUES ($1, $2, $3, $4) RETURNING id, name, email`,
    [name, email, hashedPassword, verificationToken]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserByEmailAndPassword = async (email, password) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  if (!user.is_verified) return null;

  return user;
};

const verifyUserByToken = async (token) => {
  const result = await db.query('SELECT * FROM users WHERE verification_token = $1', [token]);
  const user = result.rows[0];
  if (!user) return null;

  await db.query(
    'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1',
    [user.id]
  );

  return user;
};

const getAllUsers = async () => {
  const result = await db.query('SELECT id, name, email, status FROM users');
  return result.rows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailAndPassword,
  verifyUserByToken,
  getAllUsers,
};
