const mongoose = require('mongoose')
const {Schema} = mongoose

mongoose.model('token', new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: "users"},
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires: "1m"}
}))