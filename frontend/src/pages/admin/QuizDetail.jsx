import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Calendar, FileQuestion, Users } from 'lucide-react';
import api from '../../api/axiosConfig';
import Navbar from '../../components/Navbar';
import ThreeBackground from '../../components/ThreeBackground';

const AdminQuizDetail = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizDetails();
        fetchQuizAttempts();
    }, [quizId]);

    const fetchQuizDetails = async () => {
        try {
            console.log(`Fetching quiz details for ID: ${quizId}`);
            const response = await api.get(`/admin/quizzes/${quizId}`);
            console.log('Quiz details:', response.data);
            setQuiz(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching quiz details:', error);
            setError(error.response?.data?.message || 'Failed to load quiz details');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizAttempts = async () => {
        try {
            console.log(`Fetching attempts for quiz ID: ${quizId}`);
            const response = await api.get(`/admin/quizzes/${quizId}/attempts`);
            console.log('Quiz attempts:', response.data);
            setAttempts(response.data);
        } catch (error) {
            console.error('Error fetching quiz attempts:', error);
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <ThreeBackground />
                <Navbar />
                <div className="relative z-10 text-white text-xl">Loading quiz details...</div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="relative min-h-screen">
                <ThreeBackground />
                <Navbar />
                <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto">
                    <div className="glass-panel p-8 text-center">
                        <p className="text-red-400 text-xl">{error || 'Quiz not found'}</p>
                        <Link to="/admin/quizzes" className="text-neon-blue hover:text-neon-purple mt-4 inline-block">
                            ← Back to Quiz Management
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <ThreeBackground />
            <Navbar />
            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/quizzes"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Quizzes</span>
                    </Link>
                    <h1 className="text-3xl font-bold font-orbitron text-white neon-text">{quiz.title}</h1>
                </div>

                {/* Quiz Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Status</p>
                                <div className="mt-2">
                                    {quiz.isPublished ? (
                                        <span className="flex items-center gap-1 text-green-400">
                                            <CheckCircle size={20} /> Published
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-yellow-400">
                                            <XCircle size={20} /> Draft
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Questions</p>
                                <p className="text-2xl font-bold text-white">{quiz.questionCount || 0}</p>
                            </div>
                            <FileQuestion className="text-neon-blue" size={32} />
                        </div>
                    </div>
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Marks</p>
                                <p className="text-2xl font-bold text-white">{quiz.totalMarks || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Attempts</p>
                                <p className="text-2xl font-bold text-white">{attempts.length}</p>
                            </div>
                            <Users className="text-neon-purple" size={32} />
                        </div>
                    </div>
                </div>

                {/* Quiz Details */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quiz Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div>
                            <p className="text-gray-400 text-sm">Teacher</p>
                            <p className="text-white font-medium">{quiz.createdByName}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Course</p>
                            <p className="text-white font-medium">{quiz.courseName || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Duration</p>
                            <p className="text-white font-medium">{quiz.duration ? `${quiz.duration} minutes` : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Created</p>
                            <p className="text-white font-medium">
                                {new Date(quiz.createdAt).toLocaleDateString()} {new Date(quiz.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                    {quiz.description && (
                        <div className="mt-4">
                            <p className="text-gray-400 text-sm">Description</p>
                            <p className="text-white">{quiz.description}</p>
                        </div>
                    )}
                </div>

                {/* Student Attempts */}
                <div className="glass-panel overflow-hidden">
                    <div className="p-6 pb-0">
                        <h2 className="text-xl font-bold text-white mb-4">Student Attempts</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-gray-400 font-medium">Student</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Score</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Percentage</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Correct Answers</th>
                                    <th className="text-left p-4 text-gray-400 font-medium">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-gray-400">
                                            No attempts yet
                                        </td>
                                    </tr>
                                ) : (
                                    attempts.map((attempt) => (
                                        <tr key={attempt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white font-medium">{attempt.studentName}</td>
                                            <td className="p-4 text-gray-300">{attempt.score}/{attempt.totalMarks}</td>
                                            <td className="p-4">
                                                <span className={`font-semibold ${attempt.percentage >= 80 ? 'text-green-400' :
                                                        attempt.percentage >= 60 ? 'text-yellow-400' :
                                                            'text-red-400'
                                                    }`}>
                                                    {attempt.percentage?.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                {attempt.correctAnswers}/{attempt.totalQuestions}
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                {new Date(attempt.submittedAt).toLocaleDateString()} {new Date(attempt.submittedAt).toLocaleTimeString()}
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

export default AdminQuizDetail;
