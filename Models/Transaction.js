const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
   
    senderAccountNo:{
        type:String,
        required:true
    },
    recieverAccountNo:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const transactions = mongoose.model('transactions',transactionSchema)
module.exports = transactions