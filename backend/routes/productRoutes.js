const express = require('express');
const Product = require('../models/productModel');

const router = express.Router();

//@desc Fetch all products
//@route GET /api/products
//@access Public
router.get('/', (req, res) => {
    Product.find({}).then(results => {
        res.json(results);
    }).catch(err => console.log(err));
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
    }).catch(err => console.log(err));
});

module.exports = router;