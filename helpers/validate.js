const Models = require('../model')
const Validator = require('validatorjs')
const bcrypt = require('bcryptjs')

const {s3} = require('../config/aws')
const { AWS_BUCKET_NAME } = process.env;

const validator = async (body, rules, customMessage, callback) => {
    const validation = new Validator(body, rules, customMessage);
    validation.passes(() => callback(true));
    validation.fails(() => callback(false, validation.errors))
}

function find_existing(value, attribute, passes, onFind) {
    if (!attribute) throw new Error("Requirements error");

    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`)

    const {0: table, 1: column} = attArr;

    Models[table].findOne({ [column]: value})
    .then((res) => {
        if (res) {
            passes(onFind, `Such ${column} is taken`)
        } else {
            passes(!onFind, `Such ${column} does not exist`)
        }
    })
}

Validator.registerAsync('notTaken', (value, attribute, req, passes) => {
    find_existing(value, attribute, passes, onFind=false)
})

Validator.registerAsync('exists', (value, attribute, req, passes) => {
    find_existing(value, attribute, passes, onFind=true)
})

Validator.registerAsync('existsId', (value, attribute, req, passes) => {
    if (!attribute) throw new Error("Requirements error");

    const table = attribute;

    Models[table].findById(value)
    .then((res) => {
        if (res) {
            passes(true)
        } else {
            passes(false, `Such ${table} does not exist`)
        }
    })
})

Validator.registerAsync('RightPass', (password, email, param, passes) => {
    if (!email) passes(false, "The email is not provided");

    Models["User"].findOne({ email })
    .then(async (res) => {
        try {
            if (res) {
                const saved_pwd = res.password 
                if ((await bcrypt.compare(password, saved_pwd))) {
                    passes(true) 
                } else {
                    passes(false, "Wrong password")
                }  
            } else {
                passes(false, "Such user does not exist")
            }             
        } catch { passes(false, "Password is required") }
    })
})

Validator.registerAsync('file_exists_s3', (file, attribute, param, passes) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: file
    }
    s3.headObject(params, function (err, data) {
        if (err) {
            passes(false, 'Such file does not exist')
        } else {
            passes(true); 
        }
    })
})

module.exports = validator;