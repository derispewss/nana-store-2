import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../hooks/isLoggedIn'
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            window.location.href = '/dashboard';
        }
        const savedEmail = localStorage.getItem('user');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setEmail(newValue);
        localStorage.setItem('user', newValue);
    };

    const sendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('https://bs7g03bb-3500.asse.devtunnels.ms/api/send-otp', { email: email });
            if (response.data.success) {
                localStorage.setItem('otp_token', response.data.hashedToken);
                localStorage.setItem('isLogin', email)
                setSuccessMessage(`Kami telah mengirimkan OTP Ke Email ${email}`);
                setOtpSent(true);
            }
        } catch (error) {
            setError('Failed to Send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('otp_token');
            const response = await axios.post('https://bs7g03bb-3500.asse.devtunnels.ms/api/validate-otp', { otp, token });
            if (response.data.success) {
                setSuccessMessage('OTP successfully validated!');
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Failed to validate OTP. Please try again.');
            }
        } catch (error) {
            setError('Failed to validate OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-2">{otpSent ? 'Masukan OTP' : 'Dashboard Admin'}</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
                {!otpSent ? (
                    <div className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={sendOTP}
                            disabled={loading || email.trim() === ''}
                            className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 flex justify-center items-center">
                            {loading ? <ClipLoader color="#fff" size={24} /> : 'Login'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"/>
                        <button
                            onClick={validateOTP}
                            disabled={loading || otp.trim() === ''}
                            className="w-full px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors duration-300 disabled:opacity-50 flex justify-center items-center">
                            {loading ? <ClipLoader color="#fff" size={24} /> : 'Validate OTP'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
