import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Users, BookOpen, UserCheck, Activity, CheckCircle, XCircle } from 'lucide-react';
import DashboardScene from '../../components/DashboardScene';
import api from '../../services/api';
import Swal from 'sweetalert2';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-panel p-6 flex items-center hover-lift">
        <div className={`p-4 rounded-full ${color} bg-opacity-20 border mr-4`}>
            <Icon size={24} className={color.replace('bg-', 'text-').replace('border-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        activeCourses: 0,
        totalEnrollments: 0
    });
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        // Fetch Stats
        // api.get('/admin/dashboard').then(res => setStats(res.data)); // Uncomment when API ready
        setStats({
            totalUsers: 150,
            totalStudents: 120,
            totalTeachers: 30,
            totalCourses: 45,
            activeCourses: 40,
            totalEnrollments: 300
        });

        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/admin/applications');
            setApplications(res.data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        }
    };

    const handleApprove = async (appId) => {
        try {
            await api.post(`/admin/applications/${appId}/approve`);
            Swal.fire('Approved!', 'Teacher has been approved.', 'success');
            fetchApplications();
        } catch (error) {
            Swal.fire('Error', 'Failed to approve application.', 'error');
        }
    };

    const handleReject = async (appId) => {
        try {
            await api.post(`/admin/applications/${appId}/reject`);
            Swal.fire('Rejected', 'Application rejected.', 'info');
            fetchApplications();
        } catch (error) {
            Swal.fire('Error', 'Failed to reject application.', 'error');
        }
    };

    const userDistributionData = [
        { name: 'Students', value: stats.totalStudents },
        { name: 'Teachers', value: stats.totalTeachers },
    ];

    const COLORS = ['#00f3ff', '#10B981'];

    return (
        <div className="space-y-6">
            <DashboardScene />

            <h1 className="text-2xl font-bold font-orbitron text-white neon-text">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-neon-blue bg-neon-blue border-neon-blue" />
                <StatCard title="Total Courses" value={stats.totalCourses} icon={BookOpen} color="text-emerald-400 bg-emerald-500 border-emerald-500" />
                <StatCard title="Active Courses" value={stats.activeCourses} icon={UserCheck} color="text-neon-purple bg-neon-purple border-neon-purple" />
                <StatCard title="Total Enrollments" value={stats.totalEnrollments} icon={Activity} color="text-orange-400 bg-orange-500 border-orange-500" />
            </div>

            {/* Teacher Approvals Section */}
            <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-white mb-4">Pending Teacher Applications</h2>
                {applications.length === 0 ? (
                    <p className="text-gray-400">No pending applications.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-gray-300">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="p-3">User</th>
                                    <th className="p-3">Experience</th>
                                    <th className="p-3">Resume</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app.id} className="border-b border-gray-800 hover:bg-white/5">
                                        <td className="p-3">
                                            <div className="font-bold text-white">{app.user.username}</div>
                                            <div className="text-sm text-gray-400">{app.user.email}</div>
                                        </td>
                                        <td className="p-3">{app.experience}</td>
                                        <td className="p-3">
                                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Resume</a>
                                        </td>
                                        <td className="p-3 flex space-x-2">
                                            <button onClick={() => handleApprove(app.id)} className="p-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40">
                                                <CheckCircle size={18} />
                                            </button>
                                            <button onClick={() => handleReject(app.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40">
                                                <XCircle size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold mb-4 text-white">User Distribution</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                                    {userDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 30, 0.9)', border: '1px solid rgba(0, 243, 255, 0.3)', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold mb-4 text-white">Course Growth</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: 'Jan', courses: 4 }, { name: 'Feb', courses: 7 }, { name: 'Mar', courses: 12 }, { name: 'Apr', courses: 18 }, { name: 'May', courses: 25 }, { name: 'Jun', courses: 45 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 30, 0.9)', border: '1px solid rgba(0, 243, 255, 0.3)', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                                <Bar dataKey="courses" fill="#00f3ff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
