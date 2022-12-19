const jwt= require("jsonwebtoken");
const User = require('../model/userSchema');


const Aunthenticate = async (req,res,next)=>{
   try{
    const token = req.cookies.jwtoken;
   
    const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
    const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});

    if(!rootUser){ throw new  Error('User not Found')};
    req.token = token;
    req.rootUser= rootUser;
    req.UserID = rootUser._id;
    next();

   }
   catch (err){
       res.status(401).send('unAuthorizes:NO token provied');
       console.log(err)

   }


}

module.exports = Aunthenticate;