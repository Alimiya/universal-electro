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
    let kazniisa = req.body.kazniisa
    let articul = req.body.articul

    if (!title || !description || !price || !category || !status || !quantity || !kazniisa || !articul) {
        fs.unlink(product_img.path, () => {})
        return res.send(r)
    }

    await fdb.collection('products').add({
        title: title,
        description: description,
        price: price,
        category: category,
        status: status,
        quantity: quantity,
        kazniisa: kazniisa,
        articul: articul
    }).then(async (pd) => {
        await storage.upload(product_img.path, {
            gzip: true,
            metadata: metadata,
            destination: `products/${product_img.originalname}`
        });
        var product_image_url = `https://firebasestorage.googleapis.com/v0/b/universal-electro.appspot.com/o/products%2F${product_img.originalname}?alt=media`
        await fdb.collection('products').doc(pd.id).update({ product_img: product_image_url, product_id: pd.id }).then(() => {
            r['r'] = 1;
            r['product_id'] = pd.id;
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
exports.updateProduct = async function (req, res, next) {
    let r = { r: 0 };
    let product_id = req.body.product_id;
    let new_title = req.body.new_title;
    let new_description = req.body.new_description;
    let new_price = req.body.price;
    let new_category = req.body.category;
    let new_status = req.body.status;
    let new_quantity = req.body.quantity;
    let new_product_img = req.file;
    let new_kazniisa = req.body.kazniisa;
    let new_articul = req.body.articul;


    if (!new_title || !new_description || !new_price || !new_category || !new_status || !new_quantity || !new_kazniisa || !new_articul) {
        res.send(r);
        return;
    }

    await fdb.collection('products').doc(product_id).update({
        title: new_title,
        description: new_description,
        price: new_price,
        category: new_category,
        status: new_status,
        quantity: new_quantity,
        kazniisa: new_kazniisa,
        articul: new_articul
    }).then(() => {
        r['r'] = 1;
        r['product_id'] = product_id;
        res.send(r);
    }).catch((e) => {
        console.log(e);
        res.send(r);
    })
}

// POST /product/delete/:id
exports.deleteProduct = async function (req, res, next) {
    let r = { r: 0 };
    let product_id = req.body.product_id;

    if (!product_id) {
        return res.send(r);
    }

    await fdb.collection('products').doc(product_id).delete().then(() => {
        r['r'] = 1;
        r['product_id'] = product_id;
        res.send(r);
    }).catch((e)=>{
        console.log(e);
        res.send(r);
    })
}

// GET /requests
exports.getRequests = async (req,res)=>{
    let data = []

    try{
        await fdb.collection('requests').get().then((requests)=>{
            requests.forEach((request)=>{
                const request_data = {
                    request_id: request.id,
                    question: request.data().question,
                    phone: request.data().phone,
                    email: request.data().email,
                }
                data.push(request_data)
            })
        })
        res.send(data)
    } catch (err) {
        console.log(err)
    }
}
// POST /request/delete/:id
exports.deleteRequest = async (req, res) => {
    let r = { r: 0 };
    let request_id = req.body.request_id;

    if (!request_id) {
        return res.send(r);
    }

    await fdb.collection('requests').doc(request_id).delete().then(() => {
        r['r'] = 1;
        r['request_id'] = request_id;
        res.send(r);
    }).catch((e)=>{
        console.log(e);
        res.send(r);
    })
}
