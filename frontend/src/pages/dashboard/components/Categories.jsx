import React, { useState, useEffect } from 'react';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const Categories = () => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    setFormData({
      name: '',
      logo: null,
      description: '',
      category: '',
      slug: '',
      redirect_owner: '6282229025162',
      data: [{ product_name: '', price: 0 }],
      token: localStorage.getItem('access_token')
    });
  }, []);

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!formData) return;
    setFormData({ ...formData, logo: URL.createObjectURL(imageFile) });
    const formDataUpload = new FormData();
    formDataUpload.append('image', imageFile);
    try {
      const response = await axios.post('https://api.storenana.my.id/upload-logo', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setFormData({ ...formData, logo: response.data.imageUrl });
      iziToast.success({
        title: 'Success',
        message: 'Logo uploaded successfully',
        position: 'topRight'
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      iziToast.error({
        title: 'Error',
        message: 'Failed to upload logo',
        position: 'topRight'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = formData.data.map(({ product_name, price }) => ({ product_name, price }));

    const payload = {
      ...formData,
      slug: generateSlug(formData.name),
      data: newData
    };

    try {
      const response = await axios.post('https://api.storenana.my.id/products/upload-data', payload);
      console.log('Upload successful:', response.data);
      iziToast.success({
        title: 'Success',
        message: 'Data uploaded successfully',
        position: 'topRight',
        onClosed: () => window.location.reload(false) // Delay 5 seconds before reloading the page
      });
    } catch (error) {
      console.error('Upload failed:', error);
      iziToast.error({
        title: 'Error',
        message: 'Failed to upload data',
        position: 'topRight',
        onClosed: () => window.location.reload(false) // Delay 5 seconds before reloading the page
      });
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newData = [...formData.data];
    newData[index][name] = value;
    setFormData({ ...formData, data: newData });
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      data: [...formData.data, { product_name: '', price: 0 }]
    });
  };

  const handleRemoveProduct = (index) => {
    const newData = formData.data.filter((_, i) => i !== index);
    setFormData({ ...formData, data: newData });
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl text-center mb-4 py-2">Upload Products</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData ? formData.name : ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        <div className="flex items-center space-x-2">
          {formData && formData.logo && <img src={formData.logo} alt="Preview" className="w-20 h-20 object-contain" />}
          <input type="file" onChange={handleImageUpload} accept="image/*" className="w-full" />
        </div>
        <textarea name="description" value={formData ? formData.description : ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        <select name="category" value={formData ? formData.category : ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
          <option value="" disabled selected>Select Category</option>
          <option value="Games">Games</option>
          <option value="Voucher">Voucher</option>
          <option value="Aplikasi Premium">Aplikasi Premium</option>
          <option value="Pulsa">Pulsa</option>
          <option value="Entertaiment">Entertaiment</option>
          <option value="Layanan Lainya">Layanan Lainya</option>
        </select>
        <input type="text" name="slug" value={formData ? generateSlug(formData.name) : ''} readOnly placeholder="Slug" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        <input type="text" name="redirect_owner" value={formData ? formData.redirect_owner : ''} readOnly onChange={(e) => setFormData({ ...formData, redirect_owner: e.target.value })} placeholder="Redirect Owner" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
        {formData && formData.data.map((product, index) => (
          <div key={index} className="space-y-2">
            <input type="text" name="product_name" value={product.product_name} onChange={(e) => handleChange(e, index)} placeholder="Product Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
            <input type="number" name="price" value={product.price} onChange={(e) => handleChange(e, index)} placeholder="Price" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
            <div className="flex items-center">
              <button type="button" onClick={() => handleRemoveProduct(index)} className="ml-auto px-3 py-1 bg-red-500 text-white rounded-md">Remove</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddProduct} className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Product</button>
        <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Upload Data</button>
      </form>
    </div>
  );
};

export default Categories;