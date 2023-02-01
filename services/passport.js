const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const keys = require('../config/keys')


const User = mongoose.model('users')

passport.use(new googleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: 'true'
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({googleId: profile.id}) || await User.findOne({email: profile._json.email})
    if(user){
        return done(null, user)
    } 
    const newUser = await new User({googleId: profile.id, fullName: profile.displayName, email: profile._json.email}).save()
    done(null, newUser)
})
)

passport.use(new localStrategy({
    usernameField: 'username'
    
}, async (username, password, done) => {    
    try {
        const user = await User.findOne({email: username})
        if (user){
            const validPassword = await bcrypt.compare(password, user.password)
            if(validPassword){
                done(null, user)
            }
            else{
                done(null, false, { message: 'Incorrect username or password.' })
            }
        }else{
            done(null, false, { message: 'Incorrect username or password.' })
        }
    } catch (error) {
        done(error)   
    }    

} ))

passport.serializeUser((user, done) => {
    console.log('Serializo!!')
    done(null, user.id)
})

passport.deserializeUser(async (id, done)=> {
    const user = await User.findById(id)
    console.log('Deserializo!!')
    done(null, user)
})