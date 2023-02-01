const passwordReset = require('../../controllers/auth/passwordReset.controller')
const requireLogin = require("../../middlewares/requireLogin");
const { body, param } = require('express-validator');
const checkBody = require('../../middlewares/checkBody');


module.exports = (app) => {

 // Receives a client requesting a password reset, and if exists sends a link to email
 app.post('/auth/passwordReset', 
 body('email').trim().notEmpty().isEmail().normalizeEmail(),
 checkBody, passwordReset.requestPasswordResetUrl)

// Validate Id and Token from Password reset
app.get('/auth/:id/:token', 
param('id').notEmpty().isMongoId(),
param('token').notEmpty(),
 checkBody, passwordReset.validateUrl)


//Update Password but firsts verify if user ID exists and if Token linked to user is still active
app.put('/auth/passwordReset/:id/:token', 
param('id').notEmpty().isMongoId(),
param('token').notEmpty(),
body('password').trim().notEmpty().isLength({min: 8}).custom(value => {
    if(value.search(/[a-z]/i) < 0) throw new Error('Your password must contain at least one letter')
    if(value.search(/[0-9]/) < 0) throw new Error('Your password must contain at least one digit')
    return true
}),
body('repeatedPassword').trim().notEmpty().custom((value, {req}) => {
    if(value !== req.body.password){
        throw new Error('Passwords does not match')
    }
    return true
}),
checkBody, passwordReset.updatePassword)

//Password change requested from Logged in User 
app.put('/auth/changePassword', 
body('oldPassword').trim().notEmpty().isLength({min: 8}).custom(value => {
    if(value.search(/[a-z]/i) < 0) throw new Error('Your password must contain at least one letter')
    if(value.search(/[0-9]/) < 0) throw new Error('Your password must contain at least one digit')
    return true
}),
body('newPassword').trim().notEmpty().isLength({min: 8}).custom((value, {req}) => {
    if(value.search(/[a-z]/i) < 0) throw new Error('Your password must contain at least one letter')
    if(value.search(/[0-9]/) < 0) throw new Error('Your password must contain at least one digit')
    if(value === req.body.oldPassword) throw new Error('Old password cannot be the same as new password')
    return true
}),
requireLogin, checkBody, passwordReset.changePassword)

}