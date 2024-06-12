import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../hooks/isLoggedIn';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            window.location.href = '/dashboard';
        }
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleEmailChange = (event) => {
        const newValue = event.target.value;
        setEmail(newValue);
        localStorage.setItem('email', newValue);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const login = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('https://api.storenana.my.id/login', { email, password });
            if (response.data.success) {
                setSuccessMessage('Login successful!');
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Failed to login. Please try again.');
            }
        } catch (error) {
            setError('Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-white px-4">
            <div className="bg-cokelat p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-2">Dashboard Admin</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
                <div className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={login}
                        disabled={loading || email.trim() === '' || password.trim() === ''}
                        className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 flex justify-center items-center">
                        {loading ? <ClipLoader color="#fff" size={24} /> : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
