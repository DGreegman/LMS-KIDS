const mongoose = require('mongoose')
const crypto = require('crypto')

const parentSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true
    },
    password: {
        type: String

    },
    confirm_password: {
        type: String
    },
    password_reset_token: {
        type: String
    },
    password_reset_token_expires: Date,
},
    {
        timestamps: true,
        versionKey: false
    }

)

parentSchema.methods.createPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    const token = Math.floor(100000 + Math.random() * 900000)
    // do a simple hashing algorithm with crypto
    this.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex')

    // the token been sent to email
    this.email_token = token
    // the password reset token expires in 10 mins
    this.password_reset_token_expires = Date.now() + 10 * 60 * 1000

    console.log(resetToken, this.password_reset_token)
    // return the plain resetToken, cause the user gets the plain reset token while we save the hashToken in the database

    return resetToken
}

module.exports = mongoose.model("parent", parentSchema)