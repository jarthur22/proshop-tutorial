const express = require('express');
const Product = require('../models/productModel');

const router = express.Router();

//@desc Fetch all products
//@route GET /api/products
//@access Public
router.get('/', (req, res) => {
    Product.find({}).then(results => {
        res.json(results);
    }).catch(err => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode);
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    });
});

//@desc Fetch a single product
//@route GET /api/products/:id
//@access Public
router.get('/:id', (req, res) => {
    Product.findById(req.params.id).then(result => {
        if(result){
            res.json(result);
        }else{
            res.status(400).json({message: 'Product not found.'});
        }
    }).catch(err => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode);
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    });
});

module.exports = router;