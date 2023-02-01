const passport = require("passport");
const auth = require('../../controllers/auth/auth.controller');
const { body } = require('express-validator');
const checkBody = require('../../middlewares/checkBody');

module.exports = (app) => {

    //Google Auth using Passport
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))

    //Google Auth Callback using Passport
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res)=> {
        res.redirect('/profile')
    })

    //Email Auth using Passport
    app.post('/auth/email', passport.authenticate('local', {failureMessage: true }), (req, res) => {
        res.json(req.user)
    })

    //Register a new User
    app.post('/auth/register', 
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail().normalizeEmail(),
    body('password').trim().notEmpty().isLength({min: 8}).custom((value) => {
        if(value.search(/[a-z]/i) < 0) throw new Error('Your password must contain at least one letter')
        if(value.search(/[0-9]/) < 0) throw new Error('Your password must contain at least one digit')

        return true
    }),
    body('repeatedPassword').trim().notEmpty().custom((value, {req}) => {
        if(req.body.password !== value){
            throw new Error('Passwords does not match') 
        }
        return true
    }),
    checkBody, auth.registerUser)


    app.get('/api/me', auth.getLoggedUser)

    app.get('/api/logout', auth.logOutUser)

    app.get('/api/test', (req, res)=> {
        
        res.send({message:''})
    })

}