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
        // res.status(200).json({
        //         refresh_token: req.cookies.jwt,
        //         access_token: req.body.token || req.query.token || req.headers["x-access-token"]
        // })
        console.log("Verified")
        res.status(200).send()
})

module.exports = withAuthRouter