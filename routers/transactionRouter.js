// import method router
const router = require('express').Router()
const { upload} = require('../helper/multer')

//import productcontroller dari index.js
const { transactionController } = require('../controllers')

const DESTINATION = './public/receipt'
const uploader = upload(DESTINATION)

//route
router.post('/payment', transactionController.addPayment)
router.post("/upload/:id", uploader, transactionController.uploadReceipt);
router.patch('/approve/:id', transactionController.approvePayment)
router.patch('/reject/:id', transactionController.rejectPayment)

module.exports = router