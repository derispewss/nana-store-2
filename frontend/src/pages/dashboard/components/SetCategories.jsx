import React, { useState, useEffect } from 'react';
import axios from 'axios';
import izitoast from 'izitoast';

const SetCategories = ({ data }) => {
    const [selectedSlug, setSelectedSlug] = useState('');
    const [content, setContent] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`https://api.storenana.my.id/products/filter?slug=${selectedSlug}`);
                setContent(response.data[0]);
                setEditedContent(response.data[0]);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        if (selectedSlug) {
            fetchContent();
        }
    }, [selectedSlug]);

    const handleSlugChange = (e) => {
        setSelectedSlug(e.target.value);
        setEditMode(false);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put('https://api.storenana.my.id/products/update-category', editedContent);
            if (response.data.success) {
                setContent(editedContent);
                setEditMode(false);
                izitoast.success({
                    title: 'Success',
                    message: 'Content saved successfully!',
                });
            }
        } catch (error) {
            console.error('Error saving content:', error);
            izitoast.error({
                title: 'Error',
                message: 'Failed to save content.',
            });
        }
    };

    const handleCancel = () => {
        setEditedContent(content);
        setEditMode(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete('https://api.storenana.my.id/products/delete-category', {
                data: { slug: selectedSlug }
            });
            if (response.data.success) {
                setContent(null);
                setSelectedSlug('');
                izitoast.success({
                    title: 'Success',
                    message: 'Content deleted successfully!',
                });
            }
        } catch (error) {
            console.error('Error deleting content:', error);
            izitoast.error({
                title: 'Error',
                message: 'Failed to delete content.',
            });
        }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditedContent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setEditedContent(prevState => ({
            ...prevState,
            category: e.target.value
        }));
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setSelectedImage(imageFile);
        uploadImage(imageFile);
    };

    const uploadImage = async (imageFile) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            const response = await axios.post('https://api.storenana.my.id/upload-logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.imageUrl) {
                const updatedImageUrl = response.data.imageUrl;
                setEditedContent(prevState => ({
                    ...prevState,
                    logo: updatedImageUrl
                }));
                izitoast.success({
                    title: 'Success',
                    message: 'Image uploaded successfully!',
                });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            izitoast.error({
                title: 'Error',
                message: 'Failed to upload image.',
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    <select
                        value={selectedSlug}
                        onChange={handleSlugChange}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Select Slug</option>
                        {data.map((item, index) => (
                            <option key={index} value={item.slug}>{item.slug}</option>
                        ))}
                    </select>
                    {content && (
                        <div className="mt-4">
                            <h2 className="text-xl font-bold text-center">{content.name}</h2>
                            <img src={content.logo} alt="Product Logo" className="mt-2 rounded-md w-32 h-32 object-cover mx-auto" />
                            <p className="mt-2 text-center">{content.description}</p>
                            {editMode ? (
                                <div className="mt-4">
                                    <div className="mt-2 mb-4 flex justify-center items-center">
                                        <label className="w-64 flex flex-col items-center px-2 py-2 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                                            <span className="">Choose File</span>
                                            <input type='file' onChange={handleImageChange} className="hidden" />
                                        </label>
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        className="mt-2 mr-2 bg-gray-200 py-2 block text-center w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        <option value="" disabled selected>Select Category</option>
                                        <option value="Games">Games</option>
                                        <option value="Voucher">Voucher</option>
                                        <option value="Aplikasi Premium">Aplikasi Premium</option>
                                        <option value="Pulsa">Pulsa</option>
                                        <option value="Entertaiment">Entertaiment</option>
                                        <option value="Layanan Lainya">Layanan Lainya</option>
                                    </select>
                                    <input type="text" name="name" placeholder='edit category name' value={editedContent.name} onChange={handleFieldChange} className="bg-gray-200 py-2 mt-2 text-center block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                    <input type="text" name="description" placeholder='edit description' value={editedContent.description} onChange={handleFieldChange} className="bg-gray-200 py-2 mt-2 text-center block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                    <div className="flex justify-center mt-4">
                                        <button onClick={handleSave} className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save</button>
                                        <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center mt-4">
                                    <button onClick={handleEdit} className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetCategories;

