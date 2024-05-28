import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import useNProgress from './hooks/useNProgress';
import MainContent from './pages/MainContent';
import Login from './pages/Login';
import NotFoundPage from './components/NotFoundPage';
import PrivateRoute from './hooks/PrivateRoute';
import Dashboard from './pages/dashboard/Dashboard';
import ChildHeroSection from './pages/ChildHeroSection';
import ProductsTable from './pages/ProductsTable';
import { isLoggedIn } from './hooks/isLoggedIn';
import axios from 'axios';

const AppWrapper = () => {
    const [gameSections, setGameSections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useNProgress(isLoading);

    useEffect(() => {
        const fetchGameSections = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('https://bs7g03bb-3500.asse.devtunnels.ms/api/products');
                setGameSections(response.data);
            } catch (error) {
                console.error('Error fetching game sections:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGameSections();
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<MainContent data={gameSections} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product" element={<ProductsTable data={gameSections} />} />
            <Route
                path="/dashboard/*"
                element={
                    <PrivateRoute>
                        {isLoggedIn() ? <Dashboard data={gameSections} /> : <Login />}
                    </PrivateRoute>
                }
            />
            {gameSections.map((section) => (
                <Route
                    key={section.id}
                    path={`/order/${section.slug}`}
                    element={<ChildHeroSection data={section} />}
                />
            ))}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppWrapper;
