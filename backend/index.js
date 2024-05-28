require('dotenv').config()
const express = require('express');
const crypto = require('crypto');
const cors =  require('cors');
const multer = require('multer');
const db = require('./config/supabase')
const { firestore, admin } = require('./config/firebase')
const { sendClient } = require('./config/emailClient')

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
    const { email } = req.body;
    try {
        const { data: existingUser } = await db.from('otp_tokens').select('*').eq('user_login', email).single();
        if (existingUser) {
            const otp = generateOTP().toString();
            const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');
            await db.from('otp_tokens').update({ token: hashedToken }).eq('user_login', email);
            await sendClient(email, otp, hashedToken)
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

// Endpoint untuk mengunggah gambar ke Firebase Storage
app.post('/upload-logo', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const buffer = req.file.buffer;
        const storagePath = `images/${Date.now()}-${req.file.originalname}`;
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
    
        res.status(201).json({ imageUrl: publicUrl });
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
        const querySnapshot = await firestore.collection('nanastore').get();
        const data = querySnapshot.docs.map(doc => {
            const docData = doc.data();
            const { name, logo, description, category, slug, redirect_owner, data } = docData; 
            return { name, logo, description, category, slug, redirect_owner, data };
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/products/filter', async (req, res) => {
    const { slug } = req.query;
    if (!slug) {
        return res.status(400).send('Slug query parameter is required');
    }
    try {
        const querySnapshot = await firestore.collection('nanastore').where('slug', '==', slug).get();
        if (querySnapshot.empty) {
            return res.status(404).send('No matching documents');
        }
        const data = querySnapshot.docs.map(doc => {
            const docData = doc.data();
            const { name, logo, description, category, slug, redirect_owner, data } = docData; 
            return { name, logo, description, category, slug, redirect_owner, data };
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const docId = req.params.id;
        const doc = await firestore.collection('nanastore').doc(docId).get();
        if (!doc.exists) {
            res.status(404).json({ success: false, message: "name not found" });
        } else {
            res.status(200).json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/products/upload-data', async (req, res) => {
    try {
        const { name, logo, description, category, slug, redirect_owner, data, token } = req.body;
        const { data: responseToken } = await db.from('otp_tokens').select('*').eq('access_token', token).single();
        if (!token || !name || !logo || !description || !category || !slug || !redirect_owner || !Array.isArray(data) || data.length === 0) {
            return res.status(400).send('token is required');
        }
        if (token === responseToken.access_token) {
            for (let item of data) {
                if (!item.product_name || !item.price) {
                    return res.status(400).send('Each item in data array must have product_name and price');
                }
            }
            // Check if document with the same name already exists
            const existingDoc = await firestore.collection('nanastore').doc(name).get();
            if (existingDoc.exists) {
                return res.status(400).json({ success: false, message: 'products already exists' });
            }
            // Save unique data to Firestore
            const docRef = firestore.collection('nanastore').doc(name);
            await docRef.set({ 
                name,
                logo, 
                description, 
                category, 
                slug,
                redirect_owner,
                data: data.map(item => ({ ...item, statusProducts: true }))
            });
            res.status(201).json({ success: true, message: `Data uploaded successfully with id ${docRef.id}`});
        } else {
            res.status(400).json({ success: false, message: 'Token is invalid' })
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/products/add-data', async (req, res) => {
    try {
        const { slug, newData } = req.body;
        if (!slug || !newData) return res.status(400).send('Invalid input format');
        const querySnapshot = await firestore.collection('nanastore').where('slug', '==', slug).get();
        if (querySnapshot.empty) return res.status(404).send('Document not found');
        const doc = querySnapshot.docs[0];
        let existingData = doc.data().data || [];
        existingData.push(newData);
        await doc.ref.update({
            data: existingData
        });
        res.status(200).json({ success: true, message: 'Data added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/products/update-data', async (req, res) => {
    try {
        const { slug, newData } = req.body;
        if (!slug || !newData) return res.status(400).send('Invalid input format');
        const querySnapshot = await firestore.collection('nanastore').where('slug', '==', slug).get();
        if (querySnapshot.empty) return res.status(404).send('Product not found');
        const doc = querySnapshot.docs[0];
        let existingData = doc.data().data || [];
        const updatedData = existingData.map(product => {
            if (product.product_name === newData.product_name) {
                return { ...product, ...newData };
            }
            return product;
        });
        await doc.ref.update({
            data: updatedData
        });
        res.status(200).json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/products/delete-data', async (req, res) => {
    try {
        const { slug, product_name } = req.body;
        if (!slug || !product_name) return res.status(400).send('Invalid input format');
        const querySnapshot = await firestore.collection('nanastore').where('slug', '==', slug).get();
        if (querySnapshot.empty) return res.status(404).send('Product not found');
        const doc = querySnapshot.docs[0];
        let existingData = doc.data().data || [];
        const updatedData = existingData.filter(product => product.product_name !== product_name);
        await doc.ref.update({
            data: updatedData
        });
        res.status(200).json({ success: true, message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/products/delete-slug', async (req, res) => {
    try {
        const { slug } = req.body;
        if (!slug) return res.status(400).send('Invalid input format');
        const querySnapshot = await firestore.collection('nanastore').where('slug', '==', slug).get();
        if (querySnapshot.empty) return res.status(404).send('Product not found');
        const batch = firestore.batch();
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        res.status(200).json({ success: true, message: 'Document(s) deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.use((req, res, next) => {
    res.status(404).send('Maaf, Halaman yang anda kunjungi tidak tersedia di sistem kami.');
});

const PORT = process.env.PORT || 3600
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
})