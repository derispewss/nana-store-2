import { useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Home = () => {
    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin');
        if (isLogin) {
            const hasSeenLoginAlert = localStorage.getItem('hasSeenLoginAlert');
            if (!hasSeenLoginAlert) {
                Swal.fire({
                    title: 'Welcome back',
                    text: `Welcome back, ${isLogin}!`,
                    icon: 'success'
                });
            localStorage.setItem('hasSeenLoginAlert', true);
            }
        }
    }, []);
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Home</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <Link to="/" className="flex items-center">
                        <FaExternalLinkAlt className="text-3xl text-gray-500 mr-2" />
                        <div>
                            <h3 className="text-xl font-semibold">Visit Website Now</h3>
                            <p className="text-gray-600">Click to visit</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
