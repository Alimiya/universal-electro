// GET / - filter: title, description, img, price, category, status, quantity=

const fdb = require('../firebase').fdb;
const {jsPDF} = require('jspdf')
require('jspdf-autotable')
const doc = new jsPDF()


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

exports.createRequest = async (req, res) => {
    let r = { r: 0 }
    console.log(req.body)
    let products_list = req.body.products;
    let phone = req.body.phone
    let name = req.body.name

    if (!products_list || !phone || !name) return res.send(r);

    await fdb.collection('requests').add({
        products_list: products_list,
        phone: phone,
        name: name
    }).then(()=>{
        r['r'] = 1;
        res.send(r);
    }).catch((e) => {
        console.log(e);
        res.send(r);
    });
}

// POST / - сделать запрос на покупку корзины с покрытием в пдф
exports.createPdf = async (req,res) =>{
    doc.autoTable({ html: '#my-table' })
    console.log(doc)
doc.autoTable( {
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain'],
  ],
})

doc.save('table.pdf')
}