const db = require('../config/db');
const userModel = require('../models/userModel');

// Render profile page
exports.getProfile = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('profile', {
    user: {
      id: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail,
    }
  });
};

// Render home page
exports.getIndex = (req, res) => {
  res.render('home');
};

// Render anime collection page
exports.getCollection = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM anime_collection');
    res.render('collection', { animes: result.rows });
  } catch (err) {
    console.error(err);
    res.render('collection', { animes: [], message: 'Failed to load anime list.' });
  }
};

// Render add-anime form
exports.getAddList = (req, res) => {
  res.render('addanime');
};
