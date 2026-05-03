import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, Clock, User, Search, Filter, 
    CheckCircle, GraduationCap, ArrowRight, 
    Star, TrendingUp, Sparkles 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '../api/courseApi';
import { enrollInCourse, isEnrolled } from '../api/enrollmentApi';
import { showSuccess, showError, showLoading } from '../utils/sweetAlert';
import Swal from 'sweetalert2';

const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const role = localStorage.getItem('role');
    const isStudent = role === 'STUDENT';

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getAllCourses();

            if (isStudent) {
                const coursesWithEnrollment = await Promise.all(
                    data.map(async (course) => {
                        try {
                            const enrolled = await isEnrolled(course.id);
                            return { ...course, isEnrolled: enrolled };
                        } catch {
                            return { ...course, isEnrolled: false };
                        }
                    })
                );
                setCourses(coursesWithEnrollment);
            } else {
                setCourses(data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (e, courseId, courseTitle) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isStudent) {
            showError('Login Required', 'Please login as a student to enroll in courses');
            navigate('/login');
            return;
        }

        showLoading('Enrolling...');
        try {
            await enrollInCourse(courseId);
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Enrolled!',
                text: `You have been enrolled in ${courseTitle}`,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                navigate(`/payment/${courseId}`);
            });
        } catch (error) {
            console.error('Error enrolling:', error);
            Swal.close();
            showError('Enrollment Failed', error.response?.data?.message || 'Failed to enroll in course');
        }
    };

    const categories = ['All', ...new Set(courses.map(course => course.category).filter(Boolean))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-xl font-display font-medium animate-pulse text-brand-primary">Curating Excellence...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <header className="relative mb-16">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-secondary/20 rounded-full blur-[80px] pointer-events-none"></div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
                        <Sparkles size={16} className="text-brand-primary" />
                        <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Premium Content</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-display font-black text-slate-900 dark:text-white leading-tight">
                        Master Your <span className="gradient-text">Future</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mt-4 max-w-2xl leading-relaxed">
                        Join 10,000+ students learning world-class skills from industry experts. 
                        Your journey to mastery starts here.
                    </p>
                </motion.div>
            </header>

            {/* Search & Filter Bar */}
            <div className="sticky top-24 z-40 mb-12">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-white/10 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2"
                >
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by course title or topic..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-lg font-medium" 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        {/* Custom Category Dropdown */}
                        <div className="relative min-w-[200px]">
                            <button
                                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                className="w-full pl-12 pr-10 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-700 dark:text-slate-200 font-bold text-left hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-between group"
                            >
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-primary transition-colors" size={18} />
                                <span className="truncate">{selectedCategory}</span>
                                <motion.div
                                    animate={{ rotate: isCategoryMenuOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRight className="rotate-90 text-slate-400" size={16} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isCategoryMenuOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsCategoryMenuOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 p-2"
                                        >
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setIsCategoryMenuOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group/item ${
                                                        selectedCategory === cat
                                                            ? 'bg-brand-primary/10 text-brand-primary'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-primary'
                                                    }`}
                                                >
                                                    {cat}
                                                    {selectedCategory === cat && (
                                                        <CheckCircle size={14} className="text-brand-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
                
                {/* Stats / Results Count */}
                <div className="mt-4 flex justify-between items-center px-2">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Showing {filteredCourses.length} results
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <TrendingUp size={14} />
                            <span>Trending</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <AnimatePresence mode="popLayout">
                {filteredCourses.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="text-center py-32 glass-panel"
                    >
                        <BookOpen size={64} className="mx-auto mb-6 text-slate-300 dark:text-slate-700" />
                        <h2 className="text-2xl font-display font-bold mb-2 text-slate-900 dark:text-white">No matches found</h2>
                        <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, index) => (
                            <motion.div 
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <Link to={`/course/${course.id}`} className="block h-full group">
                                    <div className="h-full bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 flex flex-col">
                                        {/* Thumbnail Area */}
                                        <div className="h-52 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 group-hover:scale-110 transition-transform duration-700"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                                                    <GraduationCap size={40} className="text-white group-hover:scale-110 transition-transform" />
                                                </div>
                                            </div>
                                            
                                            {/* Badge */}
                                            <div className="absolute top-5 left-5">
                                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    {course.category || 'Expert'}
                                                </span>
                                            </div>
                                            
                                            {/* Rating Mockup */}
                                            <div className="absolute bottom-5 right-5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-white">
                                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                                <span className="text-xs font-bold">4.9</span>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                                    <User size={12} className="text-slate-500" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                                                    {course.instructorName || 'Expert Instructor'}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-display font-bold mb-3 text-slate-900 dark:text-white leading-tight group-hover:text-brand-primary transition-colors">
                                                {course.title}
                                            </h3>

                                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                {course.description || 'Master the essential skills in this comprehensive, project-based course designed for modern learners.'}
                                            </p>

                                            <div className="mt-auto space-y-6">
                                                <div className="flex items-center justify-between py-4 border-y border-slate-100 dark:border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-brand-primary" />
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{course.duration}m</span>
                                                    </div>
                                                    <div className="text-lg font-black text-slate-900 dark:text-white">
                                                        Free
                                                    </div>
                                                </div>

                                                {isStudent && (
                                                    <div onClick={(e) => e.preventDefault()}>
                                                        {course.isEnrolled ? (
                                                            <div className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 text-sm font-black uppercase tracking-widest">
                                                                <CheckCircle size={18} />
                                                                <span>Already Enrolled</span>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => handleEnroll(e, course.id, course.title)}
                                                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group/btn shadow-xl shadow-slate-900/10"
                                                            >
                                                                Enroll Now
                                                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Courses;
