import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreeBackground from '../components/ThreeBackground';
import api from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedUsername = localStorage.getItem('username');

        // Redirect admins to admin dashboard
        if (storedRole === 'ADMIN') {
            navigate('/admin/dashboard');
            return;
        }

        // Redirect teachers to teacher dashboard
        if (storedRole === 'TEACHER') {
            navigate('/teacher/dashboard');
            return;
        }

        // Redirect students to student dashboard
        if (storedRole === 'STUDENT') {
            navigate('/student/dashboard');
            return;
        }

        setRole(storedRole);
        setUsername(storedUsername);
        fetchCourses();
    }, [navigate]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        }
    };

    return (
        <div className="relative min-h-screen bg-ai-soft dark:bg-ai-base transition-colors duration-300">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto">
                <div className="glass-panel p-8 mb-8 animate-float-slow">
                    <h1 className="text-4xl font-display font-bold mb-2 text-slate-900 dark:text-white">Welcome, {username}</h1>
                    <div className="inline-block px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-sm">
                        {role === 'STUDENT' ? 'Student' : role === 'TEACHER' ? 'Instructor' : 'Admin'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Role Specific Content */}
                    {role === 'ADMIN' && (
                        <div className="glass-panel p-6 border-l-4 border-brand-accent">
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Admin Control</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">Manage platform users and settings.</p>
                            <button className="w-full bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent py-2 rounded-lg font-semibold transition-colors">
                                Manage Users
                            </button>
                        </div>
                    )}

                    {role === 'TEACHER' && (
                        <div className="glass-panel p-6 border-l-4 border-brand-secondary">
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Instructor Hub</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">Create new learning modules.</p>
                            <button className="w-full bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary py-2 rounded-lg font-semibold transition-colors">
                                Create Course
                            </button>
                        </div>
                    )}

                    {/* Common Course List */}
                    <div className="col-span-full mt-8">
                        <h2 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white">Available Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <div key={course.id} className="glass-panel p-6 hover:shadow-lg transition-all cursor-pointer group border border-slate-200 dark:border-white/5">
                                        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-brand-primary transition-colors">{course.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-slate-600 dark:text-slate-300">Module 1</span>
                                            <button className="text-brand-primary text-sm font-semibold hover:underline">Start Learning</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-slate-500">
                                    No courses currently available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
