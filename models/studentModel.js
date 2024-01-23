const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const studentModel=new mongoose.Schema(
    {   
        
        firstName:{
            type:String,
            required:[true,'FirstName is Required'],
            maxLength:[10,"firstName should be must be less 10 character"],
            minLength:[3,"firstName should be Atleast 3 character"],

        },
        lastName:{
            type:String,
            // required:[true,'lasName is Required'],
            maxLength:[10,"lasName should be must be less 10 character long"],
            minLength:[3,"lasName should be Atleast 3 character long"],
        },
        contact:{
            type:String,
            required:[true,'contact is Required'],
            maxLength:[10,"contact not more 10 digit"],
            minLength:[10,"contact should be Atleast 10 digit"],

        },
        city:{
            type:String,
            // required:[true,'cityName is Required'],
            maxLength:[10,"cityName should be must be less 10 character long"],
            minLength:[3,"cityName should be Atleast 3 character long"],

        },
        gender:{
            type:String,
            enum:['Male','Female','Others']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
      password:{
        type:String,
        select:false,
        
        maxLength:[
                  15,
                  'password Should Not exceed more than 15 character'
                  ],
        minLength:[
                  6,
                  'password Should Atleast  6 character'
                  ],
        match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,"password should contain one Capiterlater,Number,Special Character"]
        },
        resetPassword: {
            type:String,
            default:"0"
        },
    avatar:{
        type:Object,
        default:{
            fileId:"",
            url:"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1705859038~exp=1705859638~hmac=22eb8b3f6b069c071dab5af55d9072cbff2a26529575a0d9d6b5f3a70c5c569c"
        }
    },
    },

{timestamps:true}
)
studentModel.pre("save",function(){
      if(!this.isModified('password')){
        return;
      }
      let salt=bcrypt.genSaltSync(10);
      this.password=bcrypt.hashSync(this.password,salt);
})
studentModel.methods.comparepassword=function(password){
    return bcrypt.compareSync(password,this.password);
}
studentModel.methods.getjwttoken=function(){
   return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE}
);
}

const students=mongoose.model('students',studentModel);
module.exports=students;