const express=require('express'); 

const { addToCart, fetchCart, deleteCart, editCart } = require('../controller/Cart');
const router=express.Router();

router.post('/',addToCart)
        .get('/',fetchCart)
        .delete('/:id',deleteCart)
        .patch('/:id',editCart)

exports.router=router;