import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherProfile = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Teacher';
    const email = localStorage.getItem('email') || '';
    const isApproved = localStorage.getItem('isApproved') === 'true';

    return (
        <div className="text-white max-w-xl mx-auto">
            <h1 className="text-3xl font-bold font-orbitron mb-8">My Profile</h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 text-center space-y-5"
            >
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold mx-auto shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    {username.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white">{username}</h2>
                    {email && <p className="text-gray-400 text-sm mt-1">{email}</p>}
                </div>

                {isApproved ? (
                    <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                        <CheckCircle size={16} /> Verified Teacher
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold">
                        Pending Approval
                    </div>
                )}

                <p className="text-gray-400 text-sm">Role: Teacher</p>

                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                    Go to Dashboard <ArrowRight size={16} />
                </button>
            </motion.div>
        </div>
    );
};

export default TeacherProfile;
