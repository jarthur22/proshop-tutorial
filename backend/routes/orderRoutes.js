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

router.get('/:id', 
    (req, res, next) => protect(req, res, next), 
    (req, res) => {
        Order.findById(req.params.id).populate('user', 'name email').then(order => {
            if(order){
                res.json(order);
            }else{
                res.status(500).json({
                    message: 'Order not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: 'Could not connect to database.'
            });
        })
    }
);

router.put('/:id/pay', 
    (req, res, next) => protect(req, res, next), 
    (req, res) => {
        Order.findById(req.params.id).then(order => {
            if(order){
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResults = {
                    id: req.body.id,
                    status: req.body.status,
                    update_time: req.body.update_time,
                    email_address: req.body.payer.email_address
                }
                order.save().then(updatedOrder => {
                    res.json(updatedOrder);
                }).catch(err => {
                    res.status(500).json({
                        message: 'Could not save order.'
                    });
                })
            }else{
                res.status(500).json({
                    message: 'Order not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: 'Could not connect to database.'
            });
        });
    }
);

module.exports = router;