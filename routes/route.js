const express = require('express')
const router = express.Router();
const { registerUser, loginUser, savePassword, deletePassword } = require('../controllers/controller')


router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/savePassword', savePassword)
router.post('/deletePassword', deletePassword)


module.exports = router