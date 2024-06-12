import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const EndpointUrl = 'https://api.storenana.my.id/products';
    const [data, setData] = useState([]);
    const [groupedData, setGroupedData] = useState({});
    
    const fetchData = async () => {
        try {
            const response = await fetch(EndpointUrl);
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Failed to fetch data:', error.message);
        }
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
        
        // Add priority categories at the beginning
        priorityCategories.forEach(category => {
            if (grouped[category]) {
                ordered[category] = sortItemsAlphabetically(grouped[category]);
                delete grouped[category];
            }
        });

        // Sort other categories alphabetically
        const sortedKeys = Object.keys(grouped).sort();
        
        sortedKeys.forEach((key) => {
            if (key !== bottomCategory) {
                ordered[key] = sortItemsAlphabetically(grouped[key]);
            }
        });

        // Add the bottom category at the end
        if (grouped[bottomCategory]) {
            ordered[bottomCategory] = sortItemsAlphabetically(grouped[bottomCategory]);
        }
        
        return ordered;
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        if (data.length > 0) {
            const grouped = groupByCategory(data);
            const orderedGroupedData = prioritizeAndSortCategories(grouped);
            setGroupedData(orderedGroupedData);
        }
    }, [data]);
    
    return (
        <div>
            <main className="container mx-auto md:px-16 min-h-screen">
                {Object.entries(groupedData).length > 0 ? (
                    Object.entries(groupedData).map(([category, items]) => (
                        <div key={category} className="card rounded-md p-4 my-4">
                            <h2 className="m-5 px-3 py-2 bg-gray-200 border-l-4 border-l-cokelat font-semibold">{category}</h2>
                            <section id={`category-${category.toLowerCase()}`} className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                {items.map((item) => (
                                <div key={item.id} className="rounded-lg duration-300 hover:scale-105 overflow-hidden text-center bg-gray-200 border shadow-md flex flex-col">
                                    <Link to={`/order/${item.slug}`}>
                                        <div className="overflow-hidden">
                                            <img className='w-full h-45 object-cover rounded-t-md transition-transform duration-300 hover:scale-110' src={item.logo || 'https://placehold.co/500x500/png'} alt={item.name} />
                                        </div>
                                        <div className="md:py-4 flex-col flex justify-center items-center">
                                            <div className="text-sm md:text-sm font-semibold text-gray-800 mb-2">{item.name}</div>
                                        </div>
                                    </Link>
                                </div>
                                ))}
                            </section>
                        </div>
                    ))
                ) : (
                    <div className="text-center bg-white rounded-lg p-4 m-4">Maaf, product belum ditambahkan untuk saat ini.</div>
                )}
            </main>
        </div>
    )
}

export default HeroSection;