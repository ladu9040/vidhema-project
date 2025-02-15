const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, upload } = require('../middleware/api-middleware');

// Apply middleware to routes
router.post('/', authenticateToken, upload.single('profileImage'), userController.createUser);
router.get('/', authenticateToken, userController.getUsers);
router.put('/:id', authenticateToken, upload.single('profileImage'), userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;