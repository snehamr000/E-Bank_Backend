const User = require('../Models/userModel')
const Transaction = require('../Models/Transaction')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.register = async(req,res)=>{
    console.log("Inside Register API");
    try {
        const {username,email,password,phoneNumber,address,accountNo} = req.body
        console.log(username,email,password,phoneNumber,address,accountNo);
        const hashedPassword = await bcrypt.hashSync(password,10)

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(404).json("Account already exists...Please login!!!")
        }else{
            const newUser = new User({
                username,
                email,
                password:hashedPassword,
                phoneNumber,
                address,
                accountNo
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json({error:"Internal Server Error",message:error.message})
    }
}

// login API

exports.login = async (req, res) => {
    console.log("Inside Login API");
    try {
        const { email, password, accountNo } = req.body;
        const existingUser = await User.findOne({ email, accountNo });

        if (!existingUser) {
            return res.status(404).json("Account does not exist...Please register!!!");
        }

        // Check if the password is correct
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json("Invalid password...Please try again!!!");
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: existingUser._id},
            process.env.JWT_SECRET_KEY
        );

        return res.status(200).json({message: "Login Successfull", existingUser, token });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};


// get User By Id

exports.getUserById = async(req,res)=>{
    try {
        const {id} = req.params
        const user = await User.findById({_id:id})
        if(!user){
            return res.status(404).json("User not found")
        }else{
            return res.status(200).json(user)
        }
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error",message:error.message})
    }
}


// add deposit
exports.deposit = async (req, res) => {
    try {
        const { senderAccountNo, receiverAccountNo, amount, type } = req.body;

        // Find sender and receiver accounts
        const sender = await User.findOne({ accountNo: senderAccountNo });
        console.log(sender);

        if (!sender) {
            return res.status(404).json("Sender account not found");
        }
        
        const receiver = await User.findOne({ accountNo: receiverAccountNo });
        if (!receiver) {
            return res.status(404).json("Receiver account not found");
        }

        if (sender.balance < amount) {
            return res.status(400).json("Insufficient balance");
        }

        // Update balances
        sender.balance -= amount;
        await sender.save();

        receiver.balance += amount;
        await receiver.save();

        // Create and save transaction
        const transaction = new Transaction({
            senderAccountNo: sender.accountNo,
            receiverAccountNo: receiver.accountNo,
            amount,
            type
        });
        await transaction.save();

        return res.status(200).json({ sender, receiver, transaction });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};



// withdraw amount

exports.withdraw = async(req,res)=>{
    try {
        const {accountNumber} = req.account
        console.log(accountNumber);
        const {amount} = req.body
        const user = await User.findOne({accountNo:accountNumber})
        if(!user){
            return res.status(404).json("User not found")
        }else{
            if(user.balance < amount ){
                return res.status(400).json("Insufficient balance")
            }else{
                user.balance -= amount
                await user.save()
                return res.status(200).json({message:"Amount withdrawn successfully",user})
            }
        }
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error",message:error.message})
    }
}

// view individual transactions

exports.viewIndividualTransactions = async(req,res)=>{
    try {
        const {accountNo} = req.accountNo
        const transactions = await Transaction.find({senderAccountNo:accountNo})
        if(!transactions){
            return res.status(404).json("No transactions found")
        }else{
            return res.status(200).json(transactions)
        }
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error",message:error.message})
    }
}