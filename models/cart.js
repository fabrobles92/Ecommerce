const mongoose  = require('mongoose')
const {Schema} = mongoose

mongoose.model('cart', new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'users'},
    products: [
            {
                productId: {type: Schema.Types.ObjectId, ref: 'products'},
                quantity: Number
            }
    ],
    total: Number
}))