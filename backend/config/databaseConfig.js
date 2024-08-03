const mongoose = require("mongoose")

const db_connection = async() => {
    try{
        const cnn = await mongoose.connect(process.env.DB_URI)
        console.log(`connected to DB: ${cnn.connection.host}`)
    }catch(err){
        console.log(err.messsage)
    }
}

module.exports = db_connection