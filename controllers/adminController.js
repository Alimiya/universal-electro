// POST /product/create
const express = require('express')
const fdb = require('../firebase').fdb;
const storage = require('../firebase').storage;
const uuid = require('uuid-v4');
const fs = require('fs');

const metadata = {
    metadata: {
        firebaseStorageDownloadTokens: uuid()
    },
    contentType: 'image/png',
    cacheControl: 'public, max-age=31536000',
};

exports.createProduct = async function (req, res, next) {
    let r = { r: 0 };
    let title = req.body.title;
    let description = req.body.description;
    let price = req.body.price;
    let category = req.body.category;
    let status = req.body.status;
    let quantity = req.body.quantity;
    let product_img = req.file;

    if (!title || !description || !price || !category || !status || !quantity) {
        res.send(r);
        fs.unlink(product_img.path, () => {

        })
        return;
    }
    
    await fdb.collection('products').add({
        title: title,
        description: description,
        price: price,
        category: category,
        status: status,
        quantity: quantity
    }).then(async (pd) => {
        await storage.upload(product_img.path, {
            gzip: true,
            metadata: metadata,
            destination: `products/${product_img.originalname}`
        });
        var product_image_url = `https://firebasestorage.googleapis.com/v0/b/universal-electro.appspot.com/o/products%2F${product_img.originalname}?alt=media`
        await fdb.collection('products').doc(pd.id).update({ product_img: product_image_url }).then(() => {
            r['r'] = 1;
            res.send(r);

            fs.unlink(product_img.path, () => {

            })
        })
    }).catch((e) => {
        console.log(e);
        res.send(r);
        fs.unlink(product_img.path, () => {

        })
    })
}
// POST /product/update/:id
// POST /product/delete/:id

// GET /requests
// POST /request/delete/:id

