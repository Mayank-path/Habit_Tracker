const jwt =require("jsonwebtoken")
const  JWT_SECRET = process.env.JWT_SECRET


const Authmiddleware = (req,res,next)=>{
    
    try{
        const authheader= req.headers[ "authorization" ];
    
        if(!authheader || !authheader.startsWith("Bearer")){
            return res.status(401).json({error:"Unauthorized no token provided"})
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded
        next();

    }catch(err){
        res.status(401).json({error : "Invalid or expired token"})
    }
}

module.exports = Authmiddleware;