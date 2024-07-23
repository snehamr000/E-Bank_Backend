const Admin = require('../Models/adminModel')
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// exports.register = async(req,res)=>{
//     console.log("Inside Register API");
//     try {
//         const {adminName,email,password} = req.body
//         console.log(adminName,email,password);
//         const hashedPassword =  bcrypt.hashSync(password,10)
//         const existingUser = await Admin.findOne({email})
//         if(existingUser){
//             return res.status(404).json("Account already exists...Please login!!!")
//         }else{
//             const newUser = new Admin({
//                 adminName,
//                 email,
//                 password:hashedPassword
//             })
//             await newUser.save()
//             return res.status(200).json(newUser)
//         }
        
//     } catch (error) {
//         res.status(500).json({error:"Internal Server Error",message:error.message})
//     }
// }

// login API

exports.login = async(req,res) =>{
    console.log("Inside Admin Login");
    const {email,password} = req.body
    console.log(email,password);
    try {
        if(!email || !password){
          return res.status(400).json("All Fields are required")
        }
        const admin = await Admin.findOne({email})
        if(!admin){
            res.status(401).json("Admin not found")
        }
        // check password
        const matchPassword =  bcrypt.compareSync(password,admin.password)
        if(!matchPassword){
            res.status(401).json("Wrong Password")
        }
        const token = jwt.sign({id:admin._id},process.env.JWT_ADMIN_SECRET_KEY)
        res.status(200).json({token,message:"Login Successfull"})
    } catch (error) {
        res.status(500).json({error:"Internal Server Error", message:error.message})
    }
}

// view all users

exports.viewAllUsers = async(req,res)=>{
    try {
        const users = await User.find()
        if(users){
            return res.status(200).json(users)
        }else{
            return res.status(404).json("No users found")
        }
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error",message:error.message})
    }
}


// disable user accounts
exports.disableUserAccount = async(req,res)=>{
    try {
        const {userId,status} = req.body
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json("User not found")
        }else{
            user.accountStatus = status
            await user.save()
            return res.status(200).json({message:"User account disabled successfully",user})
        }
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error",message:error.message})
    }
}

// view all transactions

// exports.viewAllTransactions = async(req,res)=>{
//     try {
//         const transactions = await Transaction.find()
//         if(transactions){
//             return res.status(200).json(transactions)
//         }else{
//             return res.status(404).json("No transactions found")
//         }
//     } catch (error) {
//         return res.status(500).json({error:"Internal Server Error",message:error.message})
//     }
// }