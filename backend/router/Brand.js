const express=require('express');
const { fetchBrand, createBrand } = require('../controller/Brand');
 
const router=express.Router();

router.post('/',createBrand)
    .get('/',fetchBrand)

exports.router=router;