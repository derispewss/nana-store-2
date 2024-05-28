import AlertsError from '../components/AlertsError';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React, { useState } from 'react';

const ChildHeroSection = ({ data }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    if (!data) {
        return <AlertsError />;
    }

    const getWhatsAppLink = () => {
        const phone = data.redirect_owner;
        const valueMessage = `Hallo kak. Saya berminat order. Berikut formatnya\n\nׂ➤ Nick : ${input3}\nׂ➤ Id (server) : ${input1} ( ${input2} )\nׂׂ➤ Order  : ${selectedItem?.product_name}\nׂ➤ Price : Rp ${selectedItem?.price.toLocaleString('id-ID')}\n➤ Payment : ${selectedOption}\n\n❗pastikan mengisi format dengan benar. kesalahan nick, id dan server bukan kesalahan admin.`
        const message = encodeURIComponent(valueMessage);
        return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    };

    return (
        <div className="w-full bg-cream min-h-screen flex flex-col justify-between text-white">
            <Navbar />
            <div className="container mx-auto py-10 flex-grow">
                <div className="flex flex-col items-center mb-8">
                    <img 
                        src={data.logo} 
                        alt={data.name} 
                        className="object-cover rounded-full w-32 h-32 mb-4 border-4 border-white shadow-lg" 
                    />
                    <h2 className="text-4xl text-[#3a2625] font-bold mb-2">{data.name}</h2>
                    <p className="text-xl text-center max-w-2xl">{data.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 px-4">
                    <input 
                        type="text" 
                        placeholder="Enter your location" 
                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Enter your location server ( jika di butuhkan )" 
                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                        value={input2}
                        onChange={(e) => setInput2(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Enter your nickname" 
                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                        value={input3}
                        onChange={(e) => setInput3(e.target.value)} 
                    />
                    <select
                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}>
                        <option value="" disabled selected>Choose Your Payment</option>
                        <option value="Dana">Dana</option>
                        <option value="GoPay">GoPay</option>
                        <option value="OVO">OVO</option>
                        <option value="QRIS">QRIS</option>
                        <option value="Transfer Bank">Transfer Bank</option>
                    </select>
                </div>
                <div>
                    <h3 className="text-3xl font-semibold mb-6 px-4">Products</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                        {data.data.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => item.statusProducts && setSelectedItem(item)}
                                className={`rounded-lg shadow-lg p-6 bg-white text-gray-800 ${
                                    item.statusProducts ? 'cursor-pointer hover:shadow-2xl transform transition-transform duration-300 hover:scale-105' : 'cursor-not-allowed opacity-50'
                                } ${selectedItem === item ? 'ring-4 ring-white' : ''}`}>
                                <div className="text-center font-bold mb-2">
                                    {item.product_name}
                                </div>
                                <div className="text-center text-lg text-gray-700">
                                    Rp {item.price.toLocaleString('id-ID')}
                                </div>
                                {!item.statusProducts && (
                                    <div className="text-center text-red-500 mt-2">
                                        Produk Tidak Tersedia
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedItem && (
                <div className="container mx-auto bg-white p-6 border-t border-gray-300 shadow-lg w-full rounded-t-lg">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center">
                            <div className="text-gray-800">
                                <h4 className="text-lg font-semibold">{selectedItem.product_name}</h4>
                                <p className="text-lg">Rp {selectedItem.price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="px-4 py-2 mr-4 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300">
                                Cancel
                            </button>
                            <a 
                                href={getWhatsAppLink()} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
                                Pesan Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            )}
            <Footer data={data} />
        </div>
    );
};

export default ChildHeroSection;
