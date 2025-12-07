import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, TrendingUp, FileQuestion, ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../api/axiosConfig';
import Navbar from '../../components/Navbar';
import ThreeBackground from '../../components/ThreeBackground';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const AdminQuizManagement = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizzes();
        fetchStats();
    }, []);

    const fetchQuizzes = async () => {
        try {
            console.log('Fetching quizzes from /admin/quizzes');
            const response = await api.get('/admin/quizzes');
            console.log('Quizzes response:', response.data);
            setQuizzes(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            console.error('Error response:', error.response);
            setError(error.response?.data?.message || 'Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            console.log('Fetching stats from /admin/quizzes/stats');
            const response = await api.get('/admin/quizzes/stats');
            console.log('Stats response:', response.data);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            console.error('Error response:', error.response);
        }
    };

    const handleTogglePublish = async (quiz) => {
        const action = quiz.isPublished ? 'unpublish' : 'publish';
        const confirmed = await showConfirm(
            `${action.charAt(0).toUpperCase() + action.slice(1)} Quiz?`,
            `Are you sure you want to ${action} "${quiz.title}"?`
        );

        if (confirmed) {
            showLoading(`${action.charAt(0).toUpperCase() + action.slice(1)}ing quiz...`);
            try {
                await api.put(`/admin/quizzes/${quiz.id}/toggle-publish`);
                Swal.close();
                await showSuccess(
                    `${action.charAt(0).toUpperCase() + action.slice(1)}ed!`,
                    `"${quiz.title}" has been ${action}ed successfully`
                );
                fetchQuizzes();
                fetchStats();
            } catch (error) {
                console.error('Error toggling publish status:', error);
                Swal.close();
                showError('Error', 'Failed to toggle publish status');
            }
        }
    };
    const handleDelete = async (quiz) => {
        const confirmed = await showConfirm(
            'Delete Quiz?',
            `Are you sure you want to delete "${quiz.title}"? This action cannot be undone and will also delete all student attempts.`
        );

        if (confirmed) {
            showLoading('Deleting quiz...');
            try {
                await api.delete(`/admin/quizzes/${quiz.id}`);
                Swal.close();
                await showSuccess('Deleted!', `"${quiz.title}" has been deleted successfully`);
                fetchQuizzes();
                fetchStats();
            } catch (error) {
                console.error('Error deleting quiz:', error);
                Swal.close();
                showError('Error', 'Failed to delete quiz');
            }
        }
    };

    const handleDownloadReport = async () => {
        showLoading('Generating report...');
        try {
            const response = await api.get('/admin/quizzes/report', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `quiz_report_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            Swal.close();
            await showSuccess('Success', 'Report downloaded successfully');
        } catch (error) {
            console.error('Error downloading report:', error);
            Swal.close();
            showError('Error', 'Failed to download report');
        }
    };

    return (
        <div className="relative min-h-screen">
            <ThreeBackground />
            <Navbar />
            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto space-y-6 pb-12">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </Link>
                        <h1 className="text-3xl font-bold font-orbitron text-white neon-text">Quiz Management</h1>
                    </div>
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-bold font-orbitron shadow-[0_0_20px_rgba(59,130,246,0.5)] transform hover:scale-105 transition-all duration-300"
                    >
                        <FileQuestion size={20} />
                        Download Report
                    </button>
                </div>

                {error && (
                    <div className="glass-panel p-4 border-l-4 border-red-500">
                        <p className="text-red-400">Error: {error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Quizzes</p>
                                <p className="text-2xl font-bold text-white">{stats.totalQuizzes || 0}</p>
                            </div>
                            <FileQuestion className="text-neon-blue" size={32} />
                        </div>
                    </div>
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Published</p>
                                <p className="text-2xl font-bold text-green-400">{stats.publishedQuizzes || 0}</p>
                            </div>
                            <CheckCircle className="text-green-400" size={32} />
                        </div>
                    </div>
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Attempts</p>
                                <p className="text-2xl font-bold text-neon-purple">{stats.totalAttempts || 0}</p>
                            </div>
                            <TrendingUp className="text-neon-purple" size={32} />
                        </div>
                    </div>
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Average Score</p>
                                <p className="text-2xl font-bold text-yellow-400">{stats.averageScore?.toFixed(1) || 0}%</p>
                            </div>
                            <TrendingUp className="text-yellow-400" size={32} />
                        </div>
                    </div>
                </div>

                {/* Quiz Table */}
                <div className="glass-panel overflow-hidden">
                    <div className="p-6 pb-0">
                        <h2 className="text-xl font-bold text-white mb-4">All Quizzes</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Teacher</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Course</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Questions</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Total Marks</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizzes.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center p-8 text-gray-400">
                                            No quizzes found
                                        </td>
                                    </tr>
                                ) : (
                                    quizzes.map((quiz) => (
                                        <tr key={quiz.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white font-medium">{quiz.title}</td>
                                            <td className="p-4 text-gray-300">{quiz.createdByName}</td>
                                            <td className="p-4 text-gray-300">{quiz.courseName || 'N/A'}</td>
                                            <td className="p-4">
                                                {quiz.isPublished ? (
                                                    <span className="flex items-center gap-1 text-green-400">
                                                        <CheckCircle size={16} /> Published
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-yellow-400">
                                                        <XCircle size={16} /> Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-300">{quiz.questionCount}</td>
                                            <td className="p-4 text-gray-300">{quiz.totalMarks}</td>
                                            <td className="p-4 text-gray-300">
                                                {new Date(quiz.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/admin/quizzes/${quiz.id}`}
                                                        className="text-neon-blue hover:text-neon-purple transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleTogglePublish(quiz)}
                                                        className={`${quiz.isPublished ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'} transition-colors`}
                                                        title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                                                    >
                                                        {quiz.isPublished ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(quiz)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminQuizManagement;
