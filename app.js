const express = require('express');
const path = require('path');
const app = express();

// Route imports
const authRoutes = require('./routes/authRoutes');
const animeRoutes = require('./routes/animeRoutes');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Needed to handle JSON requests from frontend (e.g., PUT/DELETE)
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', authRoutes);   // Handles login, signup, etc.
app.use('/', animeRoutes);  // Handles /collection, /:id, etc.

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
