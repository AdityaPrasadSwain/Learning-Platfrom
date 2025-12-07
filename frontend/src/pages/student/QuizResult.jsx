import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, ArrowLeft, RotateCcw, Home } from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';


const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    if (!result) {
        navigate('/student/quizzes');
        return null;
    }

    const percentage = result.percentage || 0;
    const isPassed = percentage >= 50;

    const getGrade = () => {
        if (percentage >= 90) return { grade: 'A+', color: 'text-green-400', message: 'Excellent!' };
        if (percentage >= 80) return { grade: 'A', color: 'text-green-400', message: 'Great job!' };
        if (percentage >= 70) return { grade: 'B', color: 'text-blue-400', message: 'Good work!' };
        if (percentage >= 60) return { grade: 'C', color: 'text-yellow-400', message: 'Not bad!' };
        if (percentage >= 50) return { grade: 'D', color: 'text-orange-400', message: 'You passed!' };
        return { grade: 'F', color: 'text-red-400', message: 'Keep practicing!' };
    };

    const gradeInfo = getGrade();

    const handleDownloadResult = async () => {
        try {
            // Show loading alert
            const { showLoading, showSuccess, showError, Swal } = await import('../../utils/sweetAlert');
            showLoading('Generating certificate...');

            const api = (await import('../../api/axiosConfig')).default;
            const response = await api.get(`/student/quiz/quizzes/${result.quizId}/result/download`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `quiz_result_${result.quizId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            Swal.close();
            await showSuccess('Success', 'Certificate downloaded successfully');
        } catch (error) {
            console.error('Error downloading result:', error);
            const { Swal, showError } = await import('../../utils/sweetAlert');
            Swal.close();
            showError('Error', 'Failed to download certificate');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">

            <div className="relative z-10">
                <StudentNavbar />
                <div className="pt-24 pb-12 px-6">
                    <div className="container mx-auto max-w-4xl">
                        {/* Result Summary */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8 text-center shadow-xl dark:shadow-none"
                        >
                            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${isPassed ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                                <Trophy size={48} className={isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{result.quizTitle}</h1>
                            <p className={`text-xl ${gradeInfo.color} font-medium mb-6`}>{gradeInfo.message}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-transparent">
                                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{result.score}</p>
                                    <p className="text-gray-600 dark:text-gray-400">Score</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-transparent">
                                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{result.totalMarks}</p>
                                    <p className="text-gray-600 dark:text-gray-400">Total Marks</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-transparent">
                                    <p className={`text-4xl font-bold ${gradeInfo.color}`}>{percentage.toFixed(1)}%</p>
                                    <p className="text-gray-600 dark:text-gray-400">Percentage</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-transparent">
                                    <p className={`text-4xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</p>
                                    <p className="text-gray-600 dark:text-gray-400">Grade</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-sm font-medium">
                                <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle size={18} /> {result.correctAnswers} Correct
                                </span>
                                <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <XCircle size={18} /> {result.totalQuestions - result.correctAnswers} Wrong
                                </span>
                            </div>
                        </motion.div>

                        {/* Question Review */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Answer Review</h2>
                        <div className="space-y-4">
                            {result.questionResults?.map((q, index) => (
                                <motion.div
                                    key={q.questionId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border p-6 shadow-md dark:shadow-none ${q.isCorrect ? 'border-green-200 dark:border-green-500/30' : 'border-red-200 dark:border-red-500/30'}`}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${q.isCorrect ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                            {q.isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gray-900 dark:text-white font-medium mb-1">Q{index + 1}. {q.questionText}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">{q.marks} mark{q.marks > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {['A', 'B', 'C', 'D'].map((opt) => {
                                            const isSelected = q.selectedAnswer === opt;
                                            const isCorrect = q.correctAnswer === opt;

                                            let bgClass = 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10';
                                            if (isCorrect) bgClass = 'bg-green-100 dark:bg-green-500/20 border-green-500/50';
                                            else if (isSelected && !isCorrect) bgClass = 'bg-red-100 dark:bg-red-500/20 border-red-500/50';

                                            return (
                                                <div
                                                    key={opt}
                                                    className={`p-3 rounded-lg border ${bgClass}`}
                                                >
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        <span className="font-medium">{opt}.</span> {q[`option${opt}`]}
                                                    </span>
                                                    {isCorrect && (
                                                        <span className="ml-2 text-green-600 dark:text-green-400 text-sm font-medium">(Correct)</span>
                                                    )}
                                                    {isSelected && !isCorrect && (
                                                        <span className="ml-2 text-red-600 dark:text-red-400 text-sm font-medium">(Your answer)</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {q.explanation && (
                                        <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-lg p-4">
                                            <p className="text-purple-700 dark:text-purple-400 font-medium mb-1">Explanation:</p>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">{q.explanation}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mt-8 justify-center">
                            <Link
                                to="/student/quizzes"
                                className="flex items-center gap-2 bg-gray-600 dark:bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-white/20 transition"
                            >
                                <ArrowLeft size={20} /> Back to Quizzes
                            </Link>
                            <Link
                                to={`/student/quiz/${result.quizId}/start`}
                                className="flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition"
                            >
                                <RotateCcw size={20} /> Retake Quiz
                            </Link>
                            <button
                                onClick={handleDownloadResult}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            >
                                <Trophy size={20} /> Download Certificate
                            </button>
                            <Link
                                to="/student/dashboard"
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition shadow-md"
                            >
                                <Home size={20} /> Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
