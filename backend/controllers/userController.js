const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

const User=require("../models/userModal");
const sendToken = require("../utils/jwttoken");

//Register user

const registerUser=catchAsyncErrors(async(req,res,next)=>{
const {name,email,password}=req.body;
const user=await User.create({
    name,email,password,
    avatar:{
        public_id:"This is a sample id",
        url:"profilePicUrl"
    }
})
 sendToken(user, 200, res);
// const token=user.getJWTToken();
// res.status(201).json({
//   success: true,
//    token,
// });
})

const loginUser=catchAsyncErrors(async (req,res,next)=>{
  const {email,password}=req.body;
  //check if user has given passwor and email both
  if(!email || !password){
    return next(new ErrorHandler("Please Enter Email & Password",400))
  }
  const user=await User.findOne({email}).select("+password");
  //here we have to select passworrd it's been select false in schema
  if(!user){
    return next(new ErrorHandler("Invalid Email or Password",401))
  }
  const isPasswordMatched= await user.comparePassword(password)
  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",401))
  }
  // const token = user.getJWTToken();
  // res.status(200).json({
  //   success: true,
  //   token,
  // });

  //above is optimized
  sendToken(user,200,res)
})


module.exports = {
  registerUser,
  loginUser,
};