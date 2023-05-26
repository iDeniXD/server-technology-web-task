const express = require('express')
const withAuthRouter = express.Router()

const questionRouter = require('./questionRouter')
const [commentRouterPostGet, commentRouterPutDelete] = require('./commentRouter')

const releaseRouter = require('./releaseRouter')
const imageRouter = require('./imageRouter')
const fileRouter = require('./fileRouter')

const documentationRouter = require('./documentationRouter')

const {userWithAuthRouter} = require('./userRouter')
const {safeUserFields} = require('../controllers/userController')


const {verifyToken, verifyAccepted, verifyAdmin} = require("../middleware/auth");

withAuthRouter.use(verifyToken)

// verifies token only
withAuthRouter.get("/verify", (req, res) => {
        res.status(200).send(safeUserFields(req.user))
})


withAuthRouter.use(verifyAccepted);

withAuthRouter.use("/questions", questionRouter)

withAuthRouter.use("/questions/:questionID/comments", commentRouterPostGet)
withAuthRouter.use("/comments/:id", commentRouterPutDelete)

withAuthRouter.use("/releases", releaseRouter)
withAuthRouter.use("/images", verifyAdmin, imageRouter)
withAuthRouter.use("/files", fileRouter)

withAuthRouter.use("/documentation", documentationRouter)

withAuthRouter.use('/users', userWithAuthRouter)

module.exports = withAuthRouter