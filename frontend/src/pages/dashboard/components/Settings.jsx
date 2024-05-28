import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const Settings = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('https://api.storenana.my.id/get-banners');
                setImages(response.data);
            } catch (error) {
                console.error('Gagal mendapatkan daftar gambar:', error);
            }
        };
        fetchImages();
    }, []);

    const handleImageChange = (event) => {
        const image = event.target.files[0];
        setSelectedImage(image);
        setError('');
    };

    const handleUploadImage = async () => {
        if (!selectedImage) {
            setError('Please select an image file');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await axios.post('https://api.storenana.my.id/upload-banner', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Image uploaded successfully:', response.data);
            setSelectedImage(null);
            const refreshedImages = await axios.get('https://api.storenana.my.id/get-banners');
            setImages(refreshedImages.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="bg-white border rounded-lg overflow-hidden">
                        <img src={image.imageUrl} alt={image.name} className="w-full h-auto object-cover" />
                        <div className="p-4">
                            <p className="text-gray-600 text-sm">Slide {index}</p>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button onClick={handleUploadImage} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2 w-full">
                                {loading ? <ClipLoader color="#ffffff" loading={loading} size={16} /> : 'Replace'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
