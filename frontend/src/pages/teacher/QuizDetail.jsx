import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ArrowLeft, Save, X, CheckCircle, Image } from 'lucide-react';
import TeacherNavbar from '../../components/TeacherNavbar';
import Footer from '../../components/Footer';

import { getTeacherQuiz, addQuestion, updateQuestion, deleteQuestion } from '../../api/quizApi';
import { showSuccess, showError, showConfirm } from '../../utils/sweetAlert';

const QuizDetail = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [formData, setFormData] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        marks: 1,
        imageUrl: ''
    });

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const data = await getTeacherQuiz(quizId);
            setQuiz(data);
        } catch (error) {
            showError('Failed to load quiz');
            navigate('/teacher/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            questionText: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctAnswer: 'A',
            explanation: '',
            marks: 1,
            imageUrl: ''
        });
        setEditingQuestion(null);
        setShowAddForm(false);
    };

    const handleEdit = (question) => {
        setFormData({
            questionText: question.questionText,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || '',
            marks: question.marks,
            imageUrl: question.imageUrl || ''
        });
        setEditingQuestion(question.id);
        setShowAddForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.questionText || !formData.optionA || !formData.optionB ||
            !formData.optionC || !formData.optionD) {
            showError('Please fill all required fields');
            return;
        }

        try {
            if (editingQuestion) {
                await updateQuestion(editingQuestion, formData);
                showSuccess('Question updated successfully');
            } else {
                await addQuestion(quizId, formData);
                showSuccess('Question added successfully');
            }
            resetForm();
            fetchQuiz();
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to save question');
        }
    };

    const handleDelete = async (questionId) => {
        const confirmed = await showConfirm('Delete Question', 'Are you sure you want to delete this question?');
        if (confirmed) {
            try {
                await deleteQuestion(questionId);
                showSuccess('Question deleted');
                fetchQuiz();
            } catch (error) {
                showError('Failed to delete question');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center">

                <div className="relative z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="relative z-10">
                <TeacherNavbar />
                <div className="pt-24 pb-12 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <button
                            onClick={() => navigate('/teacher/quizzes')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft size={20} /> Back to Quizzes
                        </button>

                        {/* Quiz Header */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{quiz?.title}</h1>
                                    <p className="text-gray-400">{quiz?.description}</p>
                                    <div className="flex gap-4 mt-4 text-sm text-gray-400">
                                        <span>Questions: {quiz?.questions?.length || 0}</span>
                                        <span>Total Marks: {quiz?.totalMarks}</span>
                                        <span>Duration: {quiz?.duration} mins</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/teacher/quiz/${quizId}/edit`}
                                    className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition"
                                >
                                    <Edit size={18} /> Edit Quiz
                                </Link>
                            </div>
                        </div>

                        {/* Add Question Button */}
                        {!showAddForm && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:opacity-90 transition mb-6"
                            >
                                <Plus size={20} /> Add Question
                            </button>
                        )}

                        {/* Question Form */}
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-white">
                                        {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                    </h2>
                                    <button onClick={resetForm} className="text-gray-400 hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Question Text *</label>
                                        <textarea
                                            value={formData.questionText}
                                            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                            rows={3}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                            placeholder="Enter your question"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {['A', 'B', 'C', 'D'].map((option) => (
                                            <div key={option}>
                                                <label className="block text-gray-300 mb-2">Option {option} *</label>
                                                <input
                                                    type="text"
                                                    value={formData[`option${option}`]}
                                                    onChange={(e) => setFormData({ ...formData, [`option${option}`]: e.target.value })}
                                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                                    placeholder={`Option ${option}`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-300 mb-2">Correct Answer *</label>
                                            <select
                                                value={formData.correctAnswer}
                                                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                            >
                                                <option value="A">Option A</option>
                                                <option value="B">Option B</option>
                                                <option value="C">Option C</option>
                                                <option value="D">Option D</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-300 mb-2">Marks</label>
                                            <input
                                                type="number"
                                                value={formData.marks}
                                                onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 1 })}
                                                min="1"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2">Explanation (shown after submission)</label>
                                        <textarea
                                            value={formData.explanation}
                                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                            rows={2}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                            placeholder="Explain the correct answer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2">Image URL (optional)</label>
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg hover:opacity-90 transition"
                                    >
                                        <Save size={20} /> {editingQuestion ? 'Update Question' : 'Add Question'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Questions List */}
                        <div className="space-y-4">
                            {quiz?.questions?.map((question, index) => (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start gap-3">
                                            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                                                Q{index + 1}
                                            </span>
                                            <div>
                                                <p className="text-white font-medium">{question.questionText}</p>
                                                {question.imageUrl && (
                                                    <img src={question.imageUrl} alt="Question" className="mt-2 max-w-xs rounded-lg" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(question)}
                                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(question.id)}
                                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        {['A', 'B', 'C', 'D'].map((opt) => (
                                            <div
                                                key={opt}
                                                className={`p-3 rounded-lg flex items-center gap-2 ${question.correctAnswer === opt
                                                    ? 'bg-green-500/20 border border-green-500/50'
                                                    : 'bg-white/5 border border-white/10'
                                                    }`}
                                            >
                                                {question.correctAnswer === opt && (
                                                    <CheckCircle size={16} className="text-green-400" />
                                                )}
                                                <span className="text-gray-300">
                                                    <span className="font-medium">{opt}.</span> {question[`option${opt}`]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Marks: {question.marks}</span>
                                        {question.explanation && (
                                            <span className="text-purple-400">Has explanation</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {(!quiz?.questions || quiz.questions.length === 0) && !showAddForm && (
                            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-gray-400">No questions added yet. Click "Add Question" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default QuizDetail;
