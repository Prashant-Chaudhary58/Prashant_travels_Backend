const express = require('express');

const router = express.Router();

const propertyController = require('../controllers/propertyController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Add authMiddleware to the registerProperty route
router.post('/registerProperty', authMiddleware, upload.array('images', 5), propertyController.registerProperty);
router.get('/viewAllProperty', propertyController.viewAllProperty);
router.delete('/deleteProperty/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;