const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : String,
    address : String,
    phone_no : Number,
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : String,
    profilePic : String,
    role : String,
},{
    timestamps : true
})


const userModel =  mongoose.model("user",userSchema)


module.exports = userModel