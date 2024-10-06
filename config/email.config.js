const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // Use the host directly
    service: 'gmail',
    port: 587, // Use port 587 for TLS
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Optional: Ignore self-signed certificate issues
    },
});

module.exports = {
    transporter,
};
