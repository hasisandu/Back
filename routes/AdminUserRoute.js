const express = require('express');
const AdminUserController = require('../controller/AdminUserController');
const router = express.Router();

router.post('/registerUser', AdminUserController.registerUser);
router.get('/loginUser', AdminUserController.loginUser);
router.get('/verifyToken', AdminUserController.verifyToken);

module.exports = router;
