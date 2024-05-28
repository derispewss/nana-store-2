const nodemailer = require('nodemailer')

async function sendClient(email, otp, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'claymorestore.id@gmail.com',
            pass: 'xfzu zgcw iwqn bysh'
        }
    });

    let mailOptions = { 
        from: 'claymorestore.id@gmail.com',
        to: email,
        subject: `Konfirmasi login Dashboard - ${email}`,
        text: `⚠️ SECURITY ALERT ⚠️\n\nSeseorang berusaha mengakses Dashboard Admin, berikut OTP yang di perlukan :\n\n${otp}\n${token}\n\nJika anda tidak merasa melakukan login, abaikan pesan ini.`,
    };

    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Gagal mengirim email:', error);
            }
            console.log('Email terkirim:', info.response)
            return info.response
        });
    } catch (error) {
        console.error(error.message || "internal server error")
    }
}

module.exports = { sendClient }