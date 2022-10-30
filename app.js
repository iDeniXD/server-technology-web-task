require("dotenv").config();
require("./config/database").connect();
const express = require("express");


const app = express();

app.use(express.json());

const userRouter = require('./routes/userRouter')
app.use('/users', userRouter)

const roleRouter = require('./routes/roleRouter')
app.use('/roles',roleRouter)

const welcomeRouter = require('./routes/welcomeRouter')
app.use('/welcome',welcomeRouter)

module.exports = app;