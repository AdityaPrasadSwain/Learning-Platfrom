import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreeBackground from '../../components/ThreeBackground';
import { ArrowLeft, Play, Save, CheckCircle, XCircle } from 'lucide-react';
import { startOrGetSession, markAttendance } from '../../api/attendanceApi';
import { showError, showSuccess, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const TeacherCourseAttendance = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleStartSession = async () => {
        try {
            setLoading(true);
            const data = await startOrGetSession(courseId);
            setSession(data);
            setStudents(data.students);
        } catch (error) {
            console.error('Error starting session:', error);
            showError('Session Error', error.response?.data || 'Failed to start session. Make sure it is class time.');
        } finally {
            setLoading(false);
        }
    };

    const toggleAttendance = (studentId) => {
        setStudents(students.map(s => 
            s.studentId === studentId ? { ...s, isPresent: !s.isPresent } : s
        ));
    };

    const handleSave = async () => {
        try {
            showLoading('Saving attendance...');
            const payload = students.map(s => ({
                studentId: s.studentId,
                isPresent: s.isPresent
            }));
            await markAttendance(session.id, payload);
            Swal.close();
            showSuccess('Success', 'Attendance saved successfully!');
        } catch (error) {
            console.error('Error saving attendance:', error);
            Swal.close();
            showError('Save Error', error.response?.data || 'Failed to save attendance.');
        }
    };

    return (
        <div className="relative min-h-screen">
            <ThreeBackground />
            <div className="relative z-10 pt-24 px-6 max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <h1 className="text-2xl font-bold font-orbitron text-white neon-text">Class Attendance</h1>
                </div>

                {!session ? (
                    <div className="glass-panel p-8 text-center space-y-6">
                        <h2 className="text-xl text-white">Start Today's Attendance Session</h2>
                        <p className="text-gray-400">Attendance can only be taken during scheduled class time.</p>
                        <button
                            onClick={handleStartSession}
                            disabled={loading}
                            className="btn-primary flex items-center justify-center gap-2 mx-auto"
                        >
                            <Play size={20} />
                            {loading ? 'Starting...' : 'Start Session'}
                        </button>
                    </div>
                ) : (
                    <div className="glass-panel p-6 space-y-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-lg text-white font-medium">Session Active</h3>
                                <p className="text-sm text-gray-400">
                                    {session.sessionDate} | {session.startTime} - {session.endTime}
                                </p>
                            </div>
                            <button
                                onClick={handleSave}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Save size={20} />
                                Save Attendance
                            </button>
                        </div>

                        <div className="overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase">Student</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase">Status</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {students.map(student => (
                                        <tr key={student.studentId} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-white">{student.username}</div>
                                                <div className="text-xs text-gray-400">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    student.isPresent 
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500' 
                                                        : 'bg-red-500/20 text-red-400 border border-red-500'
                                                }`}>
                                                    {student.isPresent ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => toggleAttendance(student.studentId)}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        student.isPresent 
                                                            ? 'text-red-400 hover:bg-red-400/10' 
                                                            : 'text-green-400 hover:bg-green-400/10'
                                                    }`}
                                                    title={student.isPresent ? 'Mark Absent' : 'Mark Present'}
                                                >
                                                    {student.isPresent ? <XCircle size={24} /> : <CheckCircle size={24} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                                                No students enrolled in this course yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherCourseAttendance;
