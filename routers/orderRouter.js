// import method router
const router = require('express').Router()

// import order router
const {orderController} = require('../controllers')

router.post('/add', orderController.addToCart)
router.patch('/edit/:id', orderController.editCartQty)
router.delete('/delete/:id', orderController.deleteCart)
router.get('/checkout/:on', orderController.checkOut)
router.get('/cart/:id',orderController.getCartData)
router.post('/kimiacart', orderController.CartKimia)
router.get('/kimiaker/:id',orderController.getCartKimia)
router.delete('/delkimia/:id', orderController.deleteCartKimia)

module.exports = router