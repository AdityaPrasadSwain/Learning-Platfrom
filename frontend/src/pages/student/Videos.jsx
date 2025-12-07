import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, User, Search, Filter, Video as VideoIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

import Footer from '../../components/Footer';
import api from '../../services/api';
import { showError } from '../../utils/sweetAlert';

const Videos = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/teacher/videos/all');
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching videos:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
                showError('Unauthorized', 'Please log in to view videos.');
            } else if (error.response && error.response.status === 404) {
                navigate('/not-found');
                showError('Not Found', 'The requested videos could not be found.');
            } else {
                showError('Error', error.message || 'Failed to load videos');
            }
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(videos.map(video => video.category).filter(Boolean))];

    const filteredVideos = videos.filter(video => {
        const title = video.title || '';
        const description = video.description || '';
        const instructor = video.instructor || '';
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex items-center justify-center transition-colors duration-300">

                <Navbar />
                <div className="text-2xl font-semibold">Loading videos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex flex-col transition-colors duration-300">

            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12 flex-1">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500">
                        Video Library
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Watch educational videos and enhance your learning
                    </p>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 flex flex-col md:flex-row gap-4"
                >
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 dark:text-purple-400 z-10 pointer-events-none" size={20} />
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors relative z-0 shadow-sm dark:shadow-none"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-auto min-w-[180px]">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-purple-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors shadow-sm dark:shadow-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 text-gray-600 dark:text-gray-400"
                >
                    Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                </motion.div>

                {/* Videos Grid */}
                {filteredVideos.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <VideoIcon size={64} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No videos found</h2>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/watch/${video.fileName}`}>
                                    <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-purple-500/50 transition-all hover:scale-105 shadow-md dark:shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer h-full">
                                        {/* Video Thumbnail */}
                                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-600/20 dark:to-purple-600/20 flex items-center justify-center group">
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:bg-black/40 dark:group-hover:bg-black/20 transition-colors"></div>
                                            <Play size={64} className="text-purple-600 dark:text-white relative z-10 group-hover:scale-110 transition-transform" />
                                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm">
                                                {video.duration || 'N/A'}
                                            </div>
                                        </div>

                                        {/* Video Info */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                                    {video.category || 'General'}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                                                {video.title}
                                            </h3>

                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                {video.description || 'No description available'}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 dark:border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} />
                                                    <span>{video.instructor || (video.teacher ? (video.teacher.firstName + ' ' + video.teacher.lastName) : 'Unknown Instructor')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    <span>{video.views || 0} views</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default Videos;
