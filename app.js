const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
require('dotenv').config();

// ✅ Session Middleware (MUST come before routes)
app.use(session({
  secret: 'yourSecretKey',         // Consider storing this in an env variable for production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }        // Set to true only if using HTTPS
}));

// ✅ Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`Request for ${req.path} method ${req.method}`);
  next();
});



// ✅ Route Files
const authRoutes = require('./routes/authRoutes');
const animeRoutes = require('./routes/animeRoutes');
const userRoutes = require('./routes/userRoutes');  

// ✅ Route Usage
app.use('/', authRoutes);
app.use('/', animeRoutes);
app.use('/', userRoutes);          

// ✅ View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
