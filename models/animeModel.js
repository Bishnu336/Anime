// models/animeModel.js
const db = require('../config/db');

// Create anime_collection table if it doesn't exist
const createAnimeTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS anime_collection (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      genre VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL
    )
  `);
};

createAnimeTable();

const addAnime = async (title, genre, status) => {
  return db.query(
    'INSERT INTO anime_collection (title, genre, status) VALUES ($1, $2, $3)',
    [title, genre, status]
  );
};

const getAllAnime = async () => {
  const result = await db.query('SELECT * FROM anime_collection');
  return result.rows;
};

const updateAnime = async (id, title, genre, status) => {
  return db.query(
    'UPDATE anime_collection SET title = $1, genre = $2, status = $3 WHERE id = $4',
    [title, genre, status, id]
  );
};

const deleteAnime = async (id) => {
  return db.query('DELETE FROM anime_collection WHERE id = $1', [id]);
};

module.exports = {
  addAnime,
  getAllAnime,
  updateAnime,
  deleteAnime,
};
