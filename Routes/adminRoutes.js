const express = require('express')
const adminController = require('../Controllers/adminController')
const adminAuth = require('../Middlewares/adminAuth')
const router = new express.Router()

// router.post('/register',adminController.register)
router.post('/login',adminController.login)
router.get('/view-all-users',adminAuth,adminController.viewAllUsers)
router.post('/disableUser',adminAuth,adminController.disableUserAccount)

module.exports = router