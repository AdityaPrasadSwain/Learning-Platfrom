import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageWrapper from '../components/PageWrapper';

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
            <PageWrapper showNavbar={false} showFooter={false} className="flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </PageWrapper>
        );
    }

    if (error || !video) {
        return (
            <PageWrapper showNavbar={false} showFooter={false} className="flex flex-col items-center justify-center">
                <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
                <p className="text-white">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-5 py-2 bg-purple-600 rounded text-white hover:bg-purple-700 transition"
                >
                    <ArrowLeft className="inline mr-2" /> Back
                </button>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper showNavbar={false} showFooter={false}>
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full backdrop-blur hover:bg-white/20 transition"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="flex flex-col h-full">
                {/* Title */}
                <div className="text-center pt-8 pb-4 relative z-10">
                    <h1 className="text-2xl font-semibold text-white">{video.title}</h1>
                    {video.description && (
                        <p className="text-gray-300 text-sm mt-1 max-w-2xl mx-auto px-4">{video.description}</p>
                    )}
                </div>

                {/* Video */}
                <div className="flex-1 flex justify-center items-center p-4 min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black relative z-10"
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
        </PageWrapper>
    );
};

export default VideoPlayerPage;
