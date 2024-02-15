// GET / - filter: title, description, img, price, category, status, quantity=

const fdb = require('../firebase').fdb;

exports.getProducts = async function (req, res, next) {
    let data = [];

    try {
        await fdb.collection('products').get().then((products) => {
            products.forEach((product) => {
                const product_data = {
                    product_id: product.id,
                    title: product.data().title,
                    description: product.data().description,
                    price: product.data().price,
                    category: product.data().category,
                    status: product.data().status,
                    quantity: product.data().quantity,
                    product_img: product.data().product_img,
                    kazniisa: product.data().kazniisa,
                    articul: product.data().articul,
                
                };
                data.push(product_data);
            });
        });
        res.send(data);
    } catch (err) {
        console.log(err);
    };
};

// POST / - сделать запрос на покупку корзины с покрытием в пдф