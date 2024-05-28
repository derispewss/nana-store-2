require('dotenv').config()
const axios = require('axios')

const waSendOTP = async (phone, otp, token) => {
    const apiUrl = 'https://wa.srv15.wapanels.com/send-message';
    const params = {
        api_key: process.env.API_KEY,
        sender: process.env.SENDER_NUMBER,
        number: phone,
        message: `Konfirmasi login Dashboard - ${phone}\n\n⚠️ _*SECURITY ALERT*_ ⚠️\n\nSeseorang berusaha mengakses Dashboard Admin, berikut OTP yang di perlukan :\n\n${otp}\n----------------------\n${token}\n\nJika anda tidak merasa melakukan login, abaikan pesan ini.`
    };
    try {
        const response = await axios.post(apiUrl, params);
        return response.data;
    } catch (error) {
        console.error('Error sending OTP via WhatsApp:', error);
        throw error;
    }
};

module.exports = { waSendOTP };