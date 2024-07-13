const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    savedPasswords: [
        {
            title: String,
            password: String
        }
    ]
})

module.exports = mongoose.model('User', userSchema)