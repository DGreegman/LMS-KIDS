const nodemailer = require('nodemailer')

const sendEmail = async (option) => {
    // create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // define email options 
    const email_options = {
        from: 'Learnable Kids Support <info@learnablekids.com>',
        to: option.email,
        subject: option.subject,
        text: option.message

    }

    await transporter.sendMail(email_options)
}

module.exports = sendEmail