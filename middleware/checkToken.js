const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token){
        return res.status(400).send('Access denied, no token provided');
    }
    try{
      const decoded=jwt.verify(token,process.env.JWT_PASS);
      if(!decoded){
         res.status(400).send('token is invalid or expired');
      }
      req.userId=decoded.id;
      req.biz=decoded.biz;
      req.admin=decoded.admin;
      next();
    }catch(err){
        res.status(400).send('invalid token');
    }
}