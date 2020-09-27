//import controller dari productController.js
const productController = require('./productController')
const orderController = require('./orderController')
const userController = require('./userController')
const profileController = require('./profileController')
const transactionController= require('./transactionController')
const adminController = require('./adminController')
const kimiaController = require('./kimiaController')

//export controller ke router
module.exports = {
    productController,
    orderController,
    userController,
    profileController,
    transactionController,
    adminController,
    kimiaController
}
