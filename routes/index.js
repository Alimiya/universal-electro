const express = require('express');
const router = express.Router();
const {verifyAdminToken} = require('../middlewares/verify')
const Controller = require('../controllers/adminController')

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/certificate', (req, res) => {
    res.render('certificate');
});

router.get('/service', (req, res) => {
    res.render('service');
});

router.get('/admin/products', verifyAdminToken(), (req, res) => {
    res.render('products');
});

router.get('/admin/requests', (req, res) => {
    res.render('requests');
});

router.get('/catalog', (req, res) => {
    res.render('catalog');
});

module.exports = router