const mongoose = require('mongoose')
const {Schema} = mongoose

mongoose.model('users', new Schema({
    googleId: {type: String, default: ''},
    fullName: String,
    email: String,
    password: {type: String, default: ''},
}))