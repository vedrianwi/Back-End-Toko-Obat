// import method router
const router = require('express').Router()

//import productcontroller dari index.js
const { productController } = require('../controllers')

//buat route
router.get('/product', productController.getProduct)
router.post('/product/add', productController.addProduct)
router.patch('/product/edit/:id',productController.editProduct)
router.delete('/product/delete/:id', productController.deleteProduct)
router.get('/product/:category', productController.categoryProduct)
router.get('/productId', productController.getProductByID)

//expport router ke index.js
module.exports = router