const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isLoggedIn = require('../middleware/authMiddleware');


// Show index.ejs as landing page
router.get('/', (req, res) => {
  res.render('index');  // This renders views/index.ejs
});

// Optional: redirect /index to the landing page as well
router.get('/index', (req, res) => {
  res.redirect('/');  // Just sends them to "/"
});

// Auth routes
router.get('/login', authController.getLogin);
router.post('/login', authController.login);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.signup);

router.get('/home', isLoggedIn, authController.getIndex);
router.get('/addanime', isLoggedIn, authController.getAddList);
router.get('/collection', isLoggedIn, authController.getCollection);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
