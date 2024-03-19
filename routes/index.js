const express = require('express');
const router = express.Router();
const {verifyAdminToken} = require('../middlewares/verify')

router.use((req, res, next) => {
    const isAdminCookieExists = req.cookies.admin && req.originalUrl.startsWith('/admin');
    res.locals.isAdmin = isAdminCookieExists;
    res.locals.language = req.cookies.language || 'ru';
    res.locals.page = '';
    next();
});

router.get('/', (req, res) => {
    res.render('index', {L:L, language: req.cookies.language ? req.cookies.language : 'ru'});
});

router.get('/service', (req, res) => {
    res.render('service', {L:L, language: req.cookies.language ? req.cookies.language : 'ru'});
});

router.get('/catalog', (req, res) => {
    res.render('catalog', {L:L, language: req.cookies.language ? req.cookies.language : 'ru'});
});

router.get('/certificate', (req, res) => {
    res.render('certificate', {L:L, language: req.cookies.language ? req.cookies.language : 'ru'});
});

router.get('/contact', (req, res) => {
    res.render('contact', {L:L, language: req.cookies.language ? req.cookies.language : 'ru'});
})

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/admin', verifyAdminToken(), (req, res) => {
    res.redirect('/admin/products');
})

router.get('/admin/products', verifyAdminToken(), (req, res) => {
    res.render('products', {page: 'products'});
});

router.get('/admin/requests', verifyAdminToken(), (req, res) => {
    res.render('requests', {page: 'requests'});
});

router.post('/', (req,res)=>{
    var r = {r:0};
    var action = req.body.action;
    
    if(action == 'changeLanguage'){
        const language = req.body.language;
        res.cookie("language", language);
        r['r'] = 1;
        res.send(JSON.stringify(r));
    }
});

module.exports = router