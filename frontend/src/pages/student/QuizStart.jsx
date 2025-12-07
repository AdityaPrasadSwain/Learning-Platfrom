import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, FileQuestion, Award, AlertTriangle, Play, ArrowLeft } from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';

import { getStudentQuiz } from '../../api/quizApi';
import { showError } from '../../utils/sweetAlert';

const QuizStart = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const data = await getStudentQuiz(quizId);
            setQuiz(data);
        } catch (error) {
            showError('Failed to load quiz');
            navigate('/student/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = () => {
        navigate(`/student/quiz/${quizId}/attempt`);
    };

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center">

                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">

            <div className="relative z-10">
                <StudentNavbar />
                <div className="pt-24 pb-12 px-6">
                    <div className="container mx-auto max-w-2xl">
                        <button
                            onClick={() => navigate('/student/quizzes')}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
                        >
                            <ArrowLeft size={20} /> Back to Quizzes
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-8 shadow-xl dark:shadow-none"
                        >
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{quiz?.title}</h1>

                            {quiz?.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{quiz.description}</p>
                            )}

                            {quiz?.courseName && (
                                <p className="text-purple-600 dark:text-purple-400 mb-6 font-medium">Course: {quiz.courseName}</p>
                            )}

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 text-center border border-gray-100 dark:border-transparent">
                                    <FileQuestion size={24} className="mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz?.questionCount}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Questions</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 text-center border border-gray-100 dark:border-transparent">
                                    <Award size={24} className="mx-auto text-green-600 dark:text-green-400 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz?.totalMarks}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Marks</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 text-center border border-gray-100 dark:border-transparent">
                                    <Clock size={24} className="mx-auto text-yellow-500 dark:text-yellow-400 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz?.duration}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Minutes</p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h3 className="text-yellow-700 dark:text-yellow-400 font-semibold mb-2">Instructions</h3>
                                        <ul className="text-yellow-800 dark:text-gray-300 text-sm space-y-1">
                                            <li>• Once started, the timer cannot be paused</li>
                                            <li>• Quiz will auto-submit when time runs out</li>
                                            <li>• Do not refresh or navigate away during the quiz</li>
                                            <li>• Select one answer for each question</li>
                                            <li>• You can review and change answers before submitting</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartQuiz}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white py-4 rounded-lg hover:opacity-90 transition text-lg font-semibold shadow-md"
                            >
                                <Play size={24} /> Start Quiz
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default QuizStart;
