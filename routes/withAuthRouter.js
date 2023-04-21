const express = require('express')
const withAuthRouter = express.Router()

const questionRouter = require('./questionRouter')
const [commentRouterPostGet, commentRouterPutDelete] = require('./commentRouter')

const {verifyToken, verifyApproved} = require("../middleware/auth");

withAuthRouter.use(verifyToken)

withAuthRouter.use("/questions", verifyApproved, questionRouter)

withAuthRouter.use("/questions/:questionID/comments", verifyApproved, commentRouterPostGet)
withAuthRouter.use("/comments/:id", verifyApproved, commentRouterPutDelete)

withAuthRouter.get("/versions", verifyApproved, (req, res) => {
        res.status(200).send("here are your versions")
})

withAuthRouter.get("/docs", verifyApproved, (req, res) => {
        res.status(200).send("here are your versions")
})

// verifies token only
withAuthRouter.get("/verify", (req, res) => {
        res.status(200).json(req.user)
})

module.exports = withAuthRouter