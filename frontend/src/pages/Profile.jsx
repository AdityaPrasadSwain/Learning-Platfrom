import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit, Save, X, Camera, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import { showSuccess, showError, showLoading } from '../utils/sweetAlert';
import Swal from 'sweetalert2';
import api from '../services/api';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        username: localStorage.getItem('username') || '',
        email: '',
        firstName: '',
        lastName: '',
        role: localStorage.getItem('role') || '',
        createdAt: '',
        profilePhoto: null
    });
    const [editData, setEditData] = useState({ ...userData });
    const [loading, setLoading] = useState(true);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API endpoint when available
            // const response = await api.get('/user/profile');
            // setUserData(response.data);

            // Mock data for now
            const savedPhoto = localStorage.getItem('profilePhoto');
            setUserData({
                username: localStorage.getItem('username') || 'User',
                email: `${localStorage.getItem('username')}@antigravity.com`,
                firstName: 'John',
                lastName: 'Doe',
                role: localStorage.getItem('role') || 'STUDENT',
                createdAt: new Date().toISOString(),
                profilePhoto: savedPhoto
            });
            setEditData({
                username: localStorage.getItem('username') || 'User',
                email: `${localStorage.getItem('username')}@antigravity.com`,
                firstName: 'John',
                lastName: 'Doe',
                role: localStorage.getItem('role') || 'STUDENT',
                createdAt: new Date().toISOString(),
                profilePhoto: savedPhoto
            });
            if (savedPhoto) {
                setPhotoPreview(savedPhoto);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showError('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...userData });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...userData });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showError('File Too Large', 'Please select an image smaller than 5MB');
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setSelectedFile(null);
        setEditData({ ...editData, profilePhoto: null });
    };

    const handleSave = async () => {
        showLoading('Updating profile...');
        try {
            // TODO: Replace with actual API endpoint
            // await api.put('/user/profile', editData);

            // Save photo to localStorage (in production, upload to server)
            if (photoPreview) {
                localStorage.setItem('profilePhoto', photoPreview);
                editData.profilePhoto = photoPreview;
            } else {
                localStorage.removeItem('profilePhoto');
                editData.profilePhoto = null;
            }

            setUserData(editData);
            setIsEditing(false);
            setSelectedFile(null);
            Swal.close();
            await showSuccess('Profile Updated!', 'Your profile has been updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.close();
            showError('Update Failed', 'Failed to update profile. Please try again.');
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30';
            case 'TEACHER':
                return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30';
            case 'STUDENT':
                return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex items-center justify-center transition-colors duration-300">

                <Navbar />
                <div className="text-2xl">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden flex flex-col">

            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">My Profile</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-none">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-600/20 dark:to-pink-600/20 p-8 border-b border-gray-200 dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    {/* Profile Photo */}
                                    <div className="relative group">
                                        {photoPreview || userData.profilePhoto ? (
                                            <img
                                                src={photoPreview || userData.profilePhoto}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/50"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl font-bold border-4 border-purple-500/50">
                                                {userData.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <label className="cursor-pointer bg-black/70 rounded-full p-3 hover:bg-black/90 transition-colors">
                                                    <Camera size={20} />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        {isEditing && (photoPreview || userData.profilePhoto) && (
                                            <button
                                                onClick={handleRemovePhoto}
                                                className="absolute -bottom-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors"
                                                title="Remove photo"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{userData.username}</h2>
                                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(userData.role)}`}>
                                            {userData.role}
                                        </span>
                                    </div>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={handleEdit}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Edit size={18} />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <User size={16} />
                                        Username
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.username}
                                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">{userData.username}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <Mail size={16} />
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">{userData.email}</p>
                                    )}
                                </div>

                                {/* First Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <User size={16} />
                                        First Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.firstName}
                                            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">{userData.firstName || 'Not set'}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <User size={16} />
                                        Last Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.lastName}
                                            onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">{userData.lastName || 'Not set'}</p>
                                    )}
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <Shield size={16} />
                                        Role
                                    </label>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{userData.role}</p>
                                </div>

                                {/* Member Since */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <Calendar size={16} />
                                        Member Since
                                    </label>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {new Date(userData.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-lg transition-opacity flex items-center justify-center gap-2 font-medium"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default Profile;
