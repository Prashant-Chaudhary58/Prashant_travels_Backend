const express = require('express');
const router = express.Router();

const packageController = require('../controllers/registerPackage'); // or packageController.js
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new package
router.post('/registerPackage', authMiddleware, upload.array('images', 5), packageController.registerPackage);

// View all packages
router.get('/viewAllPackages', packageController.viewAllPackage);

// Delete a package
router.delete('/deletePackage/:id', authMiddleware, packageController.deletePackage);

module.exports = router;
