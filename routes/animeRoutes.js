const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const adminController = require('../controllers/adminController');
const isLoggedIn = require('../middleware/authMiddleware');


// API routes
router.get('/api/anime', animeController.getAllAnime);
router.put('/api/anime/:id', animeController.updateAnime);
router.delete('/api/anime/:id', animeController.deleteAnime);

// User collection views
router.get('/collection', animeController.renderAnimeCollection);
router.post('/addanime', animeController.addAnime);
router.post('/anime/:id/update', animeController.updateAnimePost);
router.post('/anime/:id/delete', animeController.deleteAnimePost);

// Admin panel
// Admin panel (protect these routes)
router.get('/admin', isLoggedIn, adminController.renderAdminPanel);
router.post('/admin/anime/:id/update', isLoggedIn, adminController.updateAnime);
router.post('/admin/anime/:id/delete', isLoggedIn, adminController.deleteAnime);
router.put('/admin/suspend/:id', isLoggedIn, adminController.suspendUser);

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Logout failed');
    }
    res.redirect('/');
  });
});

module.exports = router;
