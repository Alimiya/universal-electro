const express = require('express')
const router = express.Router()
const Controller = require('../controllers/adminController')
const {verifyAdminToken} = require('../middlewares/verify')
const {ADMIN_TOKEN_SECRET} = process.env
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

router.post('/product/create', upload.single('product_img'), Controller.createProduct);
router.post('/product/update', upload.single('product_img'), Controller.updateProduct);
router.post('/product/delete', Controller.deleteProduct);

module.exports = router