const express = require('express');
const userController = require('../Controllers/userController');
const userAuth = require('../Middlewares/jwtMiddleware');
const router = new express.Router()

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/deposit',userAuth, userController.deposit);
router.post('/withdraw',userAuth, userController.withdraw);
router.get('/get-user/:id',userAuth, userController.getUserById);
router.get('/view-transactions',userAuth, userController.viewIndividualTransactions);
router
module.exports = router