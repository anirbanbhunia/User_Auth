const express = require("express")
const authRouter = require("./routes/authRouter")
const db_connection = require("./config/databaseConfig")
const cookieParser = require("cookie-parser")
const cors = require('cors')

const app = express()
db_connection()

//before go to any route gothrough this middleware
app.use(express.json())
app.use(cookieParser()) //convert cookie into json
// CORS configuration to connect backend and frontend
app.use(cors({
    origin: [process.env.CLIENT_URL], // Correctly match the frontend URL(this gives permission that url to process methods)
    //By setting the origin option in the cors middleware to process.env.CLIENT_URL, you are specifying which origins (URLs) are allowed to access the resources on your server.
    credentials: true // Allow credentials such as cookies
}))

app.use("/api/auth/",authRouter)

app.use("/",(req,res) => {
    res.status(200).json({
        data: "Auth server"
    })
})

module.exports = app