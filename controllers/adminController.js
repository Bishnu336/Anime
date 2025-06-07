const animeModel = require('../models/animeModel');
const userModel = require('../models/usermodel');
const logModel = require('../models/logModel');
const db = require('../config/db');

// Render the admin panel with users, anime list, logs
exports.renderAdminPanel = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const animeList = await animeModel.getAllAnimeWithUsers();
    const logList = await logModel.getAllLogs();
    const editId = req.query.edit;

    res.render('admin', { users, animeList, logList, editId });
  } catch (err) {
    console.error('Failed to render admin panel:', err);
    res.status(500).send('Failed to load admin panel');
  }
};

// Update anime information
exports.updateAnime = async (req, res) => {
  const id = req.params.id;
  const { title, genre, status } = req.body;
  const user = req.session.userName || 'admin';

  try {
    await animeModel.updateAnime(id, title, genre, status);
    await logModel.addLog(user, `Updated anime ID ${id}: "${title}"`);
    res.redirect('/admin#list');
  } catch (err) {
    console.error('Failed to update anime:', err);
    res.status(500).send('Failed to update anime');
  }
};

// Delete an anime from the list
exports.deleteAnime = async (req, res) => {
  const id = req.params.id;
  const user = req.session.userName || 'admin';

  try {
    // Fetch the anime title before deleting (for better logging)
    const animeList = await animeModel.getAllAnime();
    const anime = animeList.find(a => a.id == id);
    const title = anime ? anime.title : 'Unknown';

    await animeModel.deleteAnime(id);
    await logModel.addLog(user, `Deleted anime ID ${id}: "${title}"`);
    res.redirect('/admin#list');
  } catch (err) {
    console.error('Failed to delete anime:', err);
    res.status(500).send('Failed to delete anime');
  }
};

// Suspend a user by ID
exports.suspendUser = async (req, res) => {
  const userId = req.params.id;
  const user = req.session.userName || 'admin';

  try {
    await db.query('UPDATE users SET status = $1 WHERE id = $2', ['Suspended', userId]);
    await logModel.addLog(user, `Suspended user ID ${userId}`);
    res.json({ success: true, message: 'User suspended successfully.' });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ success: false, message: 'Failed to suspend user.' });
  }
};
