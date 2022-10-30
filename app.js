require("dotenv").config();
require("./config/database").connect();

const cookieparser = require('cookie-parser');
const express = require("express");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

const userRouter = require('./routes/userRouter')
app.use('/users', userRouter)

const roleRouter = require('./routes/roleRouter')
app.use('/roles',roleRouter)

const verifyRouter = require('./routes/verifyRouter')
app.use('/verify',verifyRouter)

module.exports = app;