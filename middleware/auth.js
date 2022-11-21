const User = require("../model/user");
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const access_token =
    req.body.access_token || req.query.token || req.headers["x-access-token"]; // TODO: get rid of ||

    try {
        const decoded_access = jwt.verify(access_token, config.ACCESS_TOKEN_KEY);
        req.user = decoded_access;
        return next();
    } catch (err) {
        return res.status(401).send("Invalid access token")
    }
}

const verifyApproved = async (req, res, next) => {
    const { approved_by } = await User.findById(req.user._id)

    const approving_user = await User.findById( approved_by )
    if (approving_user) {
        return next();
    }

    return res.status(401).send("You have not been approved yet!")
}

module.exports = {verifyToken, verifyApproved};