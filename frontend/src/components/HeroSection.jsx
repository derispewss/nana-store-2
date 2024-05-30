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
    
    const prioritizeCategory = (grouped) => {
        const priorityCategory = "🔥Flash Sale🔥";
        const gamesCategory = "Games";
        const ordered = {};
        
        if (grouped[priorityCategory]) {
            ordered[priorityCategory] = grouped[priorityCategory];
        }
        if (grouped[gamesCategory]) {
            ordered[gamesCategory] = grouped[gamesCategory];
        }
        
        for (const [key, value] of Object.entries(grouped)) {
            if (key !== priorityCategory && key !== gamesCategory) {
                ordered[key] = value;
            }
        }
        
        return ordered;
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        if (data.length > 0) {
            const grouped = groupByCategory(data);
            const orderedGroupedData = prioritizeCategory(grouped);
            setGroupedData(orderedGroupedData);
        }
    }, [data]);
    
    return (
        <div>
            <main className="container mx-auto md:px-16 min-h-screen">
                {Object.entries(groupedData).length > 0 ? (
                    Object.entries(groupedData).map(([category, items]) => (
                        <div key={category} className="card rounded-md p-4 my-4">
                            <h2 className="m-5 px-3 py-2 bg-gray-100 border-l-4 border-l-yellow-950 font-semibold">{category}</h2>
                            <section id={`category-${category.toLowerCase()}`} className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                {items.map((item) => (
                                <div key={item.id} className="rounded-lg duration-300 hover:scale-105 overflow-hidden text-center bg-gray-200 border shadow-md flex flex-col">
                                    <Link to={`/order/${item.slug}`}>
                                        <div className="overflow-hidden">
                                            <img className='w-full h-45 object-cover rounded-t-md transition-transform duration-300 hover:scale-110' src={item.logo} alt={item.name} />
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
