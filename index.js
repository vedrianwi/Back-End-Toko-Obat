// import modul
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

//buat app
const app = express()
dotenv.config()

// create url debuger
const urlLogger = (req, res, next) => {
	console.log(req.method + " : " + req.url);
	next();
};

//import database
const database = require('./database')

//connect database dengan backend
database.connect((err) => {
    if(err) {
        console.log(err)
    }
    console.log(`DB connected as id : ${database.threadId}`)
})

//masukin middleware
app.use(cors())
app.use(bodyParser.json())
app.use(urlLogger);


// buat route nya, import dulu dari index router
const { productRouter, orderRouter, userRouter, profileRouter, transactionRouter, adminRouter, kimiaRouter} = require('./routers')
app.use('/api',productRouter)
app.use('/api',orderRouter)
app.use('/api',userRouter)
app.use('/api',profileRouter)
app.use('/api',transactionRouter)
app.use('/api/admin', adminRouter)
app.use('/api', kimiaRouter)

// buat home wellcome to my api
app.get('/', (req, res) => {
    res.status(400).send('<h1>Wellcome to my API</h1>')
})

// host api di localhost
const PORT = 2000
app.listen(PORT, () => console.log(`Server is running at PORT : ${PORT}`))
