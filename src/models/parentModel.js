const mongoose = require('mongoose')

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
    }
},
    {
        timestamps: true,
        versionKey: false
    }

)

module.exports = mongoose.model("parent", parentSchema)