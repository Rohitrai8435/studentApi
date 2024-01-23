const express=require('express');
const { aboutpage } = require('../controllers/aboutController');
const router=express.Router();
router.get('/about',aboutpage)
module.exports=router;