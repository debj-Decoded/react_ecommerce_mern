const express=require('express');
const { createProduct, fetchAllProduct, fetchProductById, editProduct, deleteProduct, getallTotalProducts } = require('../controller/Product');

const router=express.Router();

router.post('/',createProduct)
      .get('/',fetchAllProduct)
      .get('/',getallTotalProducts)
      .get('/:id',fetchProductById)
      .patch('/:id',editProduct)
      .delete('/:id',deleteProduct)

exports.router=router;