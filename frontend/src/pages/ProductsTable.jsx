import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FormatRupiah } from "@arismun/format-rupiah";
import axios from 'axios';

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedName, setSelectedName] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://api.storenana.my.id/products');
                setProducts(response.data);
                const slug = response.data.map(product => product.slug);
                setFilterOptions([...new Set(slug)]);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleFilterChange = async (event) => {
        const slug = event.target.value;
        setSelectedName(slug);
        if (slug === '') {
            const response = await axios.get('https://api.storenana.my.id/products');
            setProducts(response.data);
        } else {
            const response = await axios.get(`https://api.storenana.my.id/products/filter?slug=${slug}`);
            setProducts(response.data);
        }
    };

    return (
        <div className="bg-skyblue">
            <Navbar />
            <div className="min-h-screen px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col">
                        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between">
                            <p className="mb-2 sm:mb-0 text-lg font-medium">Filter Products</p>
                            <select
                                value={selectedName}
                                onChange={handleFilterChange}
                                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">All Products</option>
                                {filterOptions.map((name, index) => (
                                    <option key={index} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="m-4 sm:m-0 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    {products.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Product Name
                                                        </th>
                                                        <th scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Price
                                                        </th>
                                                        <th scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell">
                                                            Status
                                                        </th>
                                                        <th scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {products.map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            {item.data.map((product, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm text-gray-900">{product.product_name}</div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm text-gray-900"><FormatRupiah value={product.price} /></div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap sm:table-cell">
                                                                        <span
                                                                            className={product.statusProducts ? 'bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium' : 'bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium'}>
                                                                            {product.statusProducts ? 'Tersedia' : 'Tidak Tersedia'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap sm:table-cell">
                                                                        {product.statusProducts && (
                                                                            <NavLink 
                                                                                to={`/order/${item.slug}`}
                                                                                label="Beli Sekarang"
                                                                                icon={<FaShoppingCart />}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-white">No products found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const NavLink = ({ to, label, icon }) => {
    return (
        <Link to={to} className="flex items-center p-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
            <span className="mr-3">{icon}</span>
            {label}
        </Link>
    );
};

export default ProductsTable;
