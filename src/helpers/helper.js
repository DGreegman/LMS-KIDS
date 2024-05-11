const joi = require('joi')

const authSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
    confirm_password: joi.ref('password')
})

module.exports = authSchema