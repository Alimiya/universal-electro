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
        fs.unlink(product_img.path, () => { })
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
            destination: `products/${pd.id}`
        });
        var product_image_url = `https://firebasestorage.googleapis.com/v0/b/universal-electro.appspot.com/o/products%2F${pd.id}?alt=media`
        await fdb.collection('products').doc(pd.id).update({ product_img: product_image_url, product_id: pd.id }).then(() => {
            r['r'] = 1;
            r['product_id'] = pd.id;
            res.send(r);
            fs.unlink(product_img.path, () => { });
        });
    }).catch((e) => {
        console.log(e);
        res.send(r);
        fs.unlink(product_img.path, () => { });
    });
}
// POST /product/update/:id
exports.updateProduct = async function (req, res, next) {
    let r = { r: 0 };
    let product_id = req.body.product_id;
    let new_title = req.body.title;
    let new_description = req.body.description;
    let new_price = req.body.price;
    let new_category = req.body.category;
    let new_status = req.body.status;
    let new_quantity = req.body.quantity;
    let new_product_img = req.file;
    let new_kazniisa = req.body.kazniisa;
    let new_articul = req.body.articul;
    let random = Math.floor(10000 + Math.random() * 90000)

    if (!new_title || !new_description || !new_price || !new_category || !new_status || !new_quantity || !new_kazniisa || !new_articul) {
        res.send(r);
        return;
    }
    // if new_product_img is not undefined then 1) First delete image from storage 2) upload image to storage and 3) then to firestore update 
    if (new_product_img != undefined) {
        try {
            var file = storage.file(`products/${product_id}`);
            await file.delete().then(async () => {
                storage.upload(new_product_img.path, {
                    gzip: true,
                    metadata: metadata,
                    destination: `products/${product_id + random}`
                }).then(() => {
                    fs.unlink(new_product_img.path, () => { });

                });
            })

        } catch (error) {
            console.log(error);
            res.send(r);
            return;
        }
    }

    try {
        let product_image_url = `https://firebasestorage.googleapis.com/v0/b/universal-electro.appspot.com/o/products%2F${product_id + random}?alt=media`
        await fdb.collection('products').doc(product_id).update({
            title: new_title,
            description: new_description,
            price: new_price,
            category: new_category,
            status: new_status,
            quantity: new_quantity,
            kazniisa: new_kazniisa,
            articul: new_articul,
            product_img: product_image_url
        });

        r['r'] = 1;
        r['product_id'] = product_id;
        res.send(r);

    } catch (error) {
        console.log(error);
        res.send(r);
    }
};


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
    }).catch((e) => {
        console.log(e);
        res.send(r);
    })
}

// GET /requests
exports.getRequests = async (req, res) => {
    let data = []

    try {
        await fdb.collection('requests').get().then((requests) => {
            requests.forEach((request) => {
                var request_data = {
                    request_id: request.id,
                    products_list: request.data().products_list,
                    phone: request.data().phone,
                    name: request.data().name,
                    created_time: request.data().created_time,
                    status: request.data().status
                }
                data.push(request_data);
            })
        })
        res.send(data)
    } catch (err) {
        console.log(err)
    }
}

// POST /request/update/:id
exports.updateRequest = async (req, res) => {
    let r = { r: 0 };
    let request_id = req.body.request_id;
    let new_products_list = req.body.products_list;
    let action = req.body.action;
    let status = req.body.status;

    if (action == 'updateList') {
        await fdb.collection('requests').doc(request_id).update({
            products_list: new_products_list
        }).then(() => {
            r['r'] = 1;
            r['request_id'] = request_id;
            res.send(r);
        }).catch((e) => {
            console.log(e);
            res.send(r);
        });
    }

    else
    
    if (action == 'updateStatus') {
        await fdb.collection('requests').doc(request_id).update({
            status: status
        }).then(() => {
            r['r'] = 1;
            r['request_id'] = request_id;
            res.send(r);
        }).catch((e) => {
            console.log(e);
            res.send(r);
        });
    }
}

exports.updateRequestStatus = async (req, res) => {
    let r = { r: 0 };
    let request_id = req.body.request_id;
    let new_products_list = req.body.products_list;

    await fdb.collection('requests').doc(request_id).update({
        products_list: new_products_list
    }).then(() => {
        r['r'] = 1;
        r['request_id'] = request_id;
        res.send(r);
    }).catch((e) => {
        console.log(e);
        res.send(r);
    });
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
    }).catch((e) => {
        console.log(e);
        res.send(r);
    })
}
