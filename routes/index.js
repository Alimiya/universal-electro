const express = require('express');
const router = express.Router();
const {verifyAdminToken} = require('../middlewares/verify')
const Controller = require('../controllers/adminController')

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/service', (req, res) => {
    res.render('service');
});

router.get('/catalog', (req, res) => {
    res.render('catalog');
});

router.get('/certificate', (req, res) => {
    res.render('certificate');
});

router.get('/partner', (req, res) => {
    res.render('partner');
})

router.get('/contact', (req, res) => {
    res.render('contact');
})

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/admin/products', verifyAdminToken(), (req, res) => {
    res.render('products');
});

router.get('/admin/requests', (req, res) => {
    res.render('requests');
});


module.exports = router