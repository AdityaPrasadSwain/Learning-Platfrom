import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

import VideoCard from '../components/VideoCard';
import { getTeacherVideos, getAllVideos, deleteVideo } from '../api/videoApi';
import Swal from 'sweetalert2';

const MyVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const rawTeacherId = localStorage.getItem('userId');
    // Handle edge cases: null, undefined, or string versions of them
    const teacherId = rawTeacherId && rawTeacherId !== 'null' && rawTeacherId !== 'undefined' ? rawTeacherId : null;

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            let data;
            if (teacherId) {
                // Fetch videos for specific teacher
                console.log('Fetching videos for teacherId:', teacherId);
                data = await getTeacherVideos(teacherId);
            } else {
                // Fallback: fetch all videos if userId not available
                // This happens when user logged in before userId storage was added
                console.warn('No userId found in localStorage. Fetching all videos. Please log out and log back in.');
                data = await getAllVideos();
            }
            setVideos(data || []);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (videoId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1f2937',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await deleteVideo(videoId);
                setVideos(videos.filter(v => v.id !== videoId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your video has been deleted.',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#9333ea'
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete video.',
                    icon: 'error',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    return (
        <div className="min-h-screen text-white relative overflow-hidden">

            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold mb-8">My Uploaded Videos</h1>

                    {!teacherId && (
                        <div className="mb-4 p-4 bg-yellow-600/20 border border-yellow-500/50 rounded-lg">
                            <p className="text-yellow-300 text-sm">
                                ⚠️ For a better experience, please <strong>log out and log back in</strong> to see only your videos.
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-white/10">
                            <p className="text-xl text-gray-400">Loading videos...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-white/10">
                            <p className="text-xl text-gray-400">No videos uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <VideoCard key={video.id} video={video} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default MyVideos;
