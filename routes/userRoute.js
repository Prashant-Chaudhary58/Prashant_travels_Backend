const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('Setting up user routes'); // Debug log

router.post('/login', loginUser);
router.post('/signup', registerUser);  // Add this line
router.post('/register', registerUser);
router.get('/profile', authMiddleware, (req, res, next) => {
    console.log('Profile route hit, user:', req.user); // Debug log
    next();
}, getUserProfile);

router.put('/update-profile', authMiddleware, updateProfile);

module.exports = router;