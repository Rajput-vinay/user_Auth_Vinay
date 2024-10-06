const {transporter} = require('../config/email.config')

const sendOtpEmail = (to,otp) =>{
    const mailOptions = {
        from:process.env.MAIL_USER,
        to,
        subject:"Password Reset OTP",
        text:' Your OTP for password reset is : ${otp}'
    };

    return transporter.sendMail(mailOptions)
}

module.exports = {
    sendOtpEmail,
};