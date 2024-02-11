const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require("dotenv").config({path: "config/.env"})


// -------- routes --------
const index = require('./routes/index');
const adminRoute = require('./routes/adminRoute')
const catalogRoute = require('./routes/catalogRoute')
const authRoute = require('./routes/authRoute')

//html ejs
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// -- used packages --
app.use('/views', express.static(path.join(__dirname + '/views')));
app.use('/public', express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// -- routes --
app.use('/', index);
app.use('/api/admin', adminRoute)
app.use('/api/catalog', catalogRoute)
app.use('/api/auth', authRoute)

app.listen(process.env.PORT, ()=> {
    console.log(`app listening at port http://localhost:${process.env.PORT}`);
})
