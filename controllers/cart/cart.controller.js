const moongose = require('mongoose')
const _ = require('lodash')
const { update, findIndex, times } = require('lodash')
const Cart = moongose.model('cart')
const Products = moongose.model('products')

module.exports = {
    getSingleCart: async (req, res) => {
        try {
            const {userId} = req.params
            const cart = await Cart.findOne({userId})

            if(!cart)  return res.status(404).send('Cart not found')
            if(_.isEmpty(cart.products)) return res.send(null)

            let total_price = 0

            for (const element of cart.products) {
                const product = await Products.findById(element.productId)
                if(product){
                    total_price += product.price * element.quantity
                }
            }
            
            cart.total = total_price
            cart.total = Math.round((cart.total + Number.EPSILON) * 100) / 100
            const updatedCart = await cart.save()

            res.send(updatedCart)
            
        } catch (error) {
            res.status(500).send(error.toString());
        }        
    },

    addCartProduct: async (req, res) => {
        try {
            const {userId} = req.params
            const {productId, quantity} = req.body

            const product = await Products.findById({_id: productId})

            if(!product) return res.status(404).send('Product not found')

            const cart = await Cart.findOne({userId})
            if(!cart){
                const newCart = await Cart({
                    userId,
                    products: {productId: product.id, quantity},
                    total: product.price * quantity
                }).save()

                return res.status(201).send(newCart)
            }
            const index = cart.products.findIndex( product => product.productId.toString() === productId)
            
            if(index !== -1){
                cart.products[index].quantity += quantity
            }else{
                
                cart.products.push({productId, quantity})
            }
            cart.total += product.price * quantity
            cart.total = Math.round((cart.total + Number.EPSILON) * 100) / 100
            const updatedCart = await cart.save()

            res.status(201).send(updatedCart)

            
        } catch (error) {
            res.status(500).send(error.toString());
        }
    },

    deleteCartProduct: async (req, res) => {
        try {
            const {userId} = req.params
            const {productId} = req.body

            const product = await Products.findById({_id: productId})

            if(!product) return res.status(404).send('Item not found')

            const cart = await Cart.findOne({userId})

            if(!cart) return res.status(404).send('Cart not found')

            const index = cart.products.findIndex(product => product.productId.toString() === productId)
            if(index !== -1){
                const deletedProduct = cart.products.splice(index, 1)[0]
                cart.total -= product.price*deletedProduct.quantity
                cart.total = Math.round((cart.total + Number.EPSILON) * 100) / 100
            }
            

            const updatedCart = await cart.save()

            res.status(201).send(updatedCart)

        } catch (error) {
            res.status(500).send(error.toString());
        }
    }


}