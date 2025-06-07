require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require('../models/usermodel');
const db = require('../config/db');




// Setup email transporter using Gmail service
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // enable debug output
  logger: true // log to console
});


// Render signup form
exports.getSignup = (req, res) => {
  res.render('signup', { message: null });
};

// Handle signup – create normal user only, no role involved, send verification email
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.render('signup', { message: 'Email already registered.' });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user with verification token and is_verified = false
    await userModel.createUser(name, email, password, verificationToken);

    // Prepare verification URL
    const verificationUrl = `http://${req.headers.host}/verify-email?token=${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Please verify your email',
      html: `<p>Hello ${name},</p>
             <p>Thanks for signing up! Please verify your email by clicking the link below:</p>
             <a href="${verificationUrl}">Verify Email</a>`,
    });

    res.render('signup', { message: 'Signup successful! Please check your email to verify your account.' });
  } catch (err) {
    console.error(err);
    res.render('signup', { message: 'Error during signup.' });
  }
};

// Render login form
exports.getLogin = (req, res) => {
  res.render('login', { message: null });
};

// Handle login – admin credentials from env, users from DB with verification check
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Admin login check from env vars
    if (email === process.env.ADMIN_EMAIL) {
      const isAdminPasswordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
      if (isAdminPasswordMatch) {
        req.session.userId = 'admin';
        req.session.userName = 'Admin';
        req.session.userEmail = email;
        req.session.isAdmin = true;
        return res.redirect('/admin');
      } else {
        return res.render('login', { message: 'Invalid email or password.' });
      }
    }

    // Normal user login from DB
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.render('login', { message: 'Invalid email or password.' });
    }

    // Check if user has verified their email
    if (!user.is_verified) {
      return res.render('login', { message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { message: 'Invalid email or password.' });
    }

    // Set session data
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.isAdmin = false;

    return res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.render('login', { message: 'Login failed.' });
  }
};


// Email verification handler
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.send('Verification token is missing.');
  }

  try {
    const user = await userModel.verifyUserByToken(token);
    if (!user) {
      return res.send('Invalid or expired verification token.');
    }
    // Email successfully verified, you can render a success message or redirect
    res.send('Email verified successfully! You can now <a href="/login">login</a>.');
  } catch (err) {
    console.error(err);
    res.send('Error verifying email.');
  }
};

// Render home page for logged-in users
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

// Logout handler
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
