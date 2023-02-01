const mongoose = require('mongoose')
const crypto = require("crypto");
const bcrypt = require('bcrypt')
const sendEmail = require('../../services/sendEmail')
const keys = require('../../config/keys')

const User = mongoose.model('users')
const Token = mongoose.model('token')

const passwordreset =  {
    requestPasswordResetUrl: async (req, res) => {
        try {
            const {email} = req.body
            const foundUser = await User.findOne({email})
            if(!foundUser) throw new Error('User does not exist')
            let token = await Token.findOne({userId: foundUser.id})
            if(!token){
                //Create new token
                const resetToken  = crypto.randomBytes(32).toString('hex')
                // const hashedToken = await bcrypt.hash(resetToken, 10)
                token = await new Token({
                    userId: foundUser.id,
                    token: resetToken,
                    createdAt: Date.now()
            }).save()
            }
            const link = `${keys.domain}/password-reset/${foundUser.id}/${token.token}`
            //Send Email with link to reset token
            await sendEmail(foundUser.email, 'Password Reset Requested', link)
            res.json("Ok")
        } catch (error) {
            console.log(error)
            res.status(422).json(error.toString());
        }        
    },

    validateUrl: async (req, res) => {
        try {
            const {id, token} = req.params

            /*Check if ID comes in the expected way for Mongo (ID must be a string of 12 
                bytes or a string of 24 hex characters or an integer)*/
            // if(!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json(false)
    
            const foundUser = await User.findById(id)
    
            if(!foundUser) return res.status(200).json(false)
            
            const foundToken = await Token.findOne({userId: foundUser.id, token})
    
            if(!foundToken) return res.status(200).json(false)
    
            res.status(200).json(true)
        } catch (error) {
            console.log('error: ', error)
            res.status(422).json(error.toString());
        }        
    },

    updatePassword: async (req, res) => {
        try {
            let {password} = req.body

            const {id, token} = req.params
            
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("Invalid Link or Expired"); 
    
            const foundUser = await User.findById(id)
            if(!foundUser) return res.status(400).json("Invalid Link or Expired"); 
    
            const foundToken = await  Token.findOne({userId: foundUser.id, token})
            if(!foundToken) return res.status(400).json("Invalid Link or Expired"); 
            
            const samePassword = await bcrypt.compare(password, foundUser.password)
            if(samePassword) return res.status(400).json("Password cant be the same as last password"); 
    
            password = await bcrypt.hash(password, 10)
            await User.findByIdAndUpdate(id, {password})
            await foundToken.delete()
    
            res.status(200).json('ok')
        } catch (error) {
            res.status(422).json(error.toString());
        }        
    },

    changePassword: async (req, res) => {
        try {
            const {oldPassword, newPassword} = req.body
    
            const samePassword = await bcrypt.compare(oldPassword, req.user.password)
    
            if(!samePassword) return res.status(400).json("Old Password does not exist");
            
            const newHashedPassword = await bcrypt.hash(newPassword, 10)
    
            await User.findByIdAndUpdate(req.user.id, {password: newHashedPassword})
    
            res.status(200).json('ok')
        } catch (error) {
            res.status(422).json(error.toString());
        }
    }

}

module.exports = passwordreset
