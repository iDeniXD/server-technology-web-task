const Models = require('../model')
const Validator = require('validatorjs')
const bcrypt = require('bcryptjs')

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

Validator.registerAsync('exist', (value, attribute, req, passes) => {
    find_existing(value, attribute, passes, onFind=true)
})

Validator.registerAsync('RightPass', (password, email, req, passes) => {
    if (!email) throw new Error("Email is not provided");

    Models["User"].findOne({ email })
    .then(async (res) => {
        try {
            const saved_pwd = res.password 
            if ((await bcrypt.compare(password, saved_pwd))) {
                passes(true) 
            } else {
                passes(false, "Wrong password")
            }   
        } catch { passes(false, "Password is required") }
    })
})

module.exports = validator;