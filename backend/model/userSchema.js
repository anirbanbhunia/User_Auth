const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bacrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name must be required"],
        minLength:[5,"Name must be at least 5 char"],
        maxLength:[50,"Name must be less than 50 char"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email must be required"],
        unique:[true,"email already exist"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        select:false
    },
    forgotPasswordToken:{
        type:String,
    },
    forgotPasswordTokenExpiryDate:{
        type:Date
    }
},{
    timestamps:true
})

userSchema.pre("save", async function(next){
    if(!this.isModified('password')){
       return next()
    }
    this.password = await bacrypt.hash(this.password, 10)
    return next()
})

userSchema.methods = {
    jwtToken(){
            return jwt.sign({
                id:this._id,email:this.email
            },
            process.env.SECRET,
            {expiresIn:'24h'}
        )
    }
}

module.exports = mongoose.model("curdUser",userSchema)