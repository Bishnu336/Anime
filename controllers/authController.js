const userModel = require('../models/userModel');
const db = require('../config/db'); // Ensure this is present to query anime_collection

// Render signup form
exports.getSignup = (req, res) => {
  res.render('signup', { message: null });
};

// Handle signup
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.render('signup', { message: 'Email already registered.' });
    }

    await userModel.createUser(name, email, password, role);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('signup', { message: 'Error during signup.' });
  }
};

// Render login form
exports.getLogin = (req, res) => {
  res.render('login', { message: null });
};

// Handle login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmailAndPassword(email, password);
    if (user) {
      return res.redirect('/home');
    } else {
      res.render('login', { message: 'Invalid email or password.' });
    }
  } catch (err) {
    console.error(err);
    res.render('login', { message: 'Login failed.' });
  }
};

// Render home page
exports.getIndex = (req, res) => {
  res.render('home');
};

// Render collection page with anime list from DB
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
  res.render('addanime'); // Ensure you have addanime.ejs view
};
