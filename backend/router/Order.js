const express=require('express');
const { createOrder, fetchOrderByUser, editOrder, deleteOrder, fetchAllOrder, fetchOrderById } = require('../controller/Order');


const router=express.Router();

router.post('/',createOrder)
      .get('/user/:userId',fetchOrderByUser)
      .get('/',fetchAllOrder)
      .get('/:id',fetchOrderById)
      .patch('/:id',editOrder)
      .delete('/:id',deleteOrder)

exports.router=router;