import React, { useState, useEffect } from 'react';
import axios from 'axios';
import iziToast from 'izitoast';
import { ClipLoader } from 'react-spinners';
import 'izitoast/dist/css/iziToast.min.css';

const Categories = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setFormData({ ...formData, logo: imageFile });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.logo || !formData.description || !formData.category || !formData.redirect_owner || !formData.token) {
      iziToast.error({
        title: 'Error',
        message: 'All fields are required',
        position: 'topRight'
      });
      return;
    }

    const newData = formData.data.map(({ product_name, price }) => ({ product_name, price }));

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('logo', formData.logo);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('slug', generateSlug(formData.name));
    payload.append('redirect_owner', formData.redirect_owner);
    payload.append('data', JSON.stringify(newData));
    payload.append('token', formData.token);

    try {
      setLoading(true);
      const response = await axios.post('https://api.storenana.my.id/products/upload-data', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Upload successful:', response.data);
      iziToast.success({
        title: 'Success',
        message: 'Data uploaded successfully',
        position: 'topRight',
        onClosed: () => window.location.reload(false)
      });
    } catch (error) {
      console.error('Upload failed:', error);
      iziToast.error({
        title: 'Error',
        message: error.response.data || 'Failed to upload data',
        position: 'topRight',
        onClosed: () => window.location.reload(false)
      });
    } finally {
      setLoading(false);
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
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Upload Products</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          value={formData ? formData.name : ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Product Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
          required
        />
        <div className="flex items-center space-x-4">
          {formData && formData.logo && (
            <img
              src={URL.createObjectURL(formData.logo)}
              alt="Preview"
              className="w-20 h-20 object-contain rounded-lg shadow-sm"
            />
          )}
          <input
            type="file"
            name="logo"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
            required
          />
        </div>
        <textarea
          name="description"
          value={formData ? formData.description : ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
          required
        />
        <select
          name="category"
          value={formData ? formData.category : ''}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
          required
        >
          <option value="" disabled>Select Category</option>
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
          name="slug"
          value={formData ? generateSlug(formData.name) : ''}
          readOnly
          placeholder="Slug"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500 transition duration-200"
          required
        />
        <input
          type="text"
          name="redirect_owner"
          value={formData ? formData.redirect_owner : ''}
          readOnly
          onChange={(e) => setFormData({ ...formData, redirect_owner: e.target.value })}
          placeholder="Redirect Owner"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500 transition duration-200"
          required
        />
        {formData && formData.data.map((product, index) => (
          <div key={index} className="space-y-4 border-b border-gray-200 pb-4">
            <input
              type="text"
              name="product_name"
              value={product.product_name}
              onChange={(e) => handleChange(e, index)}
              placeholder="Product Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
              required
            />
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={(e) => handleChange(e, index)}
              placeholder="Price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddProduct}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Product
        </button>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : 'Upload Data'}
        </button>
      </form>
    </div>
  );
};

export default Categories;

