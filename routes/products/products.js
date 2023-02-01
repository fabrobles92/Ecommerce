const products = require('../../controllers/products/products.controller')
const { body, param, query } = require('express-validator');
const checkBody = require('../../middlewares/checkBody')
const moongose = require('mongoose');
const Categories = moongose.model('categories')

module.exports = (app) => {
    app.get('/api/products', 
    query('limit').optional().trim().isInt({min: 1, max: 100}),
    query('sort').optional().trim().isString().custom(value => {
        if(value === 'asc' || value === 'desc'){
            return true
        }
        throw new Error('Invalid Sort Query')
    }),
    checkBody, products.getProducts)

    app.get('/api/products/categories', products.getCategories)

    app.get('/api/products/categories/:category',
    param('category').trim().notEmpty().custom(async value => {
        const categories = await Categories.find()
        if(!(categories[0].categories.includes(value))) throw new Error('Invalid Category')
        return true
    }),
    checkBody, products.getProductsByCategory)

    app.get('/api/products/:id', 
    param('id').trim().notEmpty().isMongoId().withMessage('Invalid ID'),
    checkBody, products.getSingleProduct)

    app.post('/api/products', 
    body('title').trim().notEmpty(),
    body('price').trim().isDecimal( { min: 1} ).notEmpty(),
    body('description').trim().notEmpty(),
    body('category').isArray().notEmpty(),
    body('image').trim().notEmpty(),
    body('rating.rate').isInt().notEmpty(),
    body('rating.count').isInt().notEmpty(),
    checkBody, products.insertProduct)

    app.patch('/api/products/:productId', 
    param('productId').trim().isMongoId().withMessage('Invalid ID'),
    body('title').optional().trim(),
    body('price').optional().trim().isDecimal( { min: 1} ),
    body('description').optional().trim(),
    body('category').optional().isArray(),
    body('image').optional().optional().trim(),
    body('rating.rate').optional().isInt(),
    body('rating.count').optional().isInt(),
    checkBody, products.modifyProduct)
}