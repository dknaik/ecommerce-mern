//auth user after creating login and register
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("./catchAsyncError");
const jwt=require("jsonwebtoken");
const User = require("../models/userModal");

const isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
if(!token){
    return next(new ErrorHandler("Please Login to access this reasource",401))
}
const decodedData = jwt.verify(token, process.env.JWT_SECRET);
console.log("decodedData", decodedData.id);
req.user = await User.findById(decodedData.id);
next()
})

const authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
if(!roles.includes(req.user.role)){
return next(  new ErrorHandler(`Role:${req.user.role} is not allowed to access this resouce`,403)
)}
next()
    }
}
module.exports = { isAuthenticatedUser, authorizeRoles };