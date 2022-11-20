const validator = require('../helpers/validate');

const register = async (req, res, next) => {
    const validationRule = {
        "email": "required|string|email|notTaken:User,email",
        "first_name": "required|min:3|max:100|string",
        "last_name": "required|min:3|max:150|string",
        "password": "required|string|min:8|max:50|confirmed",
    };

    await validator(req.body, validationRule, {}, (status, err) => {
        if (!status) {
            res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => console.log(err))
}

const login = async (req, res, next) => {
    const email = req.body.email;

    const validationRule = {
        "email": "required|string|exist:User,email", // no 'email' because admin does not have @mail.com
        "password": `required|string|min:8|max:50|RightPass:${email}`,
    };
    await validator(req.body, validationRule, {}, (status, err) => {
        if (!status) {
            res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => console.log(err))
}

module.exports = { register, login };