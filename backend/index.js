require('dotenv').config()
const express = require('express');
const crypto = require('crypto');
const cors =  require('cors');
const multer = require('multer');
const db = require('./config/supabase')
const path = require('path')
const fs = require('fs')
const { firestore, admin } = require('./config/firebase')
const { waSendOTP } = require('./config/waClient')
const { TelegraPH } = require('./config/TelegraPH')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));

function generateOTP() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateToken(length) {
    return crypto.randomBytes(length).toString('hex');
}

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

// authentication
app.post('/send-otp', async (req, res) => {
    const { user } = req.body;
    try {
        const { data: existingUser } = await db.from('otp_tokens').select('*').eq('user_login', user).single();
        if (existingUser) {
            const otp = generateOTP().toString();
            const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');
            await db.from('otp_tokens').update({ token: hashedToken }).eq('user_login', user);
            await waSendOTP(user, otp, hashedToken)
            .then(ress => {
                res.status(200).json({ success: true, message: 'OTP berhasil dikirim.', hashedToken });
            })
            .catch(err => {
                res.status(500).json({ success: false, message: 'Gagal mengirimkan OTP melalui WhatsApp.' });
            });
        } else {
            res.status(404).json({ success: false, message: 'Pengguna dengan email tersebut tidak ditemukan.' });
        }
    } catch (error) {
        console.error('Gagal mengirim OTP:', error.message);
        res.status(500).json({ success: false, message: 'Gagal mengirim OTP karena kesalahan server.' });
    }
});

app.post('/validate-otp', async (req, res) => {
    const { otp, token } = req.body;
    if (!otp || !token) return res.status(400).send("otp and token is required")
    try {
        const { data: tokenData } = await db.from('otp_tokens').select('*').eq('token', token).single();
        if (!tokenData) return res.status(400).json({ success: false, message: 'Token tidak valid.' });
        
        const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');
        
        if (hashedToken === tokenData.token) {
            const tokenAuth = generateToken(16)
            await db.from('otp_tokens').update({ access_token: tokenAuth }).eq('token', token);
            res.json({ success: true, message: 'OTP berhasil diverifikasi.', access_token: tokenAuth });
        } else {
            return res.status(400).json({ success: false, message: 'OTP tidak valid.' });
        }
    } catch (error) {
        console.error('Gagal memverifikasi OTP : ', error);
        res.status(500).json({ success: false, message: 'Gagal memverifikasi OTP.' });
    }
});
// end authentication

app.post('/upload-logo', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const tempFilePath = path.join(__dirname, 'temp', `${Date.now()}-${req.file.originalname}`);
        // Simpan file sementara ke sistem file
        fs.writeFileSync(tempFilePath, req.file.buffer);
        try {
            // Unggah file ke Telegra.ph
            const imageUrl = await TelegraPH(tempFilePath);
            res.status(201).json({ imageUrl: imageUrl });
        } finally {
            // Hapus file sementara
            fs.unlinkSync(tempFilePath);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send(error.message);
    }
});

app.post('/upload-banner', upload.single('image'), async (req, res) => { 
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const buffer = req.file.buffer;
        const storagePath = `banners/${Date.now()}-${req.file.originalname}`;
        const bucket = admin.storage().bucket();
        const file = bucket.file(storagePath);
        await file.save(buffer, {
            metadata: {
                contentType: req.file.mimetype
            }
        });
        const bucketName = bucket.name;
        const encodedPath = encodeURIComponent(storagePath);
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
        // Ambil dokumen "banners"
        const bannersDoc = await firestore.collection('settings-nanastore').doc('banners').get();
        let banners = [];
        if (bannersDoc.exists) {
            banners = bannersDoc.data().banners || [];
        }
        // Tambahkan data JSON baru ke array, batasi maksimal 2 data
        banners.unshift({ name: `Slide ${banners.length}`, imageUrl: publicUrl });
        banners = banners.slice(0, 2); // Pastikan hanya 2 data yang tersimpan
        // Simpan array baru ke Firestore dengan nama "banners"
        await firestore.collection('settings-nanastore').doc('banners').set({
            banners: banners
        });
        res.status(201).json({ name: `Slide ${banners.length - 1}`, imageUrl: publicUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send(error.message);
    }
});

app.get('/get-banners', async (req, res) => {
    try {
        const bannersDoc = await firestore.collection('settings-nanastore').doc('banners').get();
        if (!bannersDoc.exists) {
            return res.status(404).send('Document not found');
        }
        const bannersData = bannersDoc.data().banners;
        const formattedBanners = bannersData.map((banner, index) => ({
            name: `Slide ${index}`,
            imageUrl: banner.imageUrl
        }));
        res.status(200).json(formattedBanners);
    } catch (error) {
        console.error('Error retrieving banners:', error);
        res.status(500).send(error.message);
    }
});

// products manage
app.get('/products', async (req, res) => {
    try {
        const { data: products, error } = await db.from('nanastore').select('*');
        if (error) {
            throw error;
        }
        const response = products.map(product => {
            const { name, logo, description, category, slug, redirect_owner, data } = product;
            return { name, logo, description, category, slug, redirect_owner, data };
        });
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send(error.message);
    }
});

app.get('/products/filter', async (req, res) => {
    const { slug } = req.query;
    if (!slug) {
        return res.status(400).send('Slug query parameter is required');
    }
    try {
        const { data: products, error } = await db.from('nanastore').select('*').eq('slug', slug);
        if (error) {
            throw error;
        }
        if (products.length === 0) {
            return res.status(404).send('No matching documents');
        }
        const response = products.map(product => {
            const { name, logo, description, category, slug, redirect_owner, data } = product;
            return { name, logo, description, category, slug, redirect_owner, data };
        });
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        res.status(500).send(error.message);
    }
});


app.post('/products/upload-data', upload.single('logo'), async (req, res) => {
    try {
        console.log("Received request to upload data");
        const { name, description, category, slug, redirect_owner, data, token } = req.body;
        // Validate the token and form fields
        console.log("Validating token and form fields");
        const { data: responseToken } = await db.from('otp_tokens').select('*').eq('access_token', token).single();
        if (!token || !name || !description || !category || !slug || !redirect_owner || !data) {
            console.log("Missing required fields");
            return res.status(400).send('All fields are required');
        }
        if (token !== responseToken.access_token) {
            console.log("Invalid token");
            return res.status(400).json({ success: false, message: 'Token is invalid' });
        }

        // Process the uploaded logo
        if (!req.file) {
            return res.status(400).send('Logo is required');
        }
        let imageUrl;
        try {
            console.log("Uploading logo to Telegra.ph");
            imageUrl = await TelegraPH(req.file.buffer);
            console.log("Logo uploaded successfully to Telegra.ph:", imageUrl);
        } catch (error) {
            console.error(error)
        }

        // Validate product data
        console.log("Validating product data");
        const parsedData = JSON.parse(data);
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            console.log("Invalid product data");
            return res.status(400).send('Product data is required and must be an array');
        }
        for (let item of parsedData) {
            if (!item.product_name || !item.price) {
                console.log("Missing product_name or price in product data");
                return res.status(400).send('Each item in data array must have product_name and price');
            }
        }

        // Check if the product already exists
        console.log("Checking if the product already exists");
        const existingDoc = await db.from('nanastore').select('*').eq('name', name).single();
        if (existingDoc.data) {
            console.log("Product already exists");
            return res.status(400).json({ success: false, message: 'Product already exists' });
        }

        // Save the data to the database
        console.log("Inserting data into database");
        const insertData = {
            name,
            logo: imageUrl,
            description,
            category,
            slug,
            redirect_owner,
            data: parsedData.map(item => ({ ...item, statusProducts: true }))
        };
        await db.from('nanastore').insert([insertData]);

        console.log("Data uploaded successfully");
        res.status(201).json({ success: true, message: 'Data uploaded successfully' });
    } catch (error) {
        console.error('Error uploading data:', error);
        res.status(500).send(error.message);
    }
});

// Endpoint untuk menambahkan data baru
app.post('/products/add-data', async (req, res) => {
    try {
        const { slug, newData } = req.body;
        if (!slug || !newData) return res.status(400).send('Invalid input format');
        // Mengambil dokumen dengan 'slug' tertentu
        const { data: existingDoc, error } = await db.from('nanastore').select('data').eq('slug', slug).single();
        if (error) throw new Error(error.message);
        // Menggabungkan data baru ke dalam array 'data' pada dokumen yang sudah ada
        const updatedData = existingDoc.data ? [...existingDoc.data, newData] : [newData];
        // Memperbarui dokumen dengan data baru
        await db.from('nanastore').update({ data: updatedData }).eq('slug', slug);
        res.status(200).json({ success: true, message: 'Data added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.post('/products/update-data', async (req, res) => {
    try {
        const { slug, newData } = req.body;
        if (!slug || !newData) return res.status(400).send('Invalid input format');

        // Cari data terdahulu berdasarkan slug
        const { data: existingData, error: selectError } = await db
            .from('nanastore')
            .select('data')
            .eq('slug', slug)
            .single();

        if (selectError) throw new Error(selectError.message);
        if (!existingData) return res.status(404).send('Product not found');

        // Lakukan pembaruan data
        const updatedData = existingData.data.map(product => {
            if (product.product_name === newData.product_name) {
                return { ...product, ...newData };
            }
            return product;
        });

        // Perbarui data di tabel 'nanastore' di database
        const { error: updateError } = await db
            .from('nanastore')
            .update({ data: updatedData })
            .eq('slug', slug);

        if (updateError) throw new Error(updateError.message);
    
        res.status(200).json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/products/delete-data', async (req, res) => {
    try {
        const { slug, product_name } = req.body;
        if (!slug || !product_name) return res.status(400).send('Invalid input format');

        // Cari data terdahulu berdasarkan slug
        const { data: existingData, error: selectError } = await db
            .from('nanastore')
            .select('data')
            .eq('slug', slug)
            .single();

        if (selectError) throw new Error(selectError.message);
        if (!existingData) return res.status(404).send('Product not found');
        const updatedData = existingData.data.filter(product => product.product_name !== product_name);

        const { error: updateError } = await db
            .from('nanastore')
            .update({ data: updatedData })
            .eq('slug', slug);

        if (updateError) throw new Error(updateError.message);

        res.status(200).json({ success: true, message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/products/delete-category', async (req, res) => {
    try {
        const { slug } = req.body;
        if (!slug) return res.status(400).send('Invalid input format');

        const { data: categoryToDelete, error: selectError } = await db
            .from('nanastore')
            .select('slug')
            .eq('slug', slug)
            .single();

        if (selectError) throw new Error(selectError.message);
        if (!categoryToDelete)return res.status(404).send('Category not found');

        // Hapus kategori berdasarkan slug
        const { error: deleteError } = await db
            .from('nanastore')
            .delete()
            .eq('slug', slug);

        if (deleteError) throw new Error(deleteError.message);

        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/products/update-category', upload.single('image'), async (req, res) => {
    try {
        const { slug, name, description, category } = req.body;
        
        if (!slug || !name || !description || !category) {
            return res.status(400).send('Invalid input format');
        }

        let logoUrl
        if (req.file) {
            const tempFilePath = path.join(__dirname, 'temp', `${Date.now()}-${req.file.originalname}`);
            fs.writeFileSync(tempFilePath, req.file.buffer);
            try {
                logoUrl = await TelegraPH(tempFilePath);
            } finally {
                fs.unlinkSync(tempFilePath);
            }
        }

        const { data, error } = await db.from('nanastore').update({ name, logo: logoUrl, description, category }).eq('slug', slug);
        if (error) throw new Error(error.message);
        res.status(200).json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3600
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
})