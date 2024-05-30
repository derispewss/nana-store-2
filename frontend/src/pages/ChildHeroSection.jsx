import AlertsError from '../components/AlertsError';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React, { useState, useEffect, useRef } from 'react';
import { FormatRupiah } from "@arismun/format-rupiah";

const ChildHeroSection = ({ data }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [input5, setInput5] = useState('');
    const [input6, setInput6] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [formOption, setFormOption] = useState('');
    const [loginVia, setLoginVia] = useState('');
    const [isViaLogin, setIsViaLogin] = useState(false);
    const selectedItemRef = useRef(null);

    useEffect(() => {
        if (data.slug && data.slug.includes('via-login')) {
            setFormOption('VILOG');
            setIsViaLogin(true);
        } else {
            setFormOption('VIA ID');
        }
    }, [data.slug]);

    useEffect(() => {
        if (selectedItem) {
            selectedItemRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedItem]);

    if (!data) {
        return <AlertsError />;
    }

    const getWhatsAppLink = () => {
        const phone = data.redirect_owner;
        let valueMessage;
        let message;
        if (formOption === 'VIA ID') {
            valueMessage = `Hallo kak. Saya berminat order. Berikut formatnya\n\nׂ➤ Nick : ${input3}\nׂ➤ Id (server) : ${input1} ( ${input2} )\nׂׂ➤ Order  : ${selectedItem?.product_name}\nׂ➤ Price : Rp ${<FormatRupiah value={selectedItem?.price}/>}\n➤ Payment : ${selectedOption}\n\n❗pastikan mengisi format dengan benar. kesalahan nick, id dan server bukan kesalahan admin.`
            message = encodeURIComponent(valueMessage);
            return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
        } else if (formOption === 'VILOG') {
            valueMessage = `Hallo kak. Saya berminat order. Berikut formatnya\n\n– Login Via : ${loginVia}\n– username/email : ${input4}\n– password : ${input5}\n– order : ${selectedItem?.product_name}\n– catatan : ${input6}\n– payment : ${selectedOption}\n\n❗pastikan mengisi dengan benar\n❗matikan v2l, agar saat pengerjaan vilog tidak perlu meminta kode\n❗di mainkan 2/3 rank/cl\n❗ini vilog bukan joki . jadi tidak dipastikan menang saat main`
            message = encodeURIComponent(valueMessage);
            return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
        }
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
                    <h2 className="text-2xl text-cokelat text-center font-bold mb-2">{data.name}</h2>
                    <small className="text-xl mx-4 py-2 rounded-md text-black text-center max-w-2xl">{data.description}</small>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 px-4">
                    {isViaLogin && (
                        <select
                            className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white hidden"
                            value={formOption}
                            onChange={(e) => setFormOption(e.target.value)}>
                            <option value="VILOG">VILOG</option>
                        </select>
                    )}
                    {(formOption === 'VILOG' || isViaLogin) && (
                        <>
                            <select
                                className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                                value={loginVia}
                                onChange={(e) => setLoginVia(e.target.value)}>
                                <option value="" disabled selected>Pilih Mau Login Via Apa ?</option>
                                <option value="Moonton">Moonton</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Google">Google</option>
                            </select>
                            {loginVia && (
                                <>
                                    <input 
                                        type="text" 
                                        placeholder="Masukan Email Or Username" 
                                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                                        value={input4}
                                        onChange={(e) => setInput4(e.target.value)} 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Masukan Password" 
                                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                                        value={input5}
                                        onChange={(e) => setInput5(e.target.value)} 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Catatan Untuk Owner" 
                                        className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                                        value={input6}
                                        onChange={(e) => setInput6(e.target.value)} 
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
                                </>
                            )}
                        </>
                    )}

                    {formOption === 'VIA ID' && !isViaLogin && (
                        <>
                            <input 
                                type="text" 
                                placeholder="ID" 
                                className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                                value={input1}
                                onChange={(e) => setInput1(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                placeholder="SERVER" 
                                className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-white"
                                value={input2}
                                onChange={(e) => setInput2(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                placeholder="NICKNAME" 
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
                        </>
                    )}
                </div>
                <div>
                    <h3 className="text-3xl font-semibold mb-6 px-4">Products</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                    {data.data.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => item.statusProducts && setSelectedItem(item)}
                            className={`rounded-lg shadow-lg p-6 bg-white text-gray-800 ${
                                item.statusProducts ? 'cursor-pointer hover:shadow-3xl transform transition-transform duration-300 hover:scale-105' : 'cursor-not-allowed opacity-50'
                            } ${selectedItem === item ? 'ring-2 ring-cokelat' : ''}`}>
                            <div className="text-center font-bold mb-2">
                                {item.product_name}
                            </div>
                            <div className="text-center text-lg text-gray-700">
                                {<FormatRupiah value={item.price}/>}
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
                <div ref={selectedItemRef} className="container mx-auto bg-white p-6 border-t border-gray-300 shadow-lg w-full rounded-t-lg">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center">
                            <div className="text-gray-800">
                                <h4 className="text-lg font-semibold">{selectedItem.product_name}</h4>
                                <p className="text-lg">{<FormatRupiah value={selectedItem.price}/>}</p>
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
