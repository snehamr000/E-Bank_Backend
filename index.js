require('dotenv').config()
const express = require('express')
const cors = require('cors')
const userRouter = require('./Routes/userRoutes.js')
const adminRouter = require('./Routes/adminRoutes.js')
require('./DB/connection.js')

const bankServer = express()
bankServer.use(cors())
bankServer.use(express.json());
bankServer.use('/api/user',userRouter)
bankServer.use('/api/admin',adminRouter)
const PORT = process.env.PORT || 5001;
bankServer.listen(PORT,() => {
    console.log(`Bank Server is running on port ${PORT}`);
})

bankServer.get('/', (req, res) => {
    res.send("<h1 style=color:red>Bank Server started... and waiting for client Requests!!!</h1>");
})