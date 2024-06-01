import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';
import { FormatRupiah } from "@arismun/format-rupiah";

const Products = ({ data }) => {
    const [products, setProducts] = useState(data);
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const slugs = data.map(product => product.slug);
        setFilterOptions([...new Set(slugs)]);
    }, [data]);

    const handleFilterChange = async (event) => {
        const slug = event.target.value;
        setSelectedSlug(slug);
        setShowAddForm(false);
        try {
            if (slug === '') {
                setProducts(data);
            } else {
                const response = await axios.get(`https://api.storenana.my.id/products/filter?slug=${slug}`);
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    };

    const handleUpdateProduct = async (slug, newData) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to update the product with new data?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        });
        if (result.isConfirmed) {
        try {
            await axios.post('https://api.storenana.my.id/products/update-data', {
                slug: slug,
                newData: newData
            });
            handleFilterChange({ target: { value: selectedSlug } });
            Swal.fire('Updated!', 'The product has been updated.', 'success');
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire('Error!', 'There was an error updating the product.', 'error');
        }
        } else {
            Swal.fire('Cancelled', 'The update was cancelled.', 'error');
        }
    };

    const handleDeleteProduct = async (slug, product_name) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to delete "${product_name}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
        try {
            await axios.post('https://api.storenana.my.id/products/delete-data', {
                slug: slug,
                product_name: product_name
            });
            handleFilterChange({ target: { value: selectedSlug } });
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        } else {
            Swal.fire('Cancelled', 'Your deletion was cancelled.', 'error');
        }
    };

    const handleAddProduct = async () => {
        setLoading(true)
        try {
            await axios.post('https://api.storenana.my.id/products/add-data', {
                slug: selectedSlug,
                newData: {
                    product_name: newProductName,
                    price: newProductPrice,
                    statusProducts: true
                }
            });
            handleFilterChange({ target: { value: selectedSlug } });
            setNewProductName('');
            setNewProductPrice('');
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setLoading(false)
        }
    };

    const ProductsTable = ({ products }) => {
        const [editProduct, setEditProduct] = useState(null);

        const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditProduct({ ...editProduct, [name]: name === 'statusProducts' ? value === 'true' : value });
        };
    
        const handleSave = (slug, product_name) => {
        handleUpdateProduct(slug, editProduct);
        setEditProduct(null);
        };

        return (
        <div className="table-wrapper overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-2 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                    <th className="px-2 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) =>
                product.data.map((p) => (
                    <tr key={p.product_name} className="bg-white border-t transition hover:bg-gray-50">
                    <td className="px-2 py-4">
                        {editProduct?.product_name === p.product_name ? (
                        <input
                            name="product_name"
                            value={editProduct.product_name}
                            onChange={handleEditChange}
                            className="border p-2 w-full rounded"
                        />
                        ) : (
                            p.product_name
                        )}
                    </td>
                    <td className="px-2 py-4">
                        {editProduct?.product_name === p.product_name ? (
                        <input
                            name="price"
                            value={editProduct.price}
                            onChange={handleEditChange}
                            className="border p-2 w-full rounded"
                        />
                        ) : (
                        <FormatRupiah value={p.price} />
                        )}
                    </td>
                    <td className="px-2 py-4 text-center">
                        {editProduct?.product_name === p.product_name ? (
                        <select
                            name="statusProducts"
                            value={editProduct.statusProducts ? 'true' : 'false'}
                            onChange={handleEditChange}
                            className="border p-2 w-full rounded"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        ) : (
                        p.statusProducts ? 'Active' : 'Inactive'
                        )}
                    </td>
                    <td className="px-2 py-4 text-center">
                        {editProduct?.product_name === p.product_name ? (
                        <button
                            onClick={() => handleSave(product.slug, p.product_name)}
                            className="text-green-500 flex items-center justify-center"
                        >
                            <FaPlus className="mr-1" /> Save
                        </button>
                        ) : (
                        <div className="flex justify-center space-x-2">
                            <button
                            onClick={() => setEditProduct(p)}
                            className="text-blue-500 flex items-center"
                            >
                            <FaEdit className="mr-1" /> Edit
                            </button>
                            <button
                            onClick={() => handleDeleteProduct(product.slug, p.product_name)}
                            className="text-red-500 flex items-center"
                            >
                            <FaTrash className="mr-1" /> Delete
                            </button>
                        </div>
                        )}
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        );
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800">Products</h2>
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <label htmlFor="slugFilter" className="text-gray-700 font-medium">
            Filter Products
            </label>
            <select
            id="slugFilter"
            className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500 transition duration-200"
            value={selectedSlug}
            onChange={handleFilterChange}
            >
            <option value="">All Products</option>
            {filterOptions.map((slug) => (
                <option key={slug} value={slug}>
                {slug}
                </option>
            ))}
            </select>
            <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
            >
            {showAddForm ? 'Cancel' : <FaPlus className="mr-1" />}
            </button>
        </div>
        {showAddForm && (
            <div className="mb-4 md:mb-6 bg-white p-4 rounded-lg shadow-lg space-y-4">
            <input
                type="text"
                placeholder="Enter product name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full border p-2 rounded-lg"
            />
            <input
                type="text"
                placeholder="Enter product price"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="w-full border p-2 rounded-lg"
            />
            <button
                onClick={handleAddProduct}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center"
            >
                {loading ? <ClipLoader color="#fff" size={24} /> : 'Save'}
            </button>
            </div>
        )}
        <ProductsTable
            products={products}
            handleUpdateProduct={handleUpdateProduct}
            handleDeleteProduct={handleDeleteProduct}
        />
        </div>
    );
};

export default Products;