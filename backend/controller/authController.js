const userModel = require("../model/userSchema.js")
const emailValidator = require("email-validator")
const bacrypt = require("bcrypt")

//for user signup
const signUp = async(req,res,next) => {
    const{name,email,password,confirmPassword} = req.body
    console.log(name,email,confirmPassword,password)

    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Every field is required"
        })
    }
    //for email validation
    const validateEmail = emailValidator.validate(email)
    if(validateEmail === false){
        return res.status(400).json({
            success:false,
            message:"Please provide a valid email id"
        })
    }
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm password doesn't match"
        }) 
    }
    try{
        const sendToSchema = userModel({
            name:name,
            email:email,
            password:password,
            confirmPassword
        })
        const user = await sendToSchema.save() 
        return res.status(201).json({
            success: true,
            data:user
        })
    }catch(err){
        if(err.code === 11000){
            return res.status(400).json({
                success:false,
                message:"Account already exist in provided emailId"
            })
        }
        return res.status(400).json({
            success:false,
            message: err.message
        })
    }
}

//for user signin
const signIn = async(req,res) => {
    const {email,password} = req.body

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Every field is required"
        })
    }
    
    try{

        //in user data come from database
        const user = await userModel.findOne({email:email}).select('+password')

        if(!user || !await bacrypt.compare(password,user.password)){
            return res.status(400).json({
                success:false,
                message:"Invalid userId or password!"
            })
        }
        const token = user.jwtToken() // Here, 'this' refers to the 'user' instance
        user.password = undefined

        const cookieOption = {
            maxAge: 24*60*60*1000,
            httpOnly: true
        } 

        //	Upon successful validation, the server generates a JWT using jwt.sign.
        //The server sends the JWT back to the client, usually as part of the response body or as a cookie.

        res.cookie("token",token,cookieOption)
        res.status(200).json({
            success:true,
            data:user
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

//getting user
const getUser = async(req,res) => {
    const userId = req.user.id
    try{
        const userData = await userModel.findById(userId)
        res.status(200).json({
            success: true,
            data: userData
        })
    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

//user log out by deleteing token
const userLogout = (req,res) => {
    try{
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        }
        res.cookie("token",null,cookieOption)
        res.status(200).json({
            success: true,
            message:"Logged out"
        })
    }catch(err){
        res.status(400).json({
            success: false,
            message:err.message
        })
    }
}

module.exports = {
    signUp,
    signIn,
    getUser,
    userLogout
}