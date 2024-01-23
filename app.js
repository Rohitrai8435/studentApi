const express=require('express');
require('dotenv').config();
const port=process.env.PORT;
const app=express();


//DB connection
require('./models/database').connectionDatabase();


//logger
const logger=require("morgan");
app.use(logger("tiny"));

//body parser to activate req.body
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//session and cookie
const session=require('express-session');
const cookieparser=require("cookie-parser");
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:process.env.EXPRESS_SESSION_SECRET
}))
app.use(cookieparser());//cookie is activate karta hai
//express file-upload activate karta hai
const fileupload=require('express-fileupload');
app.use(fileupload());
//routes
app.use('/',require('./routes/indexRoutes'))
app.use('/',require('./routes/about'))

//error handling
const ErrorHandler = require('./utills/ErrorHandler');
const { generatedErrors } = require('./middlewares/Errors');
app.all('*',(req,res,next)=>{
    next(new ErrorHandler(`Requested URL Not Found ${req.url}`,404))

})
app.use(generatedErrors)

 app.listen(port,console.log(`server is running on port ${port}`))