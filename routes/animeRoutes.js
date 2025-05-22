const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

// API routes (JSON responses)
router.get('/api/anime', animeController.getAllAnime);         // Get all anime entries
router.put('/api/anime/:id', animeController.updateAnime);     // Update an anime by ID
router.delete('/api/anime/:id', animeController.deleteAnime);  // Delete an anime by ID

// View routes
router.get('/collection', animeController.renderAnimeCollection);  // Render collection page
router.post('/addanime', animeController.addAnime);               // Handle form submission

module.exports = router;
