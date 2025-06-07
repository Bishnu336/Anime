const db = require('../config/db');


// Create anime_collection table if it doesn't exist
const createAnimeTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS anime_collection (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      genre VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      submitted_by INTEGER REFERENCES users(id)
    )
  `);
};

createAnimeTable();

// Add anime (with optional submitted_by)
const addAnime = async (title, genre, status, submitted_by = null) => {
  return db.query(
    'INSERT INTO anime_collection (title, genre, status, submitted_by) VALUES ($1, $2, $3, $4)',
    [title, genre, status, submitted_by]
  );
};

// Get all anime
const getAllAnime = async () => {
  const result = await db.query('SELECT * FROM anime_collection');
  return result.rows;
};

// Update anime
const updateAnime = async (id, title, genre, status, submitted_by = null) => {
  return db.query(
    'UPDATE anime_collection SET title = $1, genre = $2, status = $3, submitted_by = $4 WHERE id = $5',
    [title, genre, status, submitted_by, id]
  );
};

// Delete anime
const deleteAnime = async (id) => {
  return db.query('DELETE FROM anime_collection WHERE id = $1', [id]);
};

// Get all anime with associated user names
const getAllAnimeWithUsers = async () => {
  const result = await db.query(`
    SELECT 
      anime_collection.id,
      anime_collection.title,
      anime_collection.genre,
      anime_collection.status,
      users.name AS submitted_by
    FROM anime_collection
    LEFT JOIN users ON anime_collection.submitted_by = users.id
    ORDER BY anime_collection.id ASC
  `);
  return result.rows;
};

module.exports = {
  addAnime,
  getAllAnime,
  updateAnime,
  deleteAnime,
  getAllAnimeWithUsers
};
