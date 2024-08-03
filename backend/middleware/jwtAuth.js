const jwt = require("jsonwebtoken")

const jwtAuth = (req,res,next) => {
    const token = (req.cookies && req.cookies.token) || null //token come from here if exist
    if(!token){
        return res.status(400).json({
            success: false,
            message:'Not authorized'
        })
    }
    //if token exist then we verify that the token is right or not if right then we extract information from the token , and token verify by using secret key
    try{
        const userInfoFromToken = jwt.verify(token,process.env.SECRET)
        req.user = {email:userInfoFromToken.email,id:userInfoFromToken.id}
    }catch(err){
        res.status(400).json({
            success: false,
            message:`Not authorized: ${err.message}`
        })
    }

    next()
}

module.exports = jwtAuth