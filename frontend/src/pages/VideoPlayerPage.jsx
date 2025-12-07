import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const VideoPlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/teacher/videos/details/${id}`);
                setVideo(res.data);
            } catch (err) {
                console.error(err);
                setError('Video not found or failed to load');
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
                <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-5 py-2 bg-purple-600 rounded"
                >
                    <ArrowLeft className="inline mr-2" /> Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur"
            >
                <ArrowLeft size={18} /> Back
            </button>

            {/* Title */}
            <div className="text-center pt-6">
                <h1 className="text-xl font-semibold">{video.title}</h1>
                {video.description && (
                    <p className="text-gray-400 text-sm mt-1">{video.description}</p>
                )}
            </div>

            {/* Video */}
            <div className="flex justify-center items-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                >
                    <ReactPlayer
                        url={video.cloudinaryUrl}
                        controls
                        width="100%"
                        height="100%"
                        playsinline
                        config={{
                            file: {
                                forceVideo: true,
                                attributes: {
                                    preload: 'auto',
                                    controlsList: 'nodownload',
                                },
                            },
                        }}
                        onError={(e) => console.error('Video error:', e)}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
