const express = require('express')
const verifyRouter = express.Router()

const auth = require("../middleware/auth");

verifyRouter.use((req, res, next) => {
        auth(req, res, next)
})

verifyRouter.get("/", (req, res) => {
        res.status(200).send("Welcome 🙌 ");
        // console.log(req.user.access_token)
});

module.exports = verifyRouter