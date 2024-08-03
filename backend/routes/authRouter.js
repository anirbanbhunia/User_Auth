const express = require("express")
const { signUp,signIn,getUser,userLogout } = require("../controller/authController")
const jwtAuth = require("../middleware/jwtAuth")

const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/getuser",jwtAuth,getUser)
authRouter.get("/logout",jwtAuth,userLogout)

module.exports = authRouter