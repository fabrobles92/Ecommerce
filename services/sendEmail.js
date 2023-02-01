const keys = require('../config/keys')

const nodeMailer = require('nodemailer')
const sendEmail = async (to, subject, body) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'fabrobles92@gmail.com',
            password: 'F@Br1992',
            clientId: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            refreshToken: keys.googleRefreshToken
        }
    })

    const mailOptions = {
        from: 'fabrobles92@gmail.com',
        to,
        subject,
        html: `<a href=${body}>Reset Password</a>`,

    }
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail