const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieSession = require('cookie-session')
const keys = require('./config/keys')
require('./models/user')
require('./models/token')
require('./models/products')
require('./models/categories')
require('./models/cart')
require('./services/passport')


mongoose.connect(keys.mongoURI)

//Middlewares
app.use(cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [keys.cookieKey]
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())




//Routes
require('./routes/auth/auth')(app)
require('./routes/auth/passwordReset')(app)
require('./routes/products/products')(app)
require('./routes/cart/cart')(app)
app.get('*', (req, res) => {
    res.status(404).send('This route is not defined')
})



if(process.env.NODE_ENV === 'production'){
    //Express will serve up production assets 
    //like our main.js or main.css
    app.use(express.static('client/build'));
    //Express will serve up the index.html file
    //if it doesnt recognize the route
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000

app.listen(PORT);