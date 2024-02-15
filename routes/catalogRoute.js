const express = require('express')
const router = express.Router()
const Controller = require('../controllers/catalogController')

router.get('/products', Controller.getProducts);
router.post('/request/create', Controller.createRequest);

module.exports = router