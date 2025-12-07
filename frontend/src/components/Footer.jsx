import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, Rocket } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-white/80 dark:bg-black/40 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 mt-20 transition-colors duration-300">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Logo size={40} />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
                                LearningStream
                            </span>
                        </div>
                        <p className="text-slate-600 dark:text-gray-400 text-sm mb-4">
                            Your gateway to knowledge in the digital universe. Learn, grow, and achieve your dreams.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                className="p-2 bg-slate-100 dark:bg-gray-800/50 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-brand-accent/10 hover:text-brand-accent transition-all">
                                <Github size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="p-2 bg-slate-100 dark:bg-gray-800/50 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-brand-secondary/10 hover:text-brand-secondary transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                className="p-2 bg-slate-100 dark:bg-gray-800/50 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-blue-600/10 hover:text-blue-600 transition-all">
                                <Linkedin size={20} />
                            </a>
                            <a href="mailto:contact@learningstream.com"
                                className="p-2 bg-slate-100 dark:bg-gray-800/50 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-pink-500/10 hover:text-pink-500 transition-all">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/courses" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Courses
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Students */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">For Students</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/courses" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Browse Courses
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-learning" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    My Learning
                                </Link>
                            </li>
                            <li>
                                <Link to="/student/dashboard" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Student Dashboard
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Certificates
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Help Center
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* For Teachers */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">For Teachers</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/teacher/dashboard" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Teacher Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/teacher/create-course" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Create Course
                                </Link>
                            </li>
                            <li>
                                <Link to="/teacher/my-courses" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    My Courses
                                </Link>
                            </li>
                            <li>
                                <Link to="/teacher/upload" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Upload Video
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-slate-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">
                                    Resources
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-sm">
                            <span>© {currentYear} LearningStream. All rights reserved.</span>
                        </div>

                        <div className="flex items-center gap-1 text-slate-500 dark:text-gray-400 text-sm">
                            <span>Made with</span>
                            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
                            <span>by</span>
                            <span className="text-brand-primary font-semibold">AntiGravity Team</span>
                            <Rocket size={16} className="text-brand-primary ml-1" />
                        </div>

                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-slate-500 dark:text-gray-400 hover:text-brand-primary transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-slate-500 dark:text-gray-400 hover:text-brand-primary transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-slate-500 dark:text-gray-400 hover:text-brand-primary transition-colors">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative gradient line */}
            <div className="h-1 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-secondary"></div>
        </footer>
    );
};

export default Footer;
