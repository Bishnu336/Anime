const animeModel = require('../models/animeModel');
const userModel = require('../models/userModel');
const logModel = require('../models/logModel');
const db = require('../config/db');

// Get all anime (API)
exports.getAllAnime = async (req, res) => {
  try {
    const animes = await animeModel.getAllAnime();
    res.json(animes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch anime' });
  }
};

// Render anime collection page
exports.renderAnimeCollection = async (req, res) => {
  try {
    const animes = await animeModel.getAllAnime();
    res.render('collection', { animes });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Add new anime (with logging)
exports.addAnime = async (req, res) => {
  const { title, genre, status } = req.body;
  const userId = req.session.userId;
  const userName = req.session.userName || 'anonymous';

  try {
    await animeModel.addAnime(title, genre, status, userId);
    await logModel.addLog(userName, `Added new anime: "${title}"`);
    res.redirect('/collection');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add anime');
  }
};

// Update anime (API route, JSON response)
exports.updateAnime = async (req, res) => {
  const id = req.params.id;
  const { title, genre, status } = req.body;
  const userName = req.session.userName || 'anonymous';

  try {
    await animeModel.updateAnime(id, title, genre, status);
    await logModel.addLog(userName, `Updated anime ID ${id}: "${title}"`);
    res.json({ message: 'Anime updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update anime' });
  }
};

// Update anime (from collection page, POST form)
exports.updateAnimePost = async (req, res) => {
  const id = req.params.id;
  const { title, genre, status } = req.body;
  const userName = req.session.userName || 'anonymous';

  try {
    await animeModel.updateAnime(id, title, genre, status);
    await logModel.addLog(userName, `Updated anime ID ${id}: "${title}"`);
    res.redirect('/collection');
  } catch (err) {
    res.status(500).send('Failed to update anime');
  }
};

// Delete anime (API route, JSON response)
exports.deleteAnime = async (req, res) => {
  const id = req.params.id;
  const userName = req.session.userName || 'anonymous';

  try {
    await animeModel.deleteAnime(id);
    await logModel.addLog(userName, `Deleted anime ID ${id}`);
    res.json({ message: 'Anime deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete anime' });
  }
};

// Delete anime (POST form from collection page)
exports.deleteAnimePost = async (req, res) => {
  const id = req.params.id;
  const userName = req.session.userName || 'anonymous';

  try {
    await animeModel.deleteAnime(id);
    await logModel.addLog(userName, `Deleted anime ID ${id}`);
    res.redirect('/collection');
  } catch (err) {
    res.status(500).send('Failed to delete anime');
  }
};

// Render Admin Panel
exports.renderAdminPanel = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const animeList = await animeModel.getAllAnimeWithUsers();
    const editId = req.query.edit;
    res.render('admin', { users, animeList, editId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load admin panel');
  }
};

// Suspend User
exports.suspendUser = async (req, res) => {
  const userId = req.params.id;
  const userName = req.session.userName || 'admin';

  try {
    await db.query('UPDATE users SET status = $1 WHERE id = $2', ['Suspended', userId]);
    await logModel.addLog(userName, `Suspended user ID ${userId}`);
    res.json({ success: true, message: 'User suspended successfully.' });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ success: false, message: 'Failed to suspend user.' });
  }
};
