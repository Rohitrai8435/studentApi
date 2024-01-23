const express=require('express');
const { homepage,studentsignup ,studentsignin,studentsignout, currentStudent,forgetpassword,resetpassword,updateStudent,studentavatar} = require('../controllers/indexController');
const { isAuthenticated } = require('../middlewares/auth');
const router=express.Router();


  // GET /
router.get('/',homepage);
  // post /currentStudent
router.post('/currentstudent',isAuthenticated,currentStudent);
//post /student/signup
router.post('/student/signup',studentsignup);
 
//post /student/signin
router.post('/student/signin',studentsignin);
 
//post /student/signout
router.post('/student/signout',isAuthenticated,studentsignout);
//post /student/forgetPassword
router.post('/student/forgetpassword',forgetpassword);
 
//get /student/forgetpassword-link/:studentid
router.get('/student/forgetpassword-link/:id',resetpassword);
// post /student/update/:id
router.post('/student/update/:id',isAuthenticated,updateStudent);
 
// post /student/avatar/:id
router.post('/student/avatar/:id',isAuthenticated,studentavatar);
 
module.exports=router;