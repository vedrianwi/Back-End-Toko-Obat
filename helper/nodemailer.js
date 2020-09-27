const nodemailer = require('nodemailer')
const TOKEN_GMAIL = process.env.TOKEN_GMAIL

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'fesyahbhaskara17@gmail.com',
        pass : TOKEN_GMAIL
    },
    tls : {
        rejectUnauthorized : true
    }
})

module.exports = transporter