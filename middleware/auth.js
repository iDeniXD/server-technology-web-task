const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const access_token =
    req.body.token || req.query.token || req.headers["x-access-token"];


    try {
        const decoded_access = jwt.verify(access_token, config.ACCESS_TOKEN_KEY);
        req.user = decoded_access;
        console.log("Access token is valid")
        return next();
    } catch (err) {
        console.log("Access token is invalid")
        return res.status(401).send("Invalid access token")

    }
}

module.exports = verifyToken;