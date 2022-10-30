const express = require('express')
const welcomeRouter = express.Router()

const auth = require("../middleware/auth");

welcomeRouter.get("/", auth, (req, res) => {
        res.status(200).send("Welcome 🙌 ");
});

module.exports = welcomeRouter