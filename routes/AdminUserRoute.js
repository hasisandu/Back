const express = require('express');
const AdminUserController = require('../controller/AdminUserController');
const router = express.Router();

router.post('/registerUser', AdminUserController.registerUser);

module.exports = router;
