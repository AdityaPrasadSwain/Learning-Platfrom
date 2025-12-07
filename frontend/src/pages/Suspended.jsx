import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, AlertTriangle, Mail } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

const Suspended = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <ThreeBackground />
            
            <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border-2 border-red-500/50 p-12 shadow-2xl shadow-red-500/20">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-50 animate-pulse"></div>
                            <ShieldOff size={80} className="text-red-500 relative animate-bounce" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-500">
                        Account Suspended
                    </h1>

                    {/* Message */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle size={24} className="text-red-400 flex-shrink-0 mt-1" />
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Your account has been permanently suspended
                                </h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Your access to this platform has been restricted due to a violation of our terms of service or community guidelines. 
                                    You are no longer able to log in or access any features of the platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-gray-400 mb-8 space-y-3">
                        <p className="text-sm">
                            If you believe this is a mistake or would like to appeal this decision, please contact our support team.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-purple-400">
                            <Mail size={18} />
                            <a href="mailto:support@learningstream.com" className="hover:text-purple-300 transition-colors">
                                support@learningstream.com
                            </a>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/">
                            <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium">
                                Return to Home
                            </button>
                        </Link>
                        <a href="mailto:support@learningstream.com">
                            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-lg transition-opacity font-medium">
                                Contact Support
                            </button>
                        </a>
                    </div>

                    {/* Warning Note */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-xs text-gray-500">
                            Creating a new account to circumvent this suspension may result in permanent IP ban.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Suspended;
