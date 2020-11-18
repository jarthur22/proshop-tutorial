const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            User.findById(decoded.id).select('-password').then(user => {
                req.user = user;
                next();
            })
        }catch(err){
            res.status(401).json({
                message: 'Not authorized, token failed'
            })
        }
    }
    if(!token){
        res.status(401).json({
            message: 'Not authorized, no token'
        });
        return;
    }
}

module.exports = {generateToken, protect};