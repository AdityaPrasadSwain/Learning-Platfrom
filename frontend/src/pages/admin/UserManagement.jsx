import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ThreeBackground from '../../components/ThreeBackground';
import { Search, Edit, Trash2, Ban, CheckCircle, ArrowLeft } from 'lucide-react';
import { getAllUsers, suspendUser, activateUser, deleteUser } from '../../api/adminApi';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showError('Error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (user) => {
        if (user.isSuspended) {
            // Activate user
            const confirmed = await showConfirm(
                'Activate User?',
                `Are you sure you want to activate ${user.username}?`
            );
            if (confirmed) {
                showLoading('Activating user...');
                try {
                    await activateUser(user.id);
                    Swal.close();
                    await showSuccess('Activated!', `${user.username} has been activated`);
                    fetchUsers();
                } catch (error) {
                    console.error('Error activating user:', error);
                    Swal.close();
                    showError('Error', 'Failed to activate user');
                }
            }
        } else {
            // Suspend user
            const confirmed = await showConfirm(
                'Suspend User?',
                `Are you sure you want to suspend ${user.username}?`
            );
            if (confirmed) {
                showLoading('Suspending user...');
                try {
                    await suspendUser(user.id, 'Suspended by admin');
                    Swal.close();
                    await showSuccess('Suspended!', `${user.username} has been suspended`);
                    fetchUsers();
                } catch (error) {
                    console.error('Error suspending user:', error);
                    Swal.close();
                    showError('Error', 'Failed to suspend user');
                }
            }
        }
    };

    const handleDelete = async (user) => {
        const confirmed = await showConfirm(
            'Delete User?',
            `Are you sure you want to delete ${user.username}? This action cannot be undone.`
        );
        if (confirmed) {
            showLoading('Deleting user...');
            try {
                await deleteUser(user.id);
                Swal.close();
                await showSuccess('Deleted!', `${user.username} has been deleted`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.close();
                showError('Error', 'Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <ThreeBackground />
                <Navbar />
                <div className="text-white text-2xl">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <ThreeBackground />
            <Navbar />
            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a
                            href="/admin/dashboard"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </a>
                        <h1 className="text-2xl font-bold font-orbitron text-white neon-text">User Management</h1>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 glass-panel text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-neon-blue/20 border border-neon-blue flex items-center justify-center text-neon-blue font-bold">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{user.username}</div>
                                                <div className="text-sm text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple' :
                                            user.role === 'TEACHER' ? 'bg-green-500/20 text-green-400 border border-green-500' :
                                                'bg-gray-500/20 text-gray-300 border border-gray-500'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isSuspended ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-green-500/20 text-green-400 border border-green-500'
                                            }`}>
                                            {user.isSuspended ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleSuspend(user)}
                                            className={`${user.isSuspended ? 'text-green-400 hover:text-green-300' : 'text-orange-400 hover:text-orange-300'} transition-colors`}
                                            title={user.isSuspended ? "Activate" : "Suspend"}
                                        >
                                            {user.isSuspended ? <CheckCircle size={18} /> : <Ban size={18} />}
                                        </button>
                                        <button className="text-red-400 hover:text-red-300 transition-colors" title="Delete" onClick={() => handleDelete(user)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
