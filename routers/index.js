// import router 
const productRouter = require('./productRouter')
const orderRouter = require('./orderRouter')
const userRouter = require('./userRouter')
const profileRouter = require('./profileRouter')
const transactionRouter = require('./transactionRouter')
const adminRouter = require('./adminRouter')
const kimiaRouter = require('./kimiaRouter')
// import semua router ke index.js paling utama
module.exports = {
    productRouter,
    orderRouter,
    userRouter,
    profileRouter,
    transactionRouter,
    adminRouter,
    kimiaRouter
}