import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreeBackground from '../components/ThreeBackground';
import Footer from '../components/Footer';
import api from '../services/api';
import { gsap } from 'gsap';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { showSuccess, showError } from '../utils/sweetAlert';

const CourseDetails = () => {
    const { id } = useParams();
    const [courseProgress, setCourseProgress] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            const response = await api.get(`/courses/${id}`);
            const course = response.data;

            // Create mock progress data
            const mockProgress = {
                courseTitle: course.title,
                totalLessons: course.lessons?.length || 3,
                completedLessons: 0,
                progressPercentage: 0,
                lessons: course.lessons?.map((lesson, index) => ({
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                    completed: false
                })) || [
                        { lessonId: 1, lessonTitle: 'Introduction to the Course', completed: false },
                        { lessonId: 2, lessonTitle: 'Core Concepts', completed: false },
                        { lessonId: 3, lessonTitle: 'Advanced Topics', completed: false }
                    ]
            };

            const materialsResponse = await api.get(`/courses/${id}/materials`);
            setMaterials(materialsResponse.data);

            setCourseProgress(mockProgress);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch course details', error);
            showError('Error', 'Failed to load course details');
            setLoading(false);
        }
    };

    const handleLessonToggle = (lessonId, currentStatus) => {
        const newStatus = !currentStatus;

        // Update local state
        setCourseProgress(prev => {
            const updatedLessons = prev.lessons.map(lesson =>
                lesson.lessonId === lessonId
                    ? { ...lesson, completed: newStatus }
                    : lesson
            );

            const completedCount = updatedLessons.filter(l => l.completed).length;
            const progressPercentage = prev.totalLessons > 0
                ? Math.round((completedCount * 100.0) / prev.totalLessons)
                : 0;

            return {
                ...prev,
                lessons: updatedLessons,
                completedLessons: completedCount,
                progressPercentage: progressPercentage
            };
        });

        if (newStatus) {
            showSuccess('Progress Updated', 'Lesson marked as complete!');
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-100 transition-opacity duration-300">
                    <ThreeBackground />
                </div>
                <div className="relative z-10 text-blue-600 dark:text-neon-blue text-xl font-orbitron animate-pulse">
                    Loading Mission Data...
                </div>
            </div>
        );
    }

    if (!courseProgress) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <ThreeBackground />
                <div className="relative z-10 text-gray-900 dark:text-white text-xl">Course not found</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-black transition-colors duration-300">
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-100 pointer-events-none transition-opacity duration-300">
                <ThreeBackground />
            </div>
            <Navbar />

            <div className="relative z-10 pt-24 px-6 max-w-4xl mx-auto pb-12 flex-1">
                <div className="bg-white dark:bg-white/5 backdrop-blur-md p-8 animate-fade-in rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
                    <h1 className="text-4xl font-orbitron mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple">{courseProgress.courseTitle}</h1>

                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-blue-600 dark:text-neon-blue font-bold">Mission Progress</span>
                            <span className="text-blue-600 dark:text-neon-blue font-bold">
                                {courseProgress.completedLessons}/{courseProgress.totalLessons} Modules ({courseProgress.progressPercentage}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-neon-blue to-neon-purple h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${courseProgress.progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-orbitron mb-4 text-gray-900 dark:text-white">Mission Modules</h2>
                    <div className="space-y-4">
                        {courseProgress.lessons.map((lesson, index) => (
                            <div
                                key={lesson.lessonId}
                                className={`p-4 rounded border flex justify-between items-center transition-all cursor-pointer ${lesson.completed
                                    ? 'bg-green-100 dark:bg-green-500/10 border-green-500/30'
                                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10'
                                    }`}
                                onClick={() => handleLessonToggle(lesson.lessonId, lesson.completed)}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="bg-blue-100 dark:bg-neon-blue/20 text-blue-600 dark:text-neon-blue w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </span>
                                    <span className={lesson.completed ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-white font-medium'}>
                                        {lesson.lessonTitle}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {lesson.completed ? (
                                        <>
                                            <span className="text-green-400 text-sm font-medium">Completed</span>
                                            <CheckCircle className="text-green-400" size={24} />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Mark Complete</span>
                                            <Circle className="text-gray-400 dark:text-gray-500" size={24} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Course Materials Section */}
                    {materials.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-orbitron mb-4">Course Materials</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {materials.map((material) => (
                                    <a
                                        key={material.id}
                                        href={`/uploads/course-materials/${material.fileName}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white dark:bg-white/5 p-4 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center space-x-3 shadow-sm dark:shadow-none"
                                    >
                                        <div className="bg-purple-100 dark:bg-neon-purple/20 p-2 rounded-full">
                                            {material.fileType.includes('video') ? (
                                                <svg className="w-6 h-6 text-purple-600 dark:text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-purple-600 dark:text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-medium">{material.fileName}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">{(material.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {courseProgress.progressPercentage === 100 && (
                        <div className="mt-8 bg-white dark:bg-white/5 backdrop-blur-md p-6 border-2 border-purple-500 dark:border-neon-purple animate-pulse-slow rounded-xl shadow-lg dark:shadow-none">
                            <h3 className="text-2xl font-orbitron text-purple-600 dark:text-neon-purple mb-2">🎉 Mission Complete!</h3>
                            <p className="text-gray-600 dark:text-gray-300">Congratulations! You've completed all modules in this course.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default CourseDetails;
