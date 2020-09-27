// import method router
const router = require('express').Router()

//import productcontroller dari index.js
const { adminController } = require('../controllers')

//route
router.get('/history', adminController.getHistory)
router.get('/stock', adminController.getStock)
module.exports = router