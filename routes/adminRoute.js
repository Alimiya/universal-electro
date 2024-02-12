const express = require('express')
const router = express.Router()
const Controller = require('../controllers/adminController')
const multer = require('multer')
const multer_storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'temp_path/');
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 50
}

const upload = multer({
    storage: multer_storage,
    limits: limits
});

router.post('/create', upload.single('product_img'), Controller.createProduct);

module.exports = router