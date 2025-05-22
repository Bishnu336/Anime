const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Redirect root to login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Auth routes
router.get('/login', authController.getLogin);
router.post('/login', authController.login);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.signup);

// If you still need the home page, add it under a different route
router.get('/home', authController.getIndex);

router.get('/addanime', authController.getAddList);
router.get('/collection', authController.getCollection);


module.exports = router;
