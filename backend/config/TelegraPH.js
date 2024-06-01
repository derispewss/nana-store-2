const axios = require("axios");
const BodyForm = require("form-data");
const fs = require("fs");

const TelegraPH = async (Path) => {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(Path)) return reject(new Error("File not Found"));
        try {
            const form = new BodyForm();
            form.append("file", fs.createReadStream(Path));
            const data = await axios({
                url: "https://telegra.ph/upload",
                method: "POST",
                headers: {
                    ...form.getHeaders(),
                },
                data: form,
            });

            if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                const imageUrl = "https://telegra.ph" + data.data[0].src;
                return resolve(imageUrl);
            } else {
                return reject(new Error("Response data is invalid"));
            }
        } catch (err) {
            return reject(new Error(String(err)));
        }
    });
};
    
module.exports = { TelegraPH }