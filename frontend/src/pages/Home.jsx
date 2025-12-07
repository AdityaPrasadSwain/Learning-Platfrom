import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, Brain, Shield, ArrowRight, Zap, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col bg-ai-soft dark:bg-ai-base transition-colors duration-300">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[100px] animate-pulse-soft" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
                <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[30%] bg-brand-accent/10 rounded-full blur-[80px] animate-pulse-soft delay-2000" />
            </div>

            <Navbar />

            <main className="flex-1 relative z-10 flex items-center justify-center pt-20 px-6">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-brand-primary/30 backdrop-blur-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                            </span>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Intelligent Learning Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                            Elevate Your <br />
                            <span className="gradient-text">Learning Journey</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                            Experience the future of education. Our AI assistant guides your learning journey with precision, adapting to your pace and style.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="group flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
                                Get Started
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-full font-semibold text-lg hover:bg-white hover:shadow-lg transition-all backdrop-blur-sm">
                                <Zap size={20} className="text-brand-secondary" />
                                Try Demo
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-white/10">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">10k+</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Active Students</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">200+</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Expert Instructors</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">4.9</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Average Rating</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Visual (Abstract Floating UI) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative hidden lg:block h-[600px]"
                    >
                        {/* Main Floating Card */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-[500px] glass-panel p-6 flex flex-col gap-6 animate-float-slow z-20">
                            <div className="h-48 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary p-6 flex flex-col justify-between text-white shadow-lg">
                                <div className="flex justify-between items-start">
                                    <Brain size={32} className="text-white/90" />
                                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-md">AI Analysis</div>
                                </div>
                                <div>
                                    <div className="text-sm opacity-80">Progress</div>
                                    <div className="text-2xl font-bold">98% Match</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-lg">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-white">Advanced C++</div>
                                        <div className="text-xs text-slate-500">Completed 2 mins ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-lg">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-white">Python Basics</div>
                                        <div className="text-xs text-slate-500">In Progress</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements around text */}
                            <div className="absolute -right-20 top-20 glass-panel p-4 animate-float delay-1000">
                                <Shield size={24} className="text-brand-primary" />
                            </div>
                        </div>

                        {/* Back Circle */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-brand-primary/20 rounded-full animate-spin-slow z-0 dashed-border" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-brand-secondary/20 rounded-full animate-spin-slow [--tw-rotate:180deg] z-0" />
                    </motion.div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
