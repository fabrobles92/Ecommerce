const mongoose = require('mongoose')
const {Schema} = mongoose

mongoose.model('products', new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    category: [String],
    image: {type: String},
    rating: JSON
}))

