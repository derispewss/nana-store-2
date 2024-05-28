import React, { useState } from 'react'
import { isLoggedIn } from '../hooks/isLoggedIn'
import { Link } from 'react-router-dom';

const Navbar = () => {
const [activeNav, setActiveNav] = useState('Home');
const [isMenuOpen, setIsMenuOpen] = useState(false);
return (
    <div>
        <nav className="w-full bg-yellow-950 md:bg-transparent md:px-24">
            <div className="container bg-yellow-950 mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-white">
                        <Link to="/" className="text-xl font-bold">Nana Store</Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        <ul className="flex space-x-4">
                            <li className={`nav-item ${activeNav === 'Home' ? 'active' : ''}`} onClick={() => setActiveNav('Home')}>
                                <Link to="/" className="nav-link text-white hover:font-semibold">Home</Link>
                            </li>
                            <li className={`nav-item ${activeNav === 'Product' ? 'active' : ''}`} onClick={() => setActiveNav('Product')}>
                                <Link to="/product" className="nav-link text-white hover:font-semibold">Product</Link>
                            </li>
                            <li className={`nav-item ${activeNav === 'Contact' ? 'active' : ''}`} onClick={() => setActiveNav('Contact')}>
                                <Link to="https://wa.me/6282229025162?text=kak+aku+dari+website" target='_blank' className="nav-link text-white hover:font-semibold">Contact</Link>
                            </li>
                            <li className={`nav-item ${activeNav === 'Sign In' ? 'active' : ''}`} onClick={() => setActiveNav('Sign In')}>
                                <Link to="/login" className="nav-link text-white hover:font-semibold">{isLoggedIn() ? 'Dashboard' : 'Sign In'}</Link>
                            </li>
                            </ul>
                        </div>
                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className={`md:hidden ${isMenuOpen ? '' : 'hidden'}`}>
                <ul className="flex flex-col items-center">
                    <li className="py-2">
                        <Link to="/" className="block text-white hover:text-orange-200">Home</Link>
                    </li>
                    <li className="py-2">
                        <Link to="/product" className="block text-white hover:text-orange-200">Product</Link>
                    </li>
                    <li className="py-2">
                        <Link to="/contact" className="block text-white hover:text-orange-200">Contact</Link>
                    </li>
                    <li className="py-2">
                        <Link to="/login" className="block text-white hover:text-orange-200">{isLoggedIn() ? 'Dashboard' : 'Sign In'}</Link>
                    </li>
                    </ul>
            </div>
        </nav>
    </div>
)
}

export default Navbar