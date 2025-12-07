import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const NotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen text-white relative overflow-hidden flex flex-col items-center justify-center">

            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-12 flex-1 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500">
                        404 - Not Found
                    </h1>
                    <p className="text-gray-400 text-lg mb-6">
                        The page you are looking for does not exist.
                    </p>
                    <button
                        onClick={goHome}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        Go to Home
                    </button>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
