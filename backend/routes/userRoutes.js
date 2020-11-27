const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const {generateToken, protect} = require('../utils/utils');

const router = express.Router();

router.post('/', (req, res) => {
    const {name, email, password} = req.body;

    User.findOne({email}).then(userExists => {
        if(userExists){
            res.status(400).json({
                message: "User already exists."
            });
        }else{
            User.create({
                name, email, password: hashPassword(password)
            }).then(user => {
                if(user){
                    res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        token: generateToken(user._id)
                    });
                }else{
                    res.status(400).json({
                        message: "Invalid user data"
                    });
                }
            }).catch(err => {
                res.status(400).json({
                    message: "Invalid user data"
                });
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: "Internal server error"
        });
    });
});

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public
router.post("/login", (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}).then((user) => {
        if(user){
            matchPassword(password, user.password).then(result => {
                if(result){
                    res.json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        token: generateToken(user._id)
                    });
                }else{
                    res.status(401).json({
                        message: 'Invalid password.'
                    });
                }
            }).catch(err => console.log(err));
        }else{
            res.status(401).json({
                message: 'Invalid email.'
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Could not connect to database.'
        });
    });
});

//get user profile
router.get('/profile',
    (req, res, next) => protect(req, res, next), 
    (req, res) => {
        User.findById(req.user._id).then(user => {
            if(user){
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                })
            }else{
                res.status(404).json({
                    message: 'User not found'
                })
            }
        }).catch(err => {
            res.status(500).json({
                message: 'Could not connect to database.'
            });
        });
    }
);

//update user profile
router.put('/profile', 
    (req, res, next) => protect(req, res, next), 
    (req, res) => {
        User.findById(req.user._id).then(user => {
            if(user){
                user.name = req.body.name || user.name;
                user.email = req.body.email || user.email;
                if(req.body.password){
                    user.password = hashPassword(req.body.password);
                }

                user.save().then(updatedUser => {
                    res.json({
                        _id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        isAdmin: updatedUser.isAdmin,
                    });
                }).catch(err => {
                    res.status(500).json({
                        message: 'Could not connect to database.'
                    });
                });
            }else{
                res.status(404).json({
                    message: 'User not found'
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: 'Could not connect to database.'
            });
        });
    }
);

const matchPassword = async (enteredPassword, objPassword) => {
    try{
        return await bcrypt.compare(enteredPassword, objPassword);
    }catch(err){
        return false;
    }
}

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    return hashed;
}

module.exports = router;