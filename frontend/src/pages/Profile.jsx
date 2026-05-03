import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit, Save, X, Camera, Trash2, CameraIcon } from 'lucide-react';
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
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse text-cyan-400">Syncing profile...</div>
            </div>
        );
    }

    return (
        <div className="text-white">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold font-orbitron">My <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Profile</span></h1>
                <p className="text-gray-400 mt-1">Manage your identity and account settings.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {/* Profile Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-8 border-b border-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)] from-cyan-500/10" />
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                {/* Profile Photo */}
                                <div className="relative group">
                                    {photoPreview || userData.profilePhoto ? (
                                        <img src={photoPreview || userData.profilePhoto} alt="Profile"
                                            className="w-28 h-28 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]" />
                                    ) : (
                                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                            {userData.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    {isEditing && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <label className="cursor-pointer bg-black/60 backdrop-blur-md rounded-xl p-2.5 hover:bg-black/80 transition-all border border-white/10">
                                                <CameraIcon size={18} />
                                                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                            </label>
                                        </div>
                                    )}

                                    {isEditing && (photoPreview || userData.profilePhoto) && (
                                        <button onClick={handleRemovePhoto}
                                            className="absolute -top-2 -right-2 bg-red-500/80 backdrop-blur-md hover:bg-red-500 rounded-lg p-1.5 transition-all border border-white/10">
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{userData.username}</h2>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold border tracking-wider ${getRoleBadgeColor(userData.role)}`}>
                                            {userData.role}
                                        </span>
                                        <span className="px-3 py-0.5 rounded-full text-[10px] font-bold border border-white/10 bg-white/5 text-gray-400 tracking-wider">
                                            MEMBER SINCE {new Date(userData.createdAt).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!isEditing && (
                                <button onClick={handleEdit}
                                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 text-sm font-bold tracking-wide">
                                    <Edit size={16} className="text-cyan-400" />
                                    EDIT PROFILE
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Input Fields */}
                            {[
                                { id: 'username', label: 'Username', icon: User, key: 'username' },
                                { id: 'email', label: 'Email Address', icon: Mail, key: 'email' },
                                { id: 'firstName', label: 'First Name', icon: User, key: 'firstName' },
                                { id: 'lastName', label: 'Last Name', icon: User, key: 'lastName' },
                            ].map((field) => (
                                <div key={field.id}>
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                                        <field.icon size={14} className="text-cyan-500" />
                                        {field.label}
                                    </label>
                                    {isEditing ? (
                                        <input type="text" value={editData[field.key]}
                                            onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all text-sm" />
                                    ) : (
                                        <div className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-300 text-sm">
                                            {userData[field.key] || <span className="text-gray-600 italic">Not set</span>}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Role (Read Only) */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                                    <Shield size={14} className="text-cyan-500" />
                                    Account Role
                                </label>
                                <div className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-300 text-sm">
                                    {userData.role}
                                </div>
                            </div>

                            {/* Member Since (Read Only) */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                                    <Calendar size={14} className="text-cyan-500" />
                                    Joined On
                                </label>
                                <div className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-300 text-sm">
                                    {new Date(userData.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 mt-10 pt-8 border-t border-white/5">
                                <button onClick={handleSave}
                                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2">
                                    <Save size={18} />
                                    SAVE CHANGES
                                </button>
                                <button onClick={handleCancel}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all font-bold text-sm border border-white/10 flex items-center justify-center gap-2">
                                    <X size={18} />
                                    CANCEL
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
