const User = require("../model/user");
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = async (req, res, next) => {
    const access_token = req.headers["x-access-token"];

    try {
        const decoded_access = jwt.verify(access_token, config.ACCESS_TOKEN_KEY);
        const { _id } = decoded_access;
        const user = await User.findById( _id )
        if (user) {
            req.user = user;
            return next();
        } else {
            return res.status(404).send({message: "Such user does not exist"})
        }
    } catch (err) {
        return res.status(401).send({message: "Invalid access token"})
    }
}

const verifyAccepted = async (req, res, next) => {
    const { status } = req.user;
    if (status === 'accepted') {
        return next();
    }

    if (status === 'pending') {
        return res.status(403).send({message: 'You have not been approved yet'})
    }

    if (status === 'rejected') {
        return res.status(403).send({message: 'You have been rejected'})
    }

    return res.status(400).send({message: 'Something went wrong'})
}

const roles = {
    'head': ['head', 'admin'],
    'admin': ['admin']
}
const verifyHead = async (req, res, next) => {
    if (roles['head'].includes(req.user.role)) return next();
    return res.status(403).send({message: 'You do not have the required role for this action'});
}

const verifyAdmin = async (req, res, next) => {
    if (roles['admin'].includes(req.user.role)) return next();
    return res.status(403).send({message: 'You do not have the required role for this action'});
}

module.exports = {verifyToken, verifyAccepted, verifyHead, verifyAdmin};