const express = require('express')
const withAuthRouter = express.Router()

const questionRouter = require('./questionRouter')

const auth = require("../middleware/auth");

withAuthRouter.use("/questions", auth, questionRouter)

withAuthRouter.get("/comments", auth, (req, res) => {
        res.status(200).send("here are your comments")
})

withAuthRouter.get("/versions", auth, (req, res) => {
        res.status(200).send("here are your versions")
})

withAuthRouter.get("/docs", auth, (req, res) => {
        res.status(200).send("here are your versions")
})

withAuthRouter.get("/verify", auth, (req, res) => {
        console.log("Verified")
        res.status(200).send()
})

module.exports = withAuthRouter