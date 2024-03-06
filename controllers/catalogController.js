// GET / - filter: title, description, img, price, category, status, quantity=

const fdb = require('../firebase').fdb;
const { jsPDF } = require('jspdf')
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
    let r = { r: 0 }
    console.log(req.body)
    let products_list = req.body.products;
    let phone = req.body.phone;
    let name = req.body.name;
    let status = 0;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    if (!products_list || !phone || !name) return res.send(r);

    await fdb.collection('requests').add({
        products_list: products_list,
        phone: phone,
        name: name,
        status: status,
        created_time: formattedDateTime
    }).then(() => {
        r['r'] = 1;
        res.send(r);
    }).catch((e) => {
        console.log(e);
        res.send(r);
    });
}

// exports.createPdf = async (req, res) => {
//     const { request_id } = req.query;

//     if (!request_id) return res.status(400).send("Missing request_id in request body");

//     try {
//         const docRef = fdb.collection('requests').doc(request_id);
//         const doc = await docRef.get();

//         if (!doc.exists) return res.status(404).send("Request not found");

//         const requestData = doc.data();
//         requestData.products_list = JSON.parse(requestData.products_list);

//         const bodyData = [];
//         let totalAmount = 0;
//         requestData.products_list.forEach((product) => {
//             const rowData = [
//                 product.title,
//                 product.description,
//                 product.category,
//                 product.price,
//                 product.count,
//                 product.kazniisa,
//                 product.articul,
//             ];
//             bodyData.push(rowData);
//             totalAmount += parseFloat(product.price) * parseInt(product.count);
//         });
//         bodyData.push(['', '', '', 'Общая сумма:', totalAmount.toFixed(2), '', '']);

//         const docPdf = new jsPDF();
//         docPdf.addFont("ArialRegular.ttf", "Arial", "normal");
//         docPdf.setFont("Arial");

//         // Add the first image at the beginning of the PDF
//         const firstImageBuffer = fs.readFileSync('path/to/first/image.jpg');
//         docPdf.addImage(firstImageBuffer, 'JPEG', 10, 10, 50, 50); // Adjust the coordinates and dimensions

//         docPdf.text(requestData.name, 10, 75); // Adjust Y coordinate based on the image size
//         docPdf.text(requestData.phone, 10, 85);

//         docPdf.autoTable({
//             head: [['Название', 'Описание', 'Категория', 'Сумма', 'Количество', 'КазНИИСА', 'Артикул']],
//             body: bodyData,
//             startY: 100, // Adjust the starting Y coordinate based on the image size
//             styles: { font: "Arial", fontSize: 9 },
//         });

//         // Add the second image at the end of the PDF
//         const secondImageBuffer = fs.readFileSync('path/to/second/image.jpg');
    
//         docPdf.addImage(secondImageBuffer, 'JPEG', 10, docPdf.autoTable.previous.finalY + 10, 50, 50); // Adjust coordinates

//         docPdf.save(`temp/${request_id}.pdf`, { returnPromise: true }).then(function () {
//             fs.readFile(`temp/${request_id}.pdf`, (err, data) => {
//                 if (err) {
//                     res.writeHead(500, { 'Content-Type': 'text/plain' });
//                     res.end('Error reading the file');
//                 } else {
//                     res.setHeader('Content-Type', 'application/pdf');
//                     res.setHeader('Content-Disposition', 'attachment; filename=file.pdf');
//                     res.end(data);
//                     fs.unlink(`temp/${request_id}.pdf`, () => { });
//                 }
//             });
//         });
//     } catch (err) {
//         console.log(err);
//     }
// };

exports.createPdf = async (req, res) => {
    const { request_id } = req.query;

    if (!request_id) return res.status(400).send("Missing request_id in request body");

    try {
        const docRef = fdb.collection('requests').doc(request_id);
        const doc = await docRef.get();

        if (!doc.exists) return res.status(404).send("Request not found");

        const requestData = doc.data();
        requestData.products_list = JSON.parse(requestData.products_list);

        const bodyData = [];
        let totalAmount = 0;
        requestData.products_list.forEach((product) => {
            const rowData = [
                product.title,
                product.description,
                product.category,
                product.price,
                product.count,
                product.kazniisa,
                product.articul,
            ];
            bodyData.push(rowData);
            totalAmount += parseFloat(product.price) * parseInt(product.count);
        });
        bodyData.push(['', '', '', 'Общая сумма:', totalAmount.toFixed(2), '', '']);

        const docPdf = new jsPDF();
        docPdf.addFont("ArialRegular.ttf", "Arial", "normal");
        docPdf.addFont("ArialBold.ttf", "ArialBold", "normal");
        docPdf.setFont("Arial");

        // Add the first image at the beginning of the PDF
        const firstImageBuffer = fs.readFileSync('header_pdf.png');
        docPdf.addImage(firstImageBuffer, 'PNG', 0, 0, docPdf.internal.pageSize.width, 27); // Adjust the coordinates and dimensions

        docPdf.setFont("ArialBold");
        docPdf.setFontSize(9);
        docPdf.text("“UNIVERSALELECTRO” ЖШС", 27, 15);
        docPdf.setFont("Arial");
        docPdf.text("БИН 100240019098 ҚР, Астана қ., Жетiген к. 28/2 үй.", 28, 19);
        docPdf.text('ЖСН KZ908562203118898239 "Банк Центр Кредит" АҚ', 28, 23);
        
        docPdf.setFont("ArialBold");
        docPdf.setFontSize(9);
        docPdf.text("ТОО “UNIVERSALELECTRO”", 112, 15);
        docPdf.setFont("Arial");
        docPdf.text("БИН 100240019098 РК, г. Астана, ул.Жетiген д.28/2.", 112, 19);
        docPdf.text('ИИК KZ908562203118898239 в АО "Банк Центр Кредит"', 112, 23);

        docPdf.setFontSize(12)
        docPdf.text("Заказчик: " + requestData.name, 10, 40); // Adjust Y coordinate based on the image size
        docPdf.text("Номер телефона: " + requestData.phone, 10, 50);

        docPdf.autoTable({
            head: [['Название', 'Описание', 'Категория', 'Сумма', 'Количество', 'КазНИИСА', 'Артикул']],
            body: bodyData,
            startY: 60, // Adjust the starting Y coordinate based on the image size
            styles: { font: "Arial", fontSize: 10},
        });

        // Add the second image at the end of the PDF
        const secondImageBuffer = fs.readFileSync('footer_pdf.png');
        const imgWidth = docPdf.internal.pageSize.width;
        const imgHeight = 18; // Adjust the height as needed
        const imgY = docPdf.internal.pageSize.height - imgHeight;
        docPdf.addImage(secondImageBuffer, 'PNG', 0, imgY, imgWidth, imgHeight);

        docPdf.setFont("Arial");
        docPdf.setFontSize(9);
        docPdf.text("+7(777)533-58-73", 60, 284.5);
        docPdf.text("universalvs@mail.ru", 91, 284.5);
        docPdf.text("+7 /7172/ 53-30-27", 128, 284.5);
        docPdf.text("www.universalelectro.kz", 160, 284.5);

        docPdf.save(`temp/${request_id}.pdf`, { returnPromise: true }).then(function () {
            fs.readFile(`temp/${request_id}.pdf`, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading the file');
                } else {
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=file.pdf');
                    res.end(data);
                    fs.unlink(`temp/${request_id}.pdf`, () => {});
                }
            });
        });
    } catch (err) {
        console.log(err);
    }
};