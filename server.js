const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const index = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/views', express.static(path.join(__dirname + '/views')));
app.use('/public', express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);

app.listen(port, ()=> {
    console.log(`app listening at port http://localhost:${port}`);
})