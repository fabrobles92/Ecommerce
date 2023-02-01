const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const auth = {
    registerUser : async (req, res) => {
        try {
            const {firstName, lastName, email, password, repeatedPassword} = req.body
            // if (![firstName, lastName, email, password, repeatedPassword].every( key => key)){
            //     return res.status(400).json("Bad Request");
            // }
            const foundUser = await User.findOne({email})
            if(foundUser){
                return res.status(409).send("User already exists")
            }
            const user = await new User({
                fullName: `${firstName.trim()} ${lastName.trim()}`,
                email,
                password: await bcrypt.hash(password, 10)
            }).save()
            res.json('OK')
            
        } catch (error) {
            res.status(422).send(error.toString());
        }
    },

    getLoggedUser: (req, res) => {
        res.send(req.user)
    },

    logOutUser: (req, res) => {
        req.logout();
        res.redirect('/');
    },

}

module.exports = auth