const express = require('express')
const userRouter = express.Router()
const userWithAuthRouter = express.Router()

const userController = require('../controllers/userController');

const validation = require('../middleware/validation');
const {verifyHead} = require('../middleware/auth')

userRouter.post("/register", validation.register, userController.register);
userRouter.post("/login", validation.login, userController.login);
userRouter.post("/revoke", userController.revoke);
userRouter.get("/refresh", userController.refresh)

userWithAuthRouter.use(verifyHead);
userWithAuthRouter.post('/accept/:id', userController.accept);
userWithAuthRouter.post('/reject/:id', userController.reject);
userWithAuthRouter.put('/promote/:id', userController.promote);
userWithAuthRouter.get('/accepted-list', userController.listOfAccepted);

module.exports = {userRouter, userWithAuthRouter}