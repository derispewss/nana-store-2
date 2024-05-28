import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

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
            text: `Are you sure you want to delete ${product_name}?`,
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
            <div className="table-wrapper overflow-x-auto">
            <table className="min-w-full bg-white border">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="w-1/3 px-4 py-2">Name</th>
                        <th className="w-1/3 px-4 py-2">Price</th>
                        <th className="w-1/6 px-4 py-2">Status</th>
                        <th className="w-1/6 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        product.data.map((p) => (
                            <tr key={p.product_name} className="border-t">
                                <td className="border px-4 py-2">
                                    {editProduct?.product_name === p.product_name ? (
                                        <input
                                            name="product_name"
                                            value={editProduct.product_name}
                                            onChange={handleEditChange}
                                            className="border p-1 w-full"
                                        />
                                    ) : (
                                        p.product_name
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editProduct?.product_name === p.product_name ? (
                                        <input
                                            name="price"
                                            value={editProduct.price}
                                            onChange={handleEditChange}
                                            className="border p-1 w-full"
                                        />
                                    ) : (
                                        p.price
                                    )}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {editProduct?.product_name === p.product_name ? (
                                        <select
                                            name="statusProducts"
                                            value={editProduct.statusProducts ? 'true' : 'false'}
                                            onChange={handleEditChange}
                                            className="border p-1 w-full"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    ) : (
                                        p.statusProducts ? 'Active' : 'Inactive'
                                    )}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {editProduct?.product_name === p.product_name ? (
                                        <button onClick={() => handleSave(product.slug, p.product_name)} className="flex text-green-500">
                                            <FaPlus className="mr-1" /> Save
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditProduct(p)} className="flex text-blue-500 mr-2">
                                                <FaEdit /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.slug, p.product_name)} className="flex text-red-500">
                                                <FaTrash /> Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>

            </div>
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="mb-4 flex items-center">
                <label className="block text-gray-700 text-sm font-bold mr-2" htmlFor="slugFilter">
                    Filter Products
                </label>
                <select 
                    id="slugFilter" 
                    className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" 
                    value={selectedSlug} 
                    onChange={handleFilterChange}>
                    <option value="">All Products</option>
                    {filterOptions.map(slug => (
                        <option key={slug} value={slug}>
                            {slug}
                        </option>
                    ))}
                </select>
                <button onClick={() => setShowAddForm(!showAddForm)} className="ml-2 flex bg-blue-500 text-white px-6 py-2 rounded">
                    {showAddForm ? 'Cancel' : <><FaPlus className="mr-1" /></>}
                </button>
            </div>
            {showAddForm && (
                <div className="mb-4 flex-col items-center sm:flex-col">
                <input
                    type="text"
                    placeholder="Enter product name"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="border p-2 mr-2 mb-2"
                />
                <input
                    type="text"
                    placeholder="Enter product price"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="border p-2 mr-2 mb-2"
                />
                <button onClick={handleAddProduct} className="flex bg-green-500 text-white px-6 py-2 rounded">
                {loading ? <ClipLoader color="#fff" size={24} /> : 'Save'}
                </button>
            </div>
        )}
        <ProductsTable products={products} />
    </div>
);
};

export default Products;