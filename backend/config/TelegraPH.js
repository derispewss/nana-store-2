const axios = require('axios');
const FormData = require('form-data');

async function TelegraPH(buffer, originalname) {
    const form = new FormData();
    form.append('files[]', buffer, originalname);
    try {
        const response = await axios.post('https://qu.ax/upload.php', form, {
            headers: form.getHeaders(),
        })
        const uploadedUrl = response.data.files[0].url;
        return uploadedUrl;
    } catch (error) {
        throw new Error('Error uploading image to Telegra.ph');
    }
}

module.exports = { TelegraPH };