const jwt =require("jsonwebtoken");
const ErrorHandler=require('../utills/ErrorHandler');
const { catAsyncErrors } = require("./catchAsyncErrors");


exports.isAuthenticated=catAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler('please login in to access the resouces',401))
    }
    const {id}=jwt.verify(token,process.env.JWT_SECRET);
    req.id=id;
    next();
})