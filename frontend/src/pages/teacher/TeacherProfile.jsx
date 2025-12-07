import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../components/TeacherNavbar';

import { CheckCircle } from 'lucide-react';

const TeacherProfile = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Teacher';
    const isApproved = localStorage.getItem('isApproved') === 'true';

    return (
        <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center">

            <TeacherNavbar />
            <div className="z-10 bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 text-center w-full max-w-2xl shadow-2xl mt-20">
                <h1 className="text-3xl font-bold mb-4">{username}'s Profile</h1>
                {isApproved && (
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
                        <span className="text-green-500 font-semibold">Verified</span>
                    </div>
                )}
                <p className="text-gray-300">This is a placeholder for teacher profile details.</p>
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                    Go to Teacher Dashboard
                </button>
            </div>
        </div>
    );
};

export default TeacherProfile;
