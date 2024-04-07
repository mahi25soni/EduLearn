const mongoose = require("mongoose")
const { sendEmail } = require("../config/sendGridConfig")
require("dotenv").config()

const userSchema = new mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    phone_number : {
        type : String
    },
    // Agar kuchh unique hai, toh uska required hona bhi zruri hai
    // because non-required mei null jayega and fir 2 null wale
    // aa gaye toh code fatt jayega

    // to change it again to normal, you have to first remove this
    // phone_number attribute using code aur DBcompass
    role : {
        type : String,
        enum : ["STUDENT","INSTRUCTOR","ADMIN"],
        required : true
    },
    password : {
        type : String,
        required : true
    },
    otp : {
        type : Number,
        required : true
    },
    active : {
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
}    
)


const Users = new mongoose.model("Users", userSchema)



module.exports = {
    Users
}
