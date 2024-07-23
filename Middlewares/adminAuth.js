const jwt = require('jsonwebtoken');

const adminAuth = async(req,res,next)=>{
    console.log("Inside Admin Auth Middleware!!!");
    const token = req.headers['authorization'].split(" ")[1]
    try {
        if(token){
            const jwtResponse = jwt.verify(token,process.env.JWT_ADMIN_SECRET_KEY)
            req.admin = jwtResponse.id
            next()
        }else{
          return res.status(406).json("Please Provide Token!!!")
        }
    } catch (error) {
       return res.status(401).json("Access denied.... Please provide token!!!")    }
}

module.exports = adminAuth