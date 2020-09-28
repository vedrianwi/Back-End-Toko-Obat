const database = require('../database')
const { validationResult } = require('express-validator')
const CryptoJS = require('crypto-js')
const { asyncQuery } = require('../helper/queryHelp')
const { createToken } = require('../helper/jwt')
const transporter = require('../helper/nodemailer')

const SECRET_KEY = process.env.SECRET_KEY

module.exports = {
    getUserData : (req, res) => {
        const query = 'select * from users'
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send('Internal Server Error')
            }
            res.status(200).send(result)
        })
    },
    login : async (req, res) => {
        console.log('body : ', req.body)
        const { username, password } = req.body

        const query = `select * from users where username = '${username}'`
        try {
            const result = await asyncQuery(query)

            if(result.length === 0) 
                return res.status(400).send(`User with username = ${username} is doesn't exist`)

            const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY)
            if (hashpass.toString() !== result[0].password) {
                return res.status(400).send('invalid password.')
            }
            delete result[0].password

            const token = createToken({ id : result[0].id, username : result[0].username })

            result[0].token = token

            res.status(200).send(result[0])

        } catch(err) {
            res.status(500).send(err)
        }
    },
    register : async (req, res) => {
        console.log('body : ', req.body)
        const { username, password, confpassword, email } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() })
        }
        
        if (password !== confpassword ) {
            return res.status(400).send('password doesn\'t match.')
        }
        
        try {
            const query = `select * from users where username='${username}' or email='${email}'`
            const user = await asyncQuery(query)

            if (user.length > 0) {
                return res.status(400).send('username or email is already used.')
            }

            const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY)
            const insertUser = `INSERT INTO users (username, password, email, role, status) 
                                values ('${username}', '${hashpass.toString()}', '${email}', 'user', 0)`
            
            const newUser = await asyncQuery(insertUser)  
            const new_userId = newUser.insertId

            const insertProfile = `INSERT INTO profile (user_id) values (${new_userId})`
            const newProfile = await asyncQuery(insertProfile)

            const token = createToken({ id : new_userId, username : username })
            
            // email verification to user
            const option = {
                from : `admin <fesyahbhaskara17@gmail.com>`,
                to : 'kevinchandra940@gmail.com',
                subject : 'Email verification',
                text : 'test',
                html : `
                    <h3>Click link below to verified your account</h3>
                    <a href="http://localhost:3000/verification?${token}">Click here</a>`

            }

            const info = await transporter.sendMail(option)
            res.status(200).send(info.response)

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    keeplogin : async(req, res) => {
        console.log('user : ', req.user)
        try {
            const query = `select id, username, email, role
            from users
            where id =${req.user.id} AND username='${req.user.username}'`

            const result = await asyncQuery(query)

            delete result[0].password

            res.status(200).send(result[0]);
        } catch (err) {
            res.status(500).send(err)
        }
    },
    emailverification : async (req, res) => {
        console.log('user : ', req.user)
        try {
            // change status user in database
            const query = `UPDATE users SET status = 1 WHERE id = ${req.user.id} AND username = '${req.user.username}'`
            const result = await asyncQuery(query)
            console.log(result)

            res.status(200).send('email has been verified.')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    getUserHistory: async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const query = `select t.id, t.order_number,pt.type_payment,  t.total, ps.status_payment,  od.qty, t.bukti_transfer, od.product_id, t.user_id
            FROM transactions t 
            JOIN payment_types pt ON t.payment_type = pt.id
            JOIN payment_status ps ON t.status_payment = ps.id
            JOIN order_details od ON t.order_number = od.order_number
            WHERE t.user_id = '${id}'
            GROUP BY order_number;`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
        }
    },
}