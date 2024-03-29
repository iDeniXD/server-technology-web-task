const validator = require('../helpers/validate');
const multer = require('multer')


const register = async (req, res, next) => {
    const validationRule = {
        "email": "required|string|email|max:250|notTaken:User,email",
        "first_name": "required|min:3|max:100|string",
        "last_name": "required|min:3|max:150|string",
        "password": "required|string|min:8|max:50|confirmed",
    };

    await validator(req.body, validationRule, {}, (status, err) => {
        if (!status) {
            return res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => {
        console.log(err)
        return res.status(400).send({message: 'Something went wrong'});
    })
}

const login = async (req, res, next) => {
    const { email } = req.body;

    const validationRule = {
        /* 
        DO NOT TAKE DOWN 'required' IN EMAIL

        If the email is not required the 'exist' registered function will be executed
        with possible undefined value resulting in mongoose returning incorrect record!

        Note:
        Model.findOne({email: undefined}) will return the result of the last successful reqest.
        */
        "email": "required|string|email|exists:User,email",
        "password": `required|string|min:8|max:50|RightPass:${email}`
    };
    await validator(req.body, validationRule, {}, (status, err) => {
        if (!status) {
            return res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => {
        console.log(err);
        return res.status(400).send({message: 'Something went wrong'})
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

const update_question = async (req, res, next) => {
    const validationRule = {
        "topic": "string|min:3|max:50",
        "content": "string|min:3|max:2000",
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

const comment_validator = async (req, res, next) => {
    const validationRule = {
        "content": "required|string|min:1|max:500",
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

const release_validator = async (req, res, next) => {
    const rule = {
        'version': 'required|string|min:1|max:10',
        'description': 'string|max:200',
        'changelog': 'required|string|min:1|max:10000',
        'images': 'array|max:15',
        'documentation': 'string|required|existsId:Documentation',
        'file': 'required|file_exists_s3'
    }
    await validator(req.body, rule, {}, (status, err) => {
        if (!status) {
            res.status(412).send({
                errors: err.errors
            });
        } else {
            next()
        }
    }).catch(err => {
        console.log(err);
        res.status(412).send()
    })
}

const documentation_validator = async (req, res, next) => {
    const rule = {
        'version': 'required|string|min:1|max:10',
        'text': 'required|string|min:200|max:50000',
        'images': 'array|max:30',
    }
    await validator(req.body, rule, {}, (status, err) => {
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

const role = async (req, res, next) => {
    const rule = {
        'role': 'required|in:admin,head,employee',
    }
    await validator(req.body, rule, {}, (status, err) => {
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

const uploadImageError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).send({ message: error.message });
    } else if (error) {
        return res.status(500).send({ message: error.message });
    }
    next();
}

module.exports = { 
    register, login, 
    create_question, 
    update_question, 
    comment_validator, 
    release_validator, 
    documentation_validator, 
    uploadImageError,
    role
};