const mongoose = require('mongoose')
const {Schema} = mongoose

mongoose.model('categories',new Schema({
    categories: [String]
}))