import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from './Alert';

const HeroSection = () => {
    const EndpointUrl = 'https://api.storenana.my.id/products';
    const [data, setData] = useState([]);
    const [groupedData, setGroupedData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(EndpointUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            setData(jsonData);
            setError(null);
        } catch (error) {
            setError('Gagal memuat data. Silakan coba lagi nanti.');
            console.error('Failed to fetch data:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    };
    
    const groupByCategory = (items) => {
        return items.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
        }, {});
    };
    
    const sortItemsAlphabetically = (items) => {
        return items.sort((a, b) => a.name.localeCompare(b.name));
    };
    
    const prioritizeAndSortCategories = (grouped) => {
        const priorityCategories = ["🔥Flash Sale🔥", "Games"];
        const bottomCategory = "Layanan Lainya";
        const ordered = {};

        priorityCategories.forEach(category => {
            if (grouped[category]) {
                ordered[category] = sortItemsAlphabetically(grouped[category]);
                delete grouped[category];
            }
        });

        const sortedKeys = Object.keys(grouped).sort();
        
        sortedKeys.forEach((key) => {
            if (key !== bottomCategory) {
                ordered[key] = sortItemsAlphabetically(grouped[key]);
            }
        });

        if (grouped[bottomCategory]) {
            ordered[bottomCategory] = sortItemsAlphabetically(grouped[bottomCategory]);
        }
        
        return ordered;
    };

    const filterItems = (items) => {
        if (!searchTerm) return items;
        return items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        if (data.length > 0) {
            const filteredData = filterItems(data);
            const grouped = groupByCategory(filteredData);
            const orderedGroupedData = prioritizeAndSortCategories(grouped);
            setGroupedData(orderedGroupedData);
        }
    }, [data, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto space-y-4">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <button
                        onClick={handleRefresh}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue text-white rounded-lg hover:opacity-90 transition-opacity">
                        <RefreshCcw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-skyblue min-h-screen py-8">
            <main className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="mb-8">
                    <div className="relative max-w-screen-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-skyblue focus:ring-2 focus:ring-blue focus:border-transparent pl-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-skyblue" />
                    </div>
                </div>
                {Object.entries(groupedData).length > 0 ? (
                    Object.entries(groupedData).map(([category, items]) => (
                        <div key={category} className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-skyblue text-blue">
                                {category}
                            </h2>
                            <section 
                                id={`category-${category.toLowerCase()}`} 
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {items.map((item) => (
                                    <Link 
                                        key={item.id} 
                                        to={`/order/${item.slug}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border border-skyblue hover:border-blue">
                                            <div className="aspect-square overflow-hidden">
                                                <img 
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                                    src={item.logo || 'https://placehold.co/500x500/png'} 
                                                    alt={item.name}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/500x500/png';
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-blue transition-colors">
                                                    {item.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </section>
                        </div>
                    ))
                ) : (
                    <div className="max-w-md mx-auto">
                        <Alert variant="warning">
                            <AlertDescription>
                                {searchTerm 
                                    ? 'Tidak ada produk yang sesuai dengan pencarian Anda.' 
                                    : 'Maaf, produk belum ditambahkan untuk saat ini.'}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HeroSection;