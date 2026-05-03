import React, { useState, useEffect } from 'react';
import { Search, Trash2, Ban, CheckCircle, ArrowLeft, Filter, ShieldAlert } from 'lucide-react';
import { getAllUsers, suspendUser, activateUser, deleteUser } from '../../api/adminApi';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const CustomDropdown = ({ options, value, onChange, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 glass-panel text-white hover:bg-white/10 transition-all border border-white/10 hover:border-neon-blue/50 focus:outline-none focus:ring-2 focus:ring-neon-blue rounded-lg shadow-lg"
            >
                {Icon && <Icon size={16} className="text-neon-blue" />}
                <span>{value ? options.find(o => o.value === value)?.label : label}</span>
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-neon-blue/50 rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.3)] z-50 overflow-hidden transform origin-top-right transition-all">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors ${value === opt.value ? 'bg-neon-blue/20 text-neon-blue font-medium' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, roleFilter, statusFilter, page, size]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                size,
                ...(searchTerm && { search: searchTerm }),
                ...(roleFilter && { role: roleFilter }),
                ...(statusFilter && { isSuspended: statusFilter === 'Suspended' })
            };
            const data = await getAllUsers(params);
            setUsers(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
            showError('Error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (user) => {
        if (user.isSuspended) {
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

    const roleOptions = [
        { value: '', label: 'All Roles' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'TEACHER', label: 'Teacher' },
        { value: 'STUDENT', label: 'Student' }
    ];

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'Active', label: 'Active' },
        { value: 'Suspended', label: 'Suspended' }
    ];

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl animate-pulse flex items-center gap-2">
                    <ShieldAlert className="text-neon-blue" />
                    Loading users...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold font-orbitron text-white neon-text tracking-wider">User Management</h1>
                </div>
                <div className="flex gap-4 flex-wrap justify-end">
                    <CustomDropdown 
                        options={roleOptions} 
                        value={roleFilter} 
                        onChange={(val) => { setRoleFilter(val); setPage(0); }} 
                        label="All Roles"
                        icon={Filter}
                    />
                    <CustomDropdown 
                        options={statusOptions} 
                        value={statusFilter} 
                        onChange={(val) => { setStatusFilter(val); setPage(0); }} 
                        label="All Statuses"
                        icon={ShieldAlert}
                    />
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue group-focus-within:text-white transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 glass-panel text-white placeholder-gray-400 border border-white/10 hover:border-neon-blue/50 focus:outline-none focus:ring-2 focus:ring-neon-blue rounded-lg shadow-lg transition-all"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                        />
                    </div>
                </div>
            </div>

            <div className="glass-panel overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-neon-blue/20 border border-neon-blue flex items-center justify-center text-neon-blue font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white group-hover:text-neon-blue transition-colors">{user.username}</div>
                                                <div className="text-sm text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${user.role === 'ADMIN' ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50' :
                                            user.role === 'TEACHER' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                                'bg-gray-500/20 text-gray-300 border border-gray-500/50'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${user.isSuspended ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'
                                            }`}>
                                            {user.isSuspended ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium space-x-3">
                                        <button
                                            onClick={() => handleSuspend(user)}
                                            className={`p-2 rounded-lg transition-all transform hover:scale-110 ${user.isSuspended ? 'text-green-400 hover:bg-green-400/20' : 'text-orange-400 hover:bg-orange-400/20'}`}
                                            title={user.isSuspended ? "Activate" : "Suspend"}
                                        >
                                            {user.isSuspended ? <CheckCircle size={20} /> : <Ban size={20} />}
                                        </button>
                                        <button 
                                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all transform hover:scale-110" 
                                            title="Delete" 
                                            onClick={() => handleDelete(user)}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 p-4 glass-panel rounded-lg border border-white/10 shadow-lg">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg border border-white/10 hover:border-neon-blue/50"
                    >
                        Previous
                    </button>
                    <span className="text-gray-300 font-medium">
                        Page <span className="text-neon-blue font-bold mx-1">{page + 1}</span> of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg border border-white/10 hover:border-neon-blue/50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
