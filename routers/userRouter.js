const router = require('express').Router()
const validator = require('../helper/validator')
const { verify } = require('../helper/jwt')

const { userController } = require('../controllers')


router.get('/users', userController.getUserData)
router.post('/login', userController.login)
router.post('/register', validator, userController.register)
router.post('/users/keeplogin', verify, userController.keeplogin)
router.post('/users/verification', verify, userController.emailverification)
router.get('/user/history/:id', userController.getUserHistory)
module.exports = router