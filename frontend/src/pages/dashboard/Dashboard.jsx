import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { FiMenu, FiHome, FiSettings, FiLogOut, FiUser, FiBox, FiTag } from 'react-icons/fi';
import { RiSettingsLine } from "react-icons/ri";
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Categories from './components/Categories';
import Products from './components/Products';
import SetCategories from './components/SetCategories';
import { logout } from '../../hooks/Logout'

const Dashboard = ({ data }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <TopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            {menuOpen && <MobileMenu />}
            <main className="flex-1 p-6">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="category" element={<Categories data={data} />} />
                    <Route path="set-category" element={<SetCategories data={data} />} />
                    <Route path="products" element={<Products data={data} />} />
                    <Route path="*" element={<div className="bg-white py-2 rounded-md text-center justify-center">Navigasi tidak di temukan.</div>} />
                </Routes>
            </main>
        </div>
    );
};

const TopBar = ({ menuOpen, setMenuOpen }) => {
    return (
        <header className="bg-blue text-white flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-white lg:hidden">
                    <FiMenu size={24} />
                </button>
                <Link to="/dashboard" className="text-2xl font-semibold">
                    Fairy Shop
                </Link>
            </div>
            <nav className="hidden lg:flex space-x-4">
                <NavLink to="/dashboard" label="Home" icon={<FiHome />} />
                <NavLink to="/dashboard/profile" label="Profile" icon={<FiUser />} />
                <NavLink to="/dashboard/category" label="category" icon={<FiTag />} />
                <NavLink to="/dashboard/set-category" label="Set Category" icon={<RiSettingsLine />} />
                <NavLink to="/dashboard/products" label="products" icon={<FiBox />} />
                <NavLink to="/dashboard/settings" label="Settings" icon={<FiSettings />} />
                <button onClick={logout} className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FiLogOut className="mr-3" />Logout</button>
            </nav>
        </header>
    );
};

const MobileMenu = () => {
    return (
        <nav className="bg-blue text-white flex flex-col p-4 space-y-2 lg:hidden">
            <NavLink to="/dashboard" label="Home" icon={<FiHome />} />
            <NavLink to="/dashboard/profile" label="Profile" icon={<FiUser />} />
            <NavLink to="/dashboard/category" label="category" icon={<FiTag />} />
            <NavLink to="/dashboard/set-category" label="set-category" icon={<RiSettingsLine />} />
            <NavLink to="/dashboard/products" label="products" icon={<FiBox />} />
            <NavLink to="/dashboard/settings" label="Settings" icon={<FiSettings />} />
            <button onClick={logout} className="flex items-center p-2 hover:bg-cream rounded">
            <FiLogOut className="mr-3"/>Logout</button>
        </nav>
    );
};

const NavLink = ({ to, label, icon }) => {
    return (
        <Link to={to} 
        className="flex items-center p-2 hover:bg-cream rounded">
            <span className="mr-3">{icon}</span>
            {label}
        </Link>
    );
};

export default Dashboard;
