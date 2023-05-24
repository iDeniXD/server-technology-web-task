require("dotenv").config();
require("./config/database").connect();
const cookieparser = require('cookie-parser');
const express = require("express");
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser())
app.use(cors({origin:true,credentials: true}));

// app.use(function (req, res) {
//     res.setHeader('Content-Type', 'application/json');
// })

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const {userRouter} = require('./routes/userRouter')
app.use('/users', userRouter)

const withAuthRouter = require('./routes/withAuthRouter')
app.use('/', withAuthRouter)

module.exports = app;