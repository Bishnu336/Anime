const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');  // Use adminController instead of animeController

// User routes
router.get('/profile', userController.getProfile);
router.get('/collection', userController.getCollection);
router.get('/addanime', userController.getAddList);
router.get('/home', userController.getIndex);

// Admin panel route
router.get('/admin', adminController.renderAdminPanel);

// Logout
router.get('/logout', (req, res) => {
  console.log('Logout requested');
  console.log('Session before destroy:', req.session);
  
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    
    console.log('Session destroyed, clearing cookie');
    // Clear cookie with explicit path option
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect('/');
  });
});

module.exports = router;
