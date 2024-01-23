const nodemailer=require('nodemailer');
const ErrorHandler = require('./ErrorHandler');
exports.sendMail=(req,res,next,url)=>{
    const transport=nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:465,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD,
        }
    });
    const mailOptions={
        from:"Rohit Private Limited",
        to:req.body.email,
        subject:"Password Reset Link",
        html:`<h1> Click Link to reset password </h1>
               <a href="${url}">password resent link!</a>`
        
    };
  transport.sendMail(mailOptions,(err,info)=>{
    if(err){
        return next(new ErrorHandler(err,500));
        console.log(info);
    }
    return res.status(200).json({
        message:"Email sent successfully"
    })
  })  
};
