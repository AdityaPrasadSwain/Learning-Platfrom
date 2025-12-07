import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Play, Trash2, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

// Generate thumbnail URL from Cloudinary video URL
const getThumbnailUrl = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return null;
    try {
        const url = new URL(cloudinaryUrl);
        const parts = url.pathname.split('/upload/');
        if (parts.length === 2) {
            const thumbnailPath = `${parts[0]}/upload/so_0,w_400,h_225,c_fill/${parts[1].replace(/\\.[^.]+$/, '.jpg')}`;
            return `${url.origin}${thumbnailPath}`;
        }
    } catch (e) {
        console.error('Error generating thumbnail URL:', e);
    }
    return null;
};

const VideoCard = ({ video, onDelete }) => {
    const [thumbnailError, setThumbnailError] = useState(false);
    const thumbnailUrl = getThumbnailUrl(video.cloudinaryUrl);

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg group"
        >
            <div className="relative aspect-video bg-gray-800">
                {/* Thumbnail */}
                {thumbnailUrl && !thumbnailError ? (
                    <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setThumbnailError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
                        {thumbnailError ? (
                            <ImageOff size={48} className="text-white/30" />
                        ) : (
                            <Play size={48} className="text-white/50" />
                        )}
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Link
                        to={`/watch/${video.id || video.cloudinaryUrl}`}
                        className="p-3 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors shadow-lg"
                    >
                        <Play size={24} fill="currentColor" />
                    </Link>
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete(video.id);
                            }}
                            className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors shadow-lg"
                        >
                            <Trash2 size={24} />
                        </button>
                    )}
                </div>

                {/* Center play overlay (when not hovered) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                    <div className="p-3 bg-black/50 rounded-full">
                        <Play size={32} className="text-white" fill="white" />
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate">{video.title}</h3>
                <p className="text-sm text-gray-400 truncate">{video.description || 'No description'}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Uploaded: {video.uploadedAt ? new Date(video.uploadedAt).toLocaleDateString() : 'Unknown'}</span>
                    {video.views !== undefined && <span>{video.views} views</span>}
                </div>
            </div>
        </motion.div>
    );
};

export default VideoCard;
