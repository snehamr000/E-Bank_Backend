const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
    },
    address:{
        type:String,
    },
    accountNo:{
        type:String,
        unique:true,
        required:true
    },
    accountStatus:{
        type:String,
        default:"active"
    },
    balance:{
        type:Number,
        default:0
    }
})

const users = mongoose.model('users',userSchema)
module.exports = users