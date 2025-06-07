// models/logModel.js
const db = require('../config/db');

// ✅ Ensure logs table exists
const createLogsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        action TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Logs table ready.');
  } catch (error) {
    console.error('❌ Failed to create logs table:', error);
  }
};

// 🔧 Initialize table on module load
createLogsTable();

// ✅ Add a new log entry
const addLog = async (username, action) => {
  try {
    await db.query(
      'INSERT INTO logs (username, action) VALUES ($1, $2)',
      [username, action]
    );
  } catch (error) {
    console.error('❌ Failed to insert log:', error);
  }
};

// ✅ Fetch all logs ordered by date descending
const getAllLogs = async () => {
  try {
    const result = await db.query(
      'SELECT * FROM logs ORDER BY date DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('❌ Failed to fetch logs:', error);
    return [];
  }
};

module.exports = {
  addLog,
  getAllLogs
};
