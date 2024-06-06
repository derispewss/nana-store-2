require('dotenv').config()
const axios = require('axios')

const waSendOTP = async (phone, otp) => {
    const apiUrl = 'https://wa.srv15.wapanels.com/send-message';
    const params = {
        api_key: process.env.API_KEY,
        sender: process.env.SENDER_NUMBER,
        number: phone,
        message: `⚠️ _*SECURITY ALERT*_ ⚠️\n\nSeseorang berusaha mengakses Dashboard Admin Nanas Store, berikut OTP yang di perlukan :\n\n_*${otp}*_\n\nJika anda tidak merasa melakukan login, abaikan pesan ini.`
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