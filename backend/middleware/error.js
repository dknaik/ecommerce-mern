const ErrorHandler=require("../utils/errorHandler")

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error";

//Handling wrong moogo db id error called cast error
if(err.name==='CastError'){
    const message=`Resource not found.Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
}

    res.status(err.statusCode).json({
        status:false,
        message:err.message,
        errorStack:err.stack
        
    })
}