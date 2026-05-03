import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronDown, 
    Video, 
    Clock, 
    Users, 
    MoreVertical, 
    CheckCircle, 
    AlertCircle, 
    Plus,
    X,
    Calendar,
    Layout,
    PlayCircle,
    ChevronUp,
    BarChart2,
    VideoOff,
    StopCircle,
    Link,
    BookOpen,
    XCircle
} from 'lucide-react';
import JitsiMeet from '../../components/JitsiMeet';
import * as classService from '../../services/classService';
import api from '../../services/api';
import { showSuccess, showError, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const STATUS_COLORS = {
    LIVE: 'text-green-400 bg-green-400/10 border-green-400',
    COMPLETED: 'text-gray-400 bg-gray-400/10 border-gray-400',
    SCHEDULED: 'text-yellow-400 bg-yellow-400/10 border-yellow-400',
    CANCELLED: 'text-red-400 bg-red-400/10 border-red-400',
};

const TeacherLiveClass = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [liveSession, setLiveSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inClass, setInClass] = useState(false);
    const [expandedSession, setExpandedSession] = useState(null);
    const [sessionAttendance, setSessionAttendance] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedSessionAttendance, setSelectedSessionAttendance] = useState([]);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const displayName = localStorage.getItem('username') || 'Teacher';

    useEffect(() => {
        fetchMyCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) fetchSessions(selectedCourseId);
    }, [selectedCourseId]);

    const fetchMyCourses = async () => {
        try {
            const res = await api.get('/courses/teacher/my-courses');
            setMyCourses(res.data);
            if (res.data.length > 0) setSelectedCourseId(res.data[0].id);
        } catch (e) {
            showError('Error', 'Failed to load your courses.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async (courseId) => {
        try {
            const data = await classService.getSessionsByCourse(courseId);
            setSessions(data);
            const live = data.find(s => s.status === 'LIVE');
            setLiveSession(live || null);
        } catch (e) { /* ignore */ }
    };

    const handleStartClass = async () => {
        if (!selectedCourseId) return;
        showLoading('Starting class...');
        try {
            const session = await classService.startClassSession(selectedCourseId);
            Swal.close();
            setLiveSession(session);
            setInClass(true);
            fetchSessions(selectedCourseId);
            showSuccess('Class Started!', 'Students can now join the meeting.');
        } catch (e) {
            Swal.close();
            const errorMsg = e.response?.data?.message || e.response?.data || e.message || 'Failed to start class.';
            showError('Error', typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
        }
    };

    const handleEndClass = async () => {
        if (!liveSession) return;
        showLoading('Ending class...');
        try {
            await classService.endClassSession(liveSession.id);
            Swal.close();
            setLiveSession(null);
            setInClass(false);
            fetchSessions(selectedCourseId);
            showSuccess('Session Ended', 'The class recording will be available soon.');
        } catch (e) {
            Swal.close();
            const errorMsg = e.response?.data?.message || e.response?.data || e.message || 'Failed to end class.';
            showError('Error', typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
        }
    };

    const handleAddRecording = async (sessionId) => {
        const { value: url } = await Swal.fire({
            title: 'Add Recording URL',
            input: 'url',
            inputLabel: 'Recording Link (e.g. YouTube, Drive)',
            inputPlaceholder: 'https://...',
            background: '#0f172a',
            color: '#fff',
            showCancelButton: true
        });

        if (url) {
            try {
                await classService.addRecording(sessionId, url);
                showSuccess('Success', 'Recording added successfully!');
                fetchSessions(selectedCourseId);
            } catch (e) {
                showError('Error', 'Failed to add recording.');
            }
        }
    };

    const handleViewAttendance = async (sessionId) => {
        if (expandedSession === sessionId) {
            setExpandedSession(null);
            return;
        }
        try {
            const data = await classService.getSessionAttendance(sessionId);
            setSessionAttendance(prev => ({ ...prev, [sessionId]: data }));
            setExpandedSession(sessionId);
        } catch (e) {
            showError('Error', 'Failed to load attendance.');
        }
    };

    const viewAttendance = async (sessionId) => {
        setAttendanceLoading(true);
        setShowAttendanceModal(true);
        try {
            const res = await api.get(`/attendance/session/${sessionId}`);
            setSelectedSessionAttendance(res.data);
        } catch (e) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to load attendance records.',
                icon: 'error',
                background: '#0f172a',
                color: '#fff'
            });
        } finally {
            setAttendanceLoading(false);
        }
    };

    const getRoomName = (link) => link?.split('meet.jit.si/')[1] || '';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse">Loading your classes...</div>
            </div>
        );
    }

    return (
        <div className="text-white space-y-6 px-2">
            <AnimatePresence>
                {showAttendanceModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAttendanceModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass-panel p-6 overflow-hidden"
                            style={{ background: 'rgba(15, 23, 42, 0.95)' }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                                        <Users className="text-cyan-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Session Attendance</h2>
                                        <p className="text-sm text-gray-400">List of participants and their join times.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowAttendanceModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="text-gray-400" size={20} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Join Time</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Leave Time</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {attendanceLoading ? (
                                            <tr><td colSpan="4" className="py-8 text-center text-gray-500">Loading records...</td></tr>
                                        ) : selectedSessionAttendance.length === 0 ? (
                                            <tr><td colSpan="4" className="py-8 text-center text-gray-500">No participants recorded.</td></tr>
                                        ) : selectedSessionAttendance.map((record) => (
                                            <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 font-medium text-sm text-white">{record.studentName}</td>
                                                <td className="py-4 text-sm text-gray-300">{record.joinTime ? new Date(record.joinTime).toLocaleTimeString() : '-'}</td>
                                                <td className="py-4 text-sm text-gray-300">{record.leaveTime ? new Date(record.leaveTime).toLocaleTimeString() : 'Still in class'}</td>
                                                <td className="py-4 text-sm text-gray-300">{record.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron text-white">Live Classes</h1>
                    <p className="text-gray-400 mt-1">Start, manage, and record your live class sessions.</p>
                </div>
                <div className="relative z-50">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-72 flex items-center justify-between px-5 py-3.5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white group hover:border-cyan-500/50 transition-all duration-300 shadow-xl"
                    >
                        <div className="flex flex-col items-start truncate pr-4">
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1 opacity-70">Active Course</span>
                            <span className="text-sm font-semibold truncate">
                                {selectedCourseId ? myCourses.find(c => c.id === selectedCourseId)?.title : 'Select a course...'}
                            </span>
                        </div>
                        <ChevronDown className={`text-gray-500 group-hover:text-cyan-400 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0" onClick={() => setIsDropdownOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-80 glass-panel overflow-hidden z-[60] shadow-2xl border-white/20"
                                    style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(30px)' }}
                                >
                                    <div className="p-3 border-b border-white/5 bg-white/5">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Available Courses</p>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                                        {myCourses.length > 0 ? (
                                            myCourses.map(course => (
                                                <button
                                                    key={course.id}
                                                    onClick={() => {
                                                        setSelectedCourseId(course.id);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full flex flex-col items-start p-3 rounded-xl transition-all duration-200 group/item mb-1 ${
                                                        selectedCourseId === course.id 
                                                        ? 'bg-cyan-500/20 border border-cyan-500/30' 
                                                        : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                                                    }`}
                                                >
                                                    <span className={`text-sm font-bold transition-colors ${
                                                        selectedCourseId === course.id ? 'text-cyan-400' : 'text-gray-200 group-hover/item:text-white'
                                                    }`}>
                                                        {course.title}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 mt-0.5 truncate w-full text-left">
                                                        {course.category} • {course.duration} mins
                                                    </span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <p className="text-sm text-gray-500 italic">No courses assigned yet</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {!inClass ? (
                    <motion.div
                        key="start-panel"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-2xl p-4">
                                <Video size={36} className="text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">No Active Session</h2>
                                <p className="text-gray-400 text-sm mt-1">Click "Start Class" to begin a live Jitsi session for your students.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleStartClass}
                            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                        >
                            <PlayCircle size={20} />
                            Start Class
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="live-panel"
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        {/* Live Badge + End Class */}
                        <div className="glass-panel p-4 flex items-center justify-between border-green-500/30">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 text-green-400 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    LIVE NOW
                                </span>
                                <span className="text-gray-400 text-sm truncate max-w-xs">{liveSession?.meetingLink}</span>
                            </div>
                            <button
                                onClick={handleEndClass}
                                className="flex items-center gap-2 bg-red-500/20 border border-red-500 text-red-400 font-bold px-6 py-2 rounded-xl hover:bg-red-500/40 transition-all"
                            >
                                <StopCircle size={18} />
                                End Class
                            </button>
                        </div>

                        {/* Jitsi Embed */}
                        {liveSession ? (
                            <JitsiMeet
                                roomName={getRoomName(liveSession.meetingLink)}
                                displayName={displayName}
                                onClose={handleEndClass}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-gray-400">Initializing meeting session...</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session History */}
            <div className="glass-panel overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center gap-3">
                    <Calendar size={20} className="text-cyan-400" />
                    <h2 className="font-bold text-lg">Session History</h2>
                </div>
                {sessions.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No sessions yet for this course.</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {sessions.map(session => (
                            <div key={session.id}>
                                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${STATUS_COLORS[session.status] || 'text-gray-400'}`}>
                                            {session.status}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {new Date(session.startTime).toLocaleString()}
                                            </p>
                                            {session.endTime && (
                                                <p className="text-xs text-gray-400">
                                                    Ended: {new Date(session.endTime).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {session.recordingUrl ? (
                                            <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-400/30 hover:bg-cyan-400/10 transition-all">
                                                <PlayCircle size={14} /> Recording
                                            </a>
                                        ) : session.status === 'COMPLETED' && (
                                            <button onClick={() => handleAddRecording(session.id)}
                                                className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                                                <Plus size={14} /> Add Recording
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleViewAttendance(session.id)}
                                            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg border border-purple-400/30 hover:bg-purple-400/10 transition-all"
                                        >
                                            <BarChart2 size={14} />
                                            Attendance
                                            {expandedSession === session.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </button>
                                    </div>
                                </div>
                                {/* Attendance Expansion */}
                                <AnimatePresence>
                                    {expandedSession === session.id && sessionAttendance[session.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden bg-white/3 border-t border-white/5"
                                        >
                                            <div className="p-4">
                                                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Attendance Records</p>
                                                {sessionAttendance[session.id].length === 0 ? (
                                                    <p className="text-gray-500 text-sm">No attendance records yet.</p>
                                                ) : (
                                                    <div className="grid gap-2">
                                                        {sessionAttendance[session.id].map((rec, i) => (
                                                            <div key={i} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                                                                <span className="font-medium text-white">{rec.studentName}</span>
                                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                                    {rec.joinTime && <span>Join: {new Date(rec.joinTime).toLocaleTimeString()}</span>}
                                                                    {rec.leaveTime && <span>Leave: {new Date(rec.leaveTime).toLocaleTimeString()}</span>}
                                                                    <span className={`font-bold px-2 py-0.5 rounded-full ${rec.status === 'PRESENT' ? 'bg-green-400/10 text-green-400' : rec.status === 'LATE' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400'}`}>
                                                                        {rec.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherLiveClass;
