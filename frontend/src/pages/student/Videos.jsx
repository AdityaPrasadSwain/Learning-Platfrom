import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Search, User, Video as VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllVideos } from '../../api/videoApi';

const Videos = () => {
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
            const data = await getAllVideos();
            setVideos(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(videos.map(v => v.category).filter(Boolean))];

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse text-cyan-400">Loading library...</div>
            </div>
        );
    }

    return (
        <div className="text-white">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold font-orbitron">Video <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Library</span></h1>
                <p className="text-gray-400 mt-1">Watch educational videos and enhance your learning.</p>
            </motion.div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Search videos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="modern-dropdown w-full md:w-48">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-gray-400"
            >
                Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
            </motion.div>

            {filteredVideos.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <VideoIcon size={56} className="mx-auto mb-4 text-gray-600" />
                    <h2 className="text-xl font-bold mb-2">No videos found</h2>
                    <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredVideos.map((video, index) => (
                        <motion.div key={video.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/watch/${video.fileName}`}>
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all group h-full">
                                    <div className="relative h-44 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center group overflow-hidden">
                                        <Play size={48} className="text-cyan-400 relative z-10 group-hover:scale-110 transition-transform" fill="currentColor" fillOpacity="0.2" />
                                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white">
                                            {video.duration || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="mb-3">
                                            <span className="inline-block px-2.5 py-0.5 bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-bold">
                                                {video.category || 'GENERAL'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-white group-hover:text-cyan-400 transition-colors">
                                            {video.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                                            {video.description || 'Watch and learn the core concepts of this lesson.'}
                                        </p>

                                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <User size={13} className="shrink-0" />
                                                <span className="truncate">{video.instructor || 'Instructor'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                                <VideoIcon size={13} />
                                                <span>{video.views || 0} Views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Videos;
