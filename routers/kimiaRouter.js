// import method router
const router = require('express').Router()

//import productcontroller dari index.js
const { kimiaController } = require('../controllers')

//route
router.get('/kimia', kimiaController.getProductKimia)
router.get('/kimia/:category', kimiaController.categoryKimia)
router.patch('/editkimia/:id', kimiaController.editProduct)
module.exports = router