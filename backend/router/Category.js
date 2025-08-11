const express=require('express');
const { createCategory, fetchCategory } = require('../controller/Category');


const router=express.Router();

router.post('/',createCategory)
      .get('/',fetchCategory)

exports.router=router;