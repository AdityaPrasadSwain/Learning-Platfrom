import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileVideo, X } from 'lucide-react';

const FileUploader = ({ onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleChange = useCallback((e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const removeFile = () => {
        setSelectedFile(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-gray-500'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept="video/mp4,video/x-matroska,video/avi"
                />

                {!selectedFile ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-800 rounded-full">
                            <UploadCloud size={32} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-white">Click or drag video to upload</p>
                            <p className="text-sm text-gray-400">MP4, MKV, AVI (Max 500MB)</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FileVideo className="text-purple-400" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-white truncate max-w-[200px]">{selectedFile.name}</p>
                                <p className="text-xs text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removeFile();
                            }}
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
                        >
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
