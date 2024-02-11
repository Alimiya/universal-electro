const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/admin/products', (req, res) => {
    res.render('products');
});

router.get('/admin/requests', (req, res) => {
    res.render('requests');
});

module.exports = router