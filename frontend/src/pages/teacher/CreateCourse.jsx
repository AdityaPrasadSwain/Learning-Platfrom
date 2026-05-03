import React, { useState } from 'react';
import { Save, ArrowLeft, BookOpen } from 'lucide-react';
import { createCourse } from '../../api/courseApi';
import { showSuccess, showError, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';



const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        duration: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (value) => {
        setFormData((prev) => ({ ...prev, category: value }));
    };

    const categoryOptions = [
        { value: '', label: 'Select Category' },
        { value: 'Programming', label: 'Programming' },
        { value: 'Web Development', label: 'Web Development' },
        { value: 'Data Science', label: 'Data Science' },
        { value: 'Design', label: 'Design' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoading('Creating course...');
        try {
            const newCourse = await createCourse(formData);
            Swal.close();
            await showSuccess('Course Created!', `${formData.title} has been created successfully. Now you can add lessons and content.`);
            navigate(`/teacher/course/${newCourse.id}/edit`);
        } catch (error) {
            console.error(error);
            Swal.close();
            showError('Creation Failed', error.response?.data?.message || 'Failed to create course. Please try again.');
        }
    };

    return (
        <div className="text-white max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/teacher/my-courses')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to My Courses
            </button>
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3">
                    <BookOpen size={28} className="text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-orbitron">Create New Course</h1>
                    <p className="text-gray-400 text-sm mt-1">Build a structured learning path for your students</p>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8"
            >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Course Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all"
                                placeholder="e.g., Advanced Java Programming" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all resize-none"
                                placeholder="Detailed description of the course..." required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                            <div className="modern-dropdown">
                                <select name="category" value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)} required>
                                    <option value="">Select Category</option>
                                    {categoryOptions.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (minutes)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-all"
                                min="1" required />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button type="button" onClick={() => navigate('/teacher/my-courses')}
                                className="px-6 py-2.5 text-gray-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                <Save size={18} /> Create & Add Content
                            </button>
                        </div>
                    </form>
            </motion.div>
        </div>
    );
};

export default CreateCourse;
