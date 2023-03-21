const mongoose=require('mongoose');
const validator=require("validator");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your name"],
        maxLength:[30,"Max length cannot excede 30 character"],
        minLength:[4,"Name should have more then 4 characters"]
    },
    email:{
type:String,
required:[true,"Please Enter your Email"],
unique:true,
validator:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
type:String,
required:[true,"please Enter your password"],
minLength:[8,"Password should be greater then 8 charcters"],
select:false
    },
    avatar:{
      public_id: {
        type: String,
        required:true
      },
      url: {
        type: String,
        required:true
      },
    
    },
    role:{
        type:String,
        default:"user",

    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

userSchema.pre('save',async function(next){
  if(!this.isModified("password")){
      next()
      //if password not changed then no need to modify the password
  }
  this.password=await bcrypt.hash(this.password,10)
})

//JWT TOKEN
userSchema.methods.getJWTToken=function(){
//creating  jwt token it asks for id
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
  expiresIn:process.env.JWT_EXPIRE
})
}

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generating password Reset Token
userSchema.methods.getResetPasswordToken=function(){
  //generating token 
  const resetToken=crypto.randomBytes(20).toString("hex");
   //Hashing and adding resetPAsswordToken to userSchema
this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex')
this.resetPasswordExpire=Date.now() +15 *60*1000;
return resetToken;
}
module.exports=mongoose.model("users",userSchema)