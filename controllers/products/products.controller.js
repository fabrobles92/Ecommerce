const moongose = require('mongoose')
const Product = moongose.model('products')
const Categories = moongose.model('categories')
const _ = require('lodash')


const products = {
    getProducts: async (req, res) => {
        //Handle if they send limit in the request ?limit=#
        const {limit, sort} = req.query
        if (limit || sort){ 
            // if(Number.isNaN(Number(req.query.limit))) return res.sendStatus(400)
            // Any of thw following 2 is ok
            // const products = await Product.find({},null, {limit: req.query.limit})
            const products = await Product.find().limit(limit).sort({price: sort === 'desc' ? -1 : 1 })
            return res.send(products)
        }
        const products = await Product.find({})
        res.send(products)
    },

    getSingleProduct: async (req, res) => {
        try {
            const {id} = req.params
        
            const product = await Product.findById(id)
            
            if(!product) return res.sendStatus(404)

            res.send(product)

        } catch (error) {
            if (error.name == 'CastError'){
                return res.sendStatus(404)
            }
            res.status(500).send(error)
        }
    },

    getCategories: async (req, res) => {
        const categories = await Categories.find()
        console.log(categories)
        res.send(categories[0].categories)
        
    },

    getProductsByCategory: async (req, res) => {
        const category = req.params.category
        const productByCategory = await Product.find({category})
        if(_.isEmpty(productByCategory)) return res.sendStatus(404)

        res.send(productByCategory)
    },

    insertProduct: async (req, res) => {
        try {
            const {title, price, description, category, image, rating} = req.body
            await Product({
                title,
                price,
                description,
                category,
                image,
                rating
            }).save()
            res.sendStatus(201)
        } catch (error) {
            res.status(500).send(error.toString());
        }
        
    },

    modifyProduct: async (req, res) => {
        try {
            const {productId} = req.params
            
            const product = await Product.findByIdAndUpdate({_id: productId}, req.body, {new: true})

            if(!product) return res.status(404).send('Product not found')

            res.status(200).send(product)

        } catch (error) {
            res.status(500).send(error.toString());
        }
    }


}

module.exports = products