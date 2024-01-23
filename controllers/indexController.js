const { catAsyncErrors } = require("../middlewares/catchAsyncErrors")
const studenModel=require('../models/studentModel');
const ErrorHandler = require("../utills/ErrorHandler");
const { sendMail } = require("../utills/nodemailer");

const { sendToken } = require("../utills/sendToken");
const imagekit=require("../utills/imageKit").initimagekit();
const path=require("path");

exports.homepage=catAsyncErrors(async(req,res,next)=>{
    res.json({message:"hello from controllers home page"})
})
exports.currentStudent=catAsyncErrors(async(req,res,next)=>{
    const student=await studenModel.findById(req.id).exec();
    res.json({student});
})

exports.studentsignup=catAsyncErrors(async(req,res,next)=>{
    const student=await new studenModel(req.body).save();
    sendToken(student,201,res);
    res.status(200).json(student);
})
exports.studentsignin=catAsyncErrors(async(req,res,next)=>{
    const student=await studenModel.findOne({email:req.body.email})
    .select("+password")
    .exec(); 
    if(!student){
        return next(new ErrorHandler("User Not Found with this Email Address",404))
       } 
   const isMatch=student.comparepassword(req.body.password);
    if(!isMatch){
       return next(new ErrorHandler("Wrong Credientials",500))
      }
     sendToken(student,200,res)
     res.status(200).json(student);
})
exports.studentsignout=catAsyncErrors(async(req,res,next)=>{
    res.clearCookie('token');
    res.json({message:"sucessfully signout"})
})
exports.forgetpassword= catAsyncErrors(async(req,res,next)=>{
    const student= await studenModel.findOne({email:req.body.email}).exec();
    if(!student){
        return next(
            new ErrorHandler("user Not found with this email address",404)
        )
    }
   const url=`${req.protocol}://${req.get('host')}/student/forgetpassword-link/${student._id}`
  sendMail(req,res,next,url);
  student.resetPassword="1";
  await student.save();
  res.send({student,url});
})
exports.resetpassword=catAsyncErrors(async(req,res,next)=>{
   const student=await studenModel.findById(req.params.id).exec();
    if(student.resetPassword=="1")
      {
        student.resetPassword="0";
        student.password=req.body.password;
      }
    else
    {
        return next(new ErrorHandler("Invalid Reset-Password link try Again"))
    }
   await student.save();
   res.status(200).json({message:"password has been succesfully changed"});
});
exports.updateStudent=catAsyncErrors(async(req,res,next)=>{
   const student=await studenModel.findByIdAndUpdate(
    req.params.id,
    req.body).exec();
   
   res.status(200).json({
    success:true,
    message:"Student has been succesfully updated",
});
});
exports.studentavatar=catAsyncErrors(async(req,res,next)=>{
    const student=await studenModel.findById(req.params.id).exec();
    const file=req.files.avatar;
    const modifiedfilename=`resumebuidler-${Date.now()}${path.extname(file.name)}`;
    const {fileId,url}=await imagekit.upload({
        file:file.data,
        fileName:modifiedfilename
    })
 if(student.avatar.fileId !==""){
    await imagekit.deleteFile(student.avatar.fileId)
 }

student.avatar={fileId,url};
   await student.save();
   res.status(200).json({
    success:true,
    message:"Profile Updated!",
   });
});
