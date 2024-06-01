const axios = require('axios');
const FormData = require('form-data');

async function TelegraPH(buffer, originalname) {
    const formData = new FormData();
    formData.append('file', buffer, {
        filename: originalname,
        contentType: 'image/jpeg'
    });
    try {
        const response = await axios.post('https://telegra.ph/upload', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        return `https://telegra.ph${response.data[0].src}`;
    } catch (error) {
        throw new Error('Error uploading image to Telegra.ph');
    }
}

module.exports = { TelegraPH };