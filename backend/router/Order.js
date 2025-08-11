const express=require('express');
const { createOrder, fetchOrderByUser, editOrder, deleteOrder, fetchAllOrder } = require('../controller/Order');


const router=express.Router();

router.post('/',createOrder)
      .get('/user/:userId',fetchOrderByUser)
      .get('/',fetchAllOrder)
      .patch('/:id',editOrder)
      .delete('/:id',deleteOrder)

exports.router=router;