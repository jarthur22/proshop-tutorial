const express = require('express');
const Order = require('../models/orderModel');
const {protect} = require('../utils/utils');

const router = express.Router();

router.post('/', 
    (req, res, next) => protect(req, res, next), 
    (req, res) => {
        const {
            orderItems, 
            shippingAddress, 
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if(orderItems && orderItems.length === 0){
            res.status(400).json({message: 'No order items'});
            return;
        }else{
            const order = new Order({
                orderItems, 
                user: req.user._id,
                shippingAddress, 
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            }).save().then(createdOrder => {
                res.status(201).json(createdOrder);
            }).catch(err => {
                res.status(500).json({
                    message: 'Could not connect to database.'
                });
            })
        }
    }
);

module.exports = router;