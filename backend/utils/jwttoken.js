const sendToken=(user,statusode,res)=>{
    const token=user.getJWTToken();
    //options for cookie
    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRE * 24 *60*60*1000),
        httponly:true
    }
     res.status(statusode).cookie('token',token,options).json({
        success:true,
        user,
        token
     })
}
module.exports=sendToken