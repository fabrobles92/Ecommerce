const passport = require("passport")

module.exports = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        //Este metodo recibe lo que pusimos en el metodo de done en la local strategy
        if (!user) {
            return res.status(401).json(user); //info contains the error message
        }
        next();
    })(req, res, next) // Esttos ultimos (req, res, next) tienen que estar para poder usar next o res 
                        //dentro del callback de passport.authenticate
}