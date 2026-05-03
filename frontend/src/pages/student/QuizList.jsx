import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, Clock, Award, CheckCircle, Play, Filter, Search } from 'lucide-react';

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
        <div className="text-white">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold font-orbitron">Available <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Quizzes</span></h1>
                <p className="text-gray-400 mt-1">Test your knowledge and track your scores.</p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Search quizzes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="flex gap-2">
                    {['all', 'not-attempted', 'attempted'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${filter === f
                                ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}>
                            {f.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl font-orbitron animate-pulse text-cyan-400">Loading quizzes...</div>
                </div>
            ) : filteredQuizzes.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <FileQuestion size={56} className="mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold mb-2">No Quizzes Found</h3>
                    <p className="text-gray-400 text-sm">
                        {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'No quizzes are available at the moment'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredQuizzes.map((quiz, index) => (
                        <motion.div key={quiz.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all group"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{quiz.title}</h3>
                                    {quiz.hasAttempted && (
                                        <span className="flex items-center gap-1 bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                            <CheckCircle size={10} /> DONE
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                                    {quiz.description || 'Test your understanding of this subject with a quick assessment.'}
                                </p>

                                {quiz.courseName && (
                                    <p className="text-cyan-400 text-[11px] mb-4 font-bold uppercase tracking-wide">
                                        {quiz.courseName}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-6">
                                    <span className="flex items-center gap-1.5"><FileQuestion size={14} /> {quiz.questionCount} Qs</span>
                                    <span className="flex items-center gap-1.5"><Award size={14} /> {quiz.totalMarks} Marks</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {quiz.duration}m</span>
                                </div>

                                {quiz.hasAttempted && quiz.bestScore !== null && (
                                    <div className="bg-white/5 rounded-xl p-3 mb-5 border border-white/5">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">BEST SCORE</p>
                                        <p className="text-lg font-bold text-white">
                                            {quiz.bestScore} <span className="text-gray-500 text-sm">/ {quiz.totalMarks}</span>
                                        </p>
                                    </div>
                                )}

                                <Link to={`/student/quiz/${quiz.id}/start`}>
                                    <button className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2">
                                        <Play size={16} fill="currentColor" />
                                        {quiz.hasAttempted ? 'RETAKE QUIZ' : 'START QUIZ'}
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentQuizList;
