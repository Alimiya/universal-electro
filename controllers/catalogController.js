// GET / - filter: title, description, img, price, category, status, quantity=

const fdb = require('../firebase').fdb;
const {jsPDF} = require('jspdf')
const fs = require('fs')
require('jspdf-autotable')

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
    }
    ;
};

exports.createRequest = async (req, res) => {
    let r = {r: 0}
    console.log(req.body)
    let products_list = req.body.products;
    let phone = req.body.phone
    let name = req.body.name

    if (!products_list || !phone || !name) return res.send(r);

    await fdb.collection('requests').add({
        products_list: products_list,
        phone: phone,
        name: name
    }).then(() => {
        r['r'] = 1;
        res.send(r);
    }).catch((e) => {
        console.log(e);
        res.send(r);
    });
}

exports.createPdf = async (req, res) => {
    const {request_id} = req.query

    if (!request_id) return res.status(400).send("Missing request_id in request body")


    try {
        const docRef = fdb.collection('requests').doc(request_id)
        const doc = await docRef.get()

        if (!doc.exists) return res.status(404).send("Request not found")

        const requestData = doc.data()
        requestData.products_list = JSON.parse(requestData.products_list)

        const bodyData = []
        let totalAmount = 0
        requestData.products_list.forEach((product) => {
            const rowData = [
                product.title,
                product.description,
                product.category,
                product.price,
                product.count,
                product.kazniisa,
                product.articul
            ]
            bodyData.push(rowData)
            totalAmount += parseFloat(product.price) * parseInt(product.count)
        })
        bodyData.push(['', '', '', 'Общая сумма:', totalAmount.toFixed(2), '', ''])

        const docPdf = new jsPDF()
        docPdf.addFont("ArialRegular.ttf", "Arial", "normal")
        docPdf.setFont("Arial")
        docPdf.text(requestData.name, 10, 15)
        docPdf.text(requestData.phone, 10, 25)
        docPdf.autoTable({
            head: [['Название', 'Описание', 'Категория', 'Сумма', 'Количество', 'КазНИИСА', 'Артикул']],
            body: bodyData,
            startY: 30,
            styles: {font: "Arial", fontSize: 9},
        })
        docPdf.save(`temp/${request_id}.pdf`, {returnPromise: true}).then(function () {
            fs.readFile(`temp/${request_id}.pdf`, (err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Error reading the file');
                } else {
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=file.pdf'); 
                    res.end(data);
                    fs.unlink(`temp/${request_id}.pdf`, () => {
                    })
                }
            });
          
        })
    } catch (err) {
        console.log(err)
    }
}