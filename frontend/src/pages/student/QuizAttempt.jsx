import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';

import { getStudentQuiz, submitQuiz } from '../../api/quizApi';
import { showError, showConfirm, showSuccess } from '../../utils/sweetAlert';

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuiz();

        // Prevent back navigation
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [quizId]);

    useEffect(() => {
        if (timeLeft <= 0 && quiz) {
            handleSubmit(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, quiz]);

    // Warn before leaving
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const fetchQuiz = async () => {
        try {
            const data = await getStudentQuiz(quizId);
            setQuiz(data);
            setTimeLeft(data.duration * 60); // Convert to seconds
        } catch (error) {
            showError('Failed to load quiz');
            navigate('/student/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = useCallback(async (autoSubmit = false) => {
        if (submitting) return;

        if (!autoSubmit) {
            const unanswered = quiz.questions.filter(q => !answers[q.id]).length;
            let message = 'Are you sure you want to submit the quiz?';
            if (unanswered > 0) {
                message = `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`;
            }

            const confirmed = await showConfirm('Submit Quiz', message);
            if (!confirmed) return;
        }

        setSubmitting(true);
        try {
            const result = await submitQuiz(quizId, answers);
            navigate(`/student/quiz/${quizId}/result`, { state: { result } });
        } catch (error) {
            showError('Failed to submit quiz');
            setSubmitting(false);
        }
    }, [quiz, answers, quizId, navigate, submitting]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 flex items-center justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-500"></div>
            </div>
        );
    }

    const question = quiz?.questions?.[currentQuestion];
    const isLastQuestion = currentQuestion === (quiz?.questions?.length || 0) - 1;
    const isFirstQuestion = currentQuestion === 0;

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">

            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/10 z-50 px-6 py-4 shadow-sm dark:shadow-none">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{quiz?.title}</h1>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse' : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                        }`}>
                        <Clock size={20} />
                        <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            <div className="pt-24 pb-32 px-6">
                <div className="container mx-auto max-w-3xl">
                    {/* Question Navigation */}
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                        {quiz?.questions?.map((q, index) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-10 h-10 rounded-lg font-medium transition ${currentQuestion === index
                                    ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md'
                                    : answers[q.id]
                                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50'
                                        : 'bg-white dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-transparent'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Question Card */}
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 p-8 shadow-xl dark:shadow-none"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-lg font-medium">
                                Question {currentQuestion + 1} of {quiz?.questions?.length}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">({question?.marks} mark{question?.marks > 1 ? 's' : ''})</span>
                        </div>

                        <h2 className="text-xl text-gray-900 dark:text-white mb-6">{question?.questionText}</h2>

                        {question?.imageUrl && (
                            <img
                                src={question.imageUrl}
                                alt="Question"
                                className="max-w-full rounded-lg mb-6"
                            />
                        )}

                        <div className="space-y-3">
                            {['A', 'B', 'C', 'D'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerSelect(question.id, option)}
                                    className={`w-full text-left p-4 rounded-lg border transition ${answers[question.id] === option
                                        ? 'bg-purple-50 dark:bg-purple-500/20 border-purple-500 text-purple-900 dark:text-white'
                                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                        }`}
                                >
                                    <span className="font-medium mr-3">{option}.</span>
                                    {question?.[`option${option}`]}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/50 backdrop-blur-md border-t border-gray-200 dark:border-white/10 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-none">
                <div className="container mx-auto max-w-3xl flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        disabled={isFirstQuestion}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${isFirstQuestion
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20'
                            }`}
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>

                    <div className="text-gray-500 dark:text-gray-400 font-medium">
                        {Object.keys(answers).length} of {quiz?.questions?.length} answered
                    </div>

                    {isLastQuestion ? (
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                            ) : (
                                <>
                                    <Send size={20} /> Submit Quiz
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                            className="flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition shadow-md"
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizAttempt;
