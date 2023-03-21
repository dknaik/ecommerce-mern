const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

const User=require("../models/userModal");
const sendToken = require("../utils/jwttoken");
const sendEmail=require('../utils/sendEmail')
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
 sendToken(user, 201, res);
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
  // res.status(200). json({
  //   success: true,
  //   token,
  // });

  //above is optimized
  sendToken(user,200,res)
})

const logout=catchAsyncErrors(async(req,res,next)=>{
 res.cookie("token",null,{
  expires:new Date(Date.now()),
  httpOnly:true
 })
  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
})

//Forgot password
const forgotPassword=catchAsyncErrors(async(req,res,next)=>{
  const user=await User.findOne({email:req.body.email});
  if(!user){
    return next(new ErrorHandler("user not found",404))
  }
  //Get resetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({validateBeforeSave:false});
  const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
  const message=`Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this emil then please ignore it`
  try{
await sendEmail({
email:user.email,
dubject:`Ecommerce Password Recovery`,
message,
})
res.status(200).json({
  success:true,
  message:`Email sent to ${user.email} successfully`
})
  }catch(error){
user.resetPasswordToken=undefined;
user.resetPasswordExpire=undefined;
  await user.save({ validateBeforeSave: false });
   return next(new ErrorHandler(error.message,500));
  }
})

module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
};