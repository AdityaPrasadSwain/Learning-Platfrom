import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { createCourse } from '../../api/courseApi';
import { showSuccess, showError, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';



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
        <div className="min-h-screen text-white relative overflow-hidden">

            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-12 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-3xl bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl"
                >
                    <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Create New Course
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="e.g., Advanced Java Programming"
                                required
                            />
                        </div>
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                placeholder="Detailed description of the course..."
                                required
                            />
                        </div>
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                required
                            >
                                <option value="">Select Category</option>
                                {categoryOptions.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                min="1"
                                required
                            />
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => navigate('/teacher/my-courses')}
                                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center shadow-lg shadow-purple-500/20"
                            >
                                <Save size={20} className="mr-2" /> Create & Add Content
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default CreateCourse;
