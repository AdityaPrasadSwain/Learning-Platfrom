import React, { useState, useEffect } from 'react';
import { Search, Trash2, Ban, CheckCircle, ArrowLeft, Filter, ShieldAlert, User, Mail, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsers, suspendUser, activateUser, deleteUser } from '../../api/adminApi';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const CustomDropdown = ({ options, value, onChange, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-all shadow-sm focus:outline-none"
            >
                {Icon && <Icon size={16} className="text-indigo-500" />}
                <span className="text-sm font-bold">{value ? options.find(o => o.value === value)?.label : label}</span>
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors ${value === opt.value ? 'bg-indigo-500 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
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
    const navigate = useNavigate();

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
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400 font-orbitron">Mapping Directory...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 transition-colors duration-500">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Dashboard</span>
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Control account access, roles, and platform permissions.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <CustomDropdown 
                        options={roleOptions} 
                        value={roleFilter} 
                        onChange={(val) => { setRoleFilter(val); setPage(0); }} 
                        label="All Roles"
                        icon={Shield}
                    />
                    <CustomDropdown 
                        options={statusOptions} 
                        value={statusFilter} 
                        onChange={(val) => { setStatusFilter(val); setPage(0); }} 
                        label="All Statuses"
                        icon={ShieldAlert}
                    />
                    <div className="relative group max-w-xs w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-panel overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Identity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">System Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Security Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{user.username}</div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-widest rounded-full ${
                                            user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' :
                                            user.role === 'TEACHER' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                                            'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-widest rounded-full ${
                                            user.isSuspended ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                        }`}>
                                            {user.isSuspended ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleSuspend(user)}
                                                className={`p-2.5 rounded-xl transition-all transform hover:scale-110 ${user.isSuspended ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white' : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white'}`}
                                                title={user.isSuspended ? "Activate Account" : "Suspend Account"}
                                            >
                                                {user.isSuspended ? <CheckCircle size={18} /> : <Ban size={18} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user)}
                                                className="p-2.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all transform hover:scale-110" 
                                                title="Delete Account" 
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-lg">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-6 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500"
                    >
                        Previous
                    </button>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Page <span className="text-indigo-500 font-bold mx-1">{page + 1}</span> of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="px-6 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
