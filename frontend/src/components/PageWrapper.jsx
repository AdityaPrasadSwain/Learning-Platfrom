import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import PageBackground from './PageBackground';

const PageWrapper = ({ children, className = "", showNavbar = true, showFooter = true }) => {
    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col bg-ai-soft dark:bg-ai-base transition-colors duration-300">
            <PageBackground />

            {showNavbar && <Navbar />}

            <motion.main
                className={`flex-1 relative z-10 ${className}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.main>

            {showFooter && (
                <div className="relative z-10">
                    <Footer />
                </div>
            )}
        </div>
    );
};

export default PageWrapper;
