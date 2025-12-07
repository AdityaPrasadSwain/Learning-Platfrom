import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import FileUploader from '../components/FileUploader';
import { uploadVideo } from '../api/videoApi';
import Swal from 'sweetalert2';

const UploadVideo = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            Swal.fire({
                title: 'Error',
                text: 'Please select a file and enter a title',
                icon: 'error',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        setUploading(true);
        const formData = new FormData();
        const userId = localStorage.getItem('userId');
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('teacherId', userId);

        try {
            await uploadVideo(formData);
            Swal.fire({
                title: 'Success',
                text: 'Video uploaded successfully!',
                icon: 'success',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#9333ea'
            });
            navigate('/teacher/videos');
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to upload video',
                icon: 'error',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen text-white relative overflow-hidden">

            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Upload New Content
                    </h2>

                    <form onSubmit={handleUpload} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Video Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Enter video title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                                placeholder="Enter video description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Video File</label>
                            <FileUploader onFileSelect={setFile} />
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {uploading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Upload Video'
                            )}
                        </button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default UploadVideo;
