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
            console.log(err.errors)
            res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => console.log(err))
}

const login = async (req, res, next) => {
    const { email } = req.body;

    const validationRule = {
        /* 
        DO NOT TAKE DOWN 'required' IN EMAIL

        If the email is not required the 'exist' registered function will be executed
        with possible undefined value resulting in mongoose returning incorrect record!

        Note:
        Model.findOne({email: undefined}) will return the result of the latest successful reqest.
        */
        "email": "required|string|email|exist:User,email",
        "password": `required|string|min:8|max:50|RightPass:${email ? email : ""}`,
    };
    await validator(req.body, validationRule, {}, (status, err) => {
        if (!status) {
            res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => {
        res.status(412).send()
    })
}

const create_question = async (req, res, next) => {
    const validationRule = {
        "topic": "required|string|min:3|max:50",
        "content": "required|string|min:3|max:2000",
    };
    await validator(req.body, validationRule, {}, (status, err) => {
        if (!status) {
            res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => {
        res.status(412).send()
    })
}

module.exports = { register, login, create_question };