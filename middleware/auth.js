const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const refresh_token = req.cookies.jwt;
    try{
        if (!refresh_token) { 
            throw new Error() 
        }
        const decoded_refresh = jwt.verify(refresh_token, config.REFRESH_TOKEN_KEY);
        req.user = decoded_refresh;
    } catch (err) {
        return res.status(401).send("A refresh token is required for authentication");
    }

    const access_token =
    req.body.token || req.query.token || req.headers["x-access-token"];


    
    try {
        if (!(access_token)) {
            throw new Error() 
        }

        const decoded_access = jwt.verify(access_token, config.ACCESS_TOKEN_KEY);
        req.user = decoded_access;
    } catch (err) {
        const new_access_token = jwt.sign(
            { user_id: req.user.user_id, email: req.user.email },
            config.ACCESS_TOKEN_KEY,
            {
                expiresIn: "15m",
            }
        );

        // Create refresh token
        const new_refresh_token = jwt.sign(
            { user_id: req.user.user_id, email: req.user.email },
            config.REFRESH_TOKEN_KEY,
            { expiresIn: '3d' });

        // Assigning refresh token in http-only cookie 
        res.cookie('jwt', new_refresh_token, { httpOnly: true, 
            sameSite: 'None', secure: true, 
            maxAge: 3 * 24 * 60 * 60 * 1000 });

        // save user token
        req.user.access_token = new_access_token;
    }
    return next();
};

module.exports = verifyToken;