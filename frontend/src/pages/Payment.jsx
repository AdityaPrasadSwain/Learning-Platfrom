import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { showSuccess, showError, showLoading } from '../utils/sweetAlert';

const Payment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        showLoading('Processing Payment...');

        // Simulate payment processing
        setTimeout(async () => {
            setProcessing(false);
            Swal.close();
            await showSuccess('Payment Successful!', 'You have successfully enrolled in the course.');
            navigate('/my-learning');
        }, 2000);
    };

    return (
        <div className="min-h-screen text-white relative overflow-hidden flex flex-col">

            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12 flex-1 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 max-w-md w-full"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={32} className="text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Secure Payment</h2>
                        <p className="text-gray-400">Complete your enrollment for Course ID: {courseId}</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Card Number</label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">CVC</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {processing ? 'Processing...' : (
                                <>
                                    <Lock size={18} />
                                    Pay Now
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Payment;
