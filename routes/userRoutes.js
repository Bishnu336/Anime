const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Example route for user profile or list
router.get('/profile', userController.getProfile); // You define this in userController.js

module.exports = router;
