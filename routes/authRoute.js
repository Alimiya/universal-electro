const express = require('express')
const router = express.Router()
const Controller = require('../controllers/authController')

router.post('/login', Controller.login);

module.exports = router