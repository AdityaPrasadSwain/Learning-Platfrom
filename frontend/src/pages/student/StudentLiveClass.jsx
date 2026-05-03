import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, PlayCircle, LogIn, LogOut, BarChart2,
    CalendarCheck, BookOpen, Clock, CheckCircle, XCircle, AlertCircle, Play
} from 'lucide-react';
import JitsiMeet from '../../components/JitsiMeet';
import * as classService from '../../services/classService';
import api from '../../services/api';
import { showError, showSuccess } from '../../utils/sweetAlert';

const STATUS_ICON = {
    PRESENT: <CheckCircle size={14} className="text-green-400" />,
    LATE: <AlertCircle size={14} className="text-yellow-400" />,
    ABSENT: <XCircle size={14} className="text-red-400" />,
};

const StudentLiveClass = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [liveSessions, setLiveSessions] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [attendanceHistory, setAttendanceHistory] = useState(null);
    const [activeSession, setActiveSession] = useState(null); // session student is currently in
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('live'); // live | recordings | attendance
    const username = localStorage.getItem('username') || 'Student';
    const studentId = localStorage.getItem('userId');

    useEffect(() => {
        fetchEnrolledCourses();
        fetchAttendance();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchLiveSessions(selectedCourse.id);
            fetchRecordings(selectedCourse.id);
        }
    }, [selectedCourse]);

    const fetchEnrolledCourses = async () => {
        try {
            const res = await api.get('/enrollments/my');
            const courses = res.data.map(e => e.course || e);
            setEnrolledCourses(courses);
            if (courses.length > 0) setSelectedCourse(courses[0]);
        } catch (e) {
            // fallback
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveSessions = async (courseId) => {
        try {
            const data = await classService.getSessionsByCourse(courseId);
            setLiveSessions(data.filter(s => s.status === 'LIVE'));
        } catch (e) { }
    };

    const fetchRecordings = async (courseId) => {
        try {
            const data = await classService.getRecordingsByCourse(courseId);
            setRecordings(data);
        } catch (e) { }
    };

    const fetchAttendance = async () => {
        try {
            const res = await api.get(`/attendance/student/${username}`);
            setAttendanceHistory(res.data);
        } catch (e) { }
    };

    const handleJoin = async (session) => {
        try {
            await classService.trackJoin(session.id);
            setActiveSession(session);
        } catch (e) {
            // If already joined or session not live, just enter
            setActiveSession(session);
        }
    };

    const handleLeave = async () => {
        if (!activeSession) return;
        try {
            await classService.trackLeave(activeSession.id);
            showSuccess('Attendance Recorded', 'Your attendance has been saved!');
        } catch (e) {
            // ignore if error
        } finally {
            setActiveSession(null);
        }
    };

    const getRoomName = (link) => link?.split('meet.jit.si/')[1] || '';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="text-white space-y-6 px-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron">Live Classes</h1>
                    <p className="text-gray-400 mt-1">Join live sessions, watch recordings, and track your attendance.</p>
                </div>
                {/* Course Selector */}
                {enrolledCourses.length > 1 && (
                    <select
                        value={selectedCourse?.id || ''}
                        onChange={e => setSelectedCourse(enrolledCourses.find(c => c.id === Number(e.target.value)))}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm"
                    >
                        {enrolledCourses.map(c => <option key={c.id} value={c.id} className="bg-gray-900">{c.title}</option>)}
                    </select>
                )}
            </div>

            {/* In-Class Jitsi View */}
            <AnimatePresence>
                {activeSession && (
                    <motion.div
                        key="jitsi"
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        <div className="glass-panel p-4 flex items-center justify-between border-green-500/20">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-green-400 font-bold text-sm">Live: {selectedCourse?.title}</span>
                            </div>
                            <button
                                onClick={handleLeave}
                                className="flex items-center gap-2 text-red-400 border border-red-400/30 px-4 py-1.5 rounded-xl text-sm hover:bg-red-400/10 transition-all"
                            >
                                <LogOut size={15} /> Leave Class
                            </button>
                        </div>
                        <JitsiMeet
                            roomName={getRoomName(activeSession.meetingLink)}
                            displayName={username}
                            onClose={handleLeave}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-0">
                {[
                    { key: 'live', label: 'Live Now', icon: <Video size={15} /> },
                    { key: 'recordings', label: 'Recordings', icon: <PlayCircle size={15} /> },
                    { key: 'attendance', label: 'My Attendance', icon: <BarChart2 size={15} /> },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${tab === t.key ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        {t.icon}{t.label}
                    </button>
                ))}
            </div>

            {/* Tab: Live Now */}
            {tab === 'live' && (
                <div className="space-y-3">
                    {liveSessions.length === 0 ? (
                        <div className="glass-panel p-10 text-center text-gray-400">
                            <Video size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No live class is happening right now.</p>
                        </div>
                    ) : (
                        liveSessions.map(session => (
                            <motion.div key={session.id}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                className="glass-panel p-5 flex items-center justify-between border-green-500/20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-400/10 rounded-xl p-3 border border-green-400/20">
                                        <Video size={24} className="text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{selectedCourse?.title}</p>
                                        <p className="text-xs text-gray-400">
                                            Started: {new Date(session.startTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleJoin(session)}
                                    disabled={activeSession?.id === session.id}
                                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                                >
                                    <LogIn size={16} />
                                    {activeSession?.id === session.id ? 'In Class' : 'Join Class'}
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Tab: Recordings */}
            {tab === 'recordings' && (
                <div className="space-y-3">
                    {recordings.length === 0 ? (
                        <div className="glass-panel p-10 text-center text-gray-400">
                            <PlayCircle size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No recordings available yet.</p>
                        </div>
                    ) : (
                        recordings.map(session => (
                            <motion.div key={session.id}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="glass-panel p-5 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-cyan-400/10 rounded-xl p-3 border border-cyan-400/20">
                                        <PlayCircle size={24} className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{selectedCourse?.title}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={session.recordingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-semibold px-5 py-2 rounded-xl hover:bg-cyan-500/20 transition-all"
                                >
                                    <PlayCircle size={16} /> Watch
                                </a>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Tab: Attendance */}
            {tab === 'attendance' && (
                <div className="space-y-4">
                    {attendanceHistory && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="glass-panel p-5 text-center">
                                    <p className="text-gray-400 text-sm">Total Sessions</p>
                                    <p className="text-3xl font-bold text-white mt-1">{attendanceHistory.totalSessions}</p>
                                </div>
                                <div className="glass-panel p-5 text-center">
                                    <p className="text-gray-400 text-sm">Attended</p>
                                    <p className="text-3xl font-bold text-green-400 mt-1">{attendanceHistory.presentCount}</p>
                                </div>
                                <div className="glass-panel p-5 text-center">
                                    <p className="text-gray-400 text-sm">Percentage</p>
                                    <p className={`text-3xl font-bold mt-1 ${attendanceHistory.percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                                        {attendanceHistory.percentage.toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            {/* History List */}
                            <div className="glass-panel overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-bold">Session History</h3>
                                </div>
                                {attendanceHistory.history?.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">No attendance records yet.</div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {attendanceHistory.history?.map((rec, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                                <div>
                                                    <p className="text-sm font-medium">{rec.courseName}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(rec.sessionStartTime).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    {rec.joinTime && <span className="text-gray-400">Joined {new Date(rec.joinTime).toLocaleTimeString()}</span>}
                                                    <span className={`flex items-center gap-1 font-bold px-2 py-1 rounded-full ${rec.status === 'PRESENT' ? 'bg-green-400/10 text-green-400' : rec.status === 'LATE' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400'}`}>
                                                        {STATUS_ICON[rec.status]} {rec.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentLiveClass;
