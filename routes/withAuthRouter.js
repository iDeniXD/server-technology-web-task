const express = require('express')
const withAuthRouter = express.Router()

const questionRouter = require('./questionRouter')

const {verifyToken, verifyApproved} = require("../middleware/auth");

withAuthRouter.use(verifyToken)

withAuthRouter.use("/questions", verifyApproved, questionRouter)

withAuthRouter.get("/comments", verifyApproved, (req, res) => {
        res.status(200).send("here are your comments")
})

withAuthRouter.get("/versions", verifyApproved, (req, res) => {
        res.status(200).send("here are your versions")
})

withAuthRouter.get("/docs", verifyApproved, (req, res) => {
        res.status(200).send("here are your versions")
})

withAuthRouter.get("/verify", (req, res) => {
        res.status(200).send()
})

module.exports = withAuthRouter