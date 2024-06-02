import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to save changes.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, save it!'
            });

            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('slug', editedContent.slug);
                formData.append('name', editedContent.name);
                formData.append('description', editedContent.description);
                formData.append('category', editedContent.category);
                if (selectedImage) {
                    formData.append('image', selectedImage);
                }

                const response = await axios.put('https://api.storenana.my.id/products/update-category', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    setContent(editedContent);
                    setEditMode(false);
                    Swal.fire(
                        'Saved!',
                        'Content saved successfully.',
                        'success'
                    );
                }
            }
        } catch (error) {
            console.error('Error saving content:', error);
            Swal.fire(
                'Error!',
                'Failed to save content.',
                'error'
            );
        }
    };

    const handleCancel = () => {
        setEditedContent(content);
        setEditMode(false);
    };

    const handleDelete = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this content.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            if (result.isConfirmed) {
                const response = await axios.delete('https://api.storenana.my.id/products/delete-category', {
                    data: { slug: selectedSlug }
                });
                if (response.data.success) {
                    setContent(null);
                    setSelectedSlug('');
                    Swal.fire(
                        'Deleted!',
                        'Content deleted successfully.',
                        'success'
                    );
                }
            }
        } catch (error) {
            console.error('Error deleting content:', error);
            Swal.fire(
                'Error!',
                'Failed to delete content.',
                'error'
            );
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

        // Preview image
        const reader = new FileReader();
        reader.onload = () => {
            setEditedContent(prevState => ({
                ...prevState,
                logo: reader.result
            }));
        };
        reader.readAsDataURL(imageFile);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                    <select
                        value={selectedSlug}
                        onChange={handleSlugChange}
                        className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                        <option value="" selected disabled>Pilih Category Berdasarkan Slug</option>
                        {data.map((item, index) => (
                            <option key={index} value={item.slug}>{item.slug}</option>
                        ))}
                    </select>
                    {content && (
                        <div className="mt-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-800">{content.name}</h2>
                            <img src={editedContent.logo} alt="Product Logo" className="mt-4 rounded-md w-32 h-32 object-cover mx-auto shadow-md" />
                            <p className="mt-4 text-gray-600">{content.description}</p>
                            {editMode ? (
                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-center">
                                        <label className="w-64 flex flex-col items-center px-4 py-2 bg-blue-50 text-blue-500 rounded-lg shadow-md tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                                            <span className="text-base leading-normal">Choose File</span>
                                            <input type='file' onChange={handleImageChange} className="hidden" />
                                        </label>
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        className="block w-full bg-gray-200 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    >
                                        <option value="" disabled selected>Select Category</option>
                                        <option value="🔥Flash Sale🔥">🔥Flash Sale🔥</option>
                                        <option value="Games">Games</option>
                                        <option value="Voucher">Voucher</option>
                                        <option value="Aplikasi Premium">Aplikasi Premium</option>
                                        <option value="Pulsa">Pulsa</option>
                                        <option value="Entertaiment">Entertaiment</option>
                                        <option value="Layanan Lainya">Layanan Lainya</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder='Edit category name'
                                        value={editedContent.name}
                                        onChange={handleFieldChange}
                                        className="block w-full bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <textarea
                                        type="text"
                                        name="description"
                                        placeholder='Edit description'
                                        value={editedContent.description}
                                        onChange={handleFieldChange}
                                        className="block w-full bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <div className="flex flex-col gap-2 mt-4">
                                        <button onClick={handleSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">Save</button>
                                        <button onClick={handleCancel} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-200">Cancel</button>
                                        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200">Delete</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 flex justify-center">
                                    <button onClick={handleEdit} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">Edit</button>
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