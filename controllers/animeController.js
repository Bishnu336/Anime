const animeModel = require('../models/animeModel'); // Import model functions

// Get all anime entries (for API)
exports.getAllAnime = async (req, res) => {
  try {
    const animes = await animeModel.getAllAnime();
    res.json(animes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch anime' });
  }
};

// Update an anime entry by ID
exports.updateAnime = async (req, res) => {
  const id = req.params.id;
  const { title, genre, status } = req.body;

  try {
    await animeModel.updateAnime(id, title, genre, status);
    res.json({ message: 'Anime updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update anime' });
  }
};

// Delete an anime entry by ID
exports.deleteAnime = async (req, res) => {
  const id = req.params.id;

  try {
    await animeModel.deleteAnime(id);
    res.json({ message: 'Anime deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete anime' });
  }
};

// Render the anime collection EJS view
exports.renderAnimeCollection = async (req, res) => {
  try {
    const animes = await animeModel.getAllAnime();
    res.render('collection', { animes }); // Pass anime data to EJS
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Add a new anime (from form)
exports.addAnime = async (req, res) => {
  const { title, genre, status } = req.body;

  try {
    await animeModel.addAnime(title, genre, status);
    res.redirect('/collection'); // Redirect after successful insert
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add anime');
  }
};
