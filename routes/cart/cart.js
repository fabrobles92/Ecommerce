const cart = require('../../controllers/cart/cart.controller')
const { body, param } = require('express-validator');
const checkBody = require('../../middlewares/checkBody')

module.exports = (app) => {
    app.get('/api/cart/:userId', 
    param('userId').isMongoId().notEmpty(),
    checkBody, cart.getSingleCart)

    app.post('/api/cart/:userId', 
    param('userId').isMongoId().notEmpty(),
    body('productId').isMongoId().notEmpty(),
    body('quantity').trim().isInt({min: 1}).notEmpty().toInt(),
    checkBody, cart.addCartProduct)

    app.delete('/api/cart/:userId', 
    param('userId').isMongoId().notEmpty(),
    body('productId').isMongoId().notEmpty(),
    checkBody, cart.deleteCartProduct)
}