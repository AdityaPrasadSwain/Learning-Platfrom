import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, Clock, Award, CheckCircle, Play, Filter } from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';

import { getAvailableQuizzes } from '../../api/quizApi';
import { showError } from '../../utils/sweetAlert';

const StudentQuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, attempted, not-attempted
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        filterQuizzes();
    }, [quizzes, filter, searchTerm]);

    const fetchQuizzes = async () => {
        try {
            const data = await getAvailableQuizzes();
            setQuizzes(data);
        } catch (error) {
            showError('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const filterQuizzes = () => {
        let result = [...quizzes];

        if (filter === 'attempted') {
            result = result.filter(q => q.hasAttempted);
        } else if (filter === 'not-attempted') {
            result = result.filter(q => !q.hasAttempted);
        }

        if (searchTerm) {
            result = result.filter(q =>
                q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredQuizzes(result);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">

            <div className="relative z-10">
                <StudentNavbar />
                <div className="pt-24 pb-12 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Quizzes</h1>
                            <p className="text-gray-600 dark:text-gray-400">Test your knowledge with these quizzes</p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 min-w-[200px] bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 shadow-sm dark:shadow-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg transition ${filter === 'all'
                                        ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md'
                                        : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-transparent'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('not-attempted')}
                                    className={`px-4 py-2 rounded-lg transition ${filter === 'not-attempted'
                                        ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md'
                                        : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-transparent'
                                        }`}
                                >
                                    New
                                </button>
                                <button
                                    onClick={() => setFilter('attempted')}
                                    className={`px-4 py-2 rounded-lg transition ${filter === 'attempted'
                                        ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md'
                                        : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-transparent'
                                        }`}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : filteredQuizzes.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none">
                                <FileQuestion size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                <h3 className="text-xl text-gray-900 dark:text-white mb-2">No Quizzes Found</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {searchTerm || filter !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'No quizzes are available at the moment'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredQuizzes.map((quiz, index) => (
                                    <motion.div
                                        key={quiz.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-purple-500/50 transition shadow-lg dark:shadow-none"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                                                {quiz.hasAttempted && (
                                                    <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                                                        <CheckCircle size={12} /> Done
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                {quiz.description || 'No description available'}
                                            </p>

                                            {quiz.courseName && (
                                                <p className="text-purple-600 dark:text-purple-400 text-sm mb-4 font-medium">
                                                    Course: {quiz.courseName}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <FileQuestion size={14} /> {quiz.questionCount} Qs
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Award size={14} /> {quiz.totalMarks} marks
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} /> {quiz.duration} min
                                                </span>
                                            </div>

                                            {quiz.hasAttempted && quiz.bestScore !== null && (
                                                <div className="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-3 mb-4 border border-purple-100 dark:border-transparent">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Best Score</p>
                                                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                                        {quiz.bestScore}/{quiz.totalMarks}
                                                    </p>
                                                </div>
                                            )}

                                            <Link
                                                to={`/student/quiz/${quiz.id}/start`}
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white py-2 rounded-lg hover:opacity-90 transition shadow-md"
                                            >
                                                <Play size={18} /> {quiz.hasAttempted ? 'Retake Quiz' : 'Start Quiz'}
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default StudentQuizList;
