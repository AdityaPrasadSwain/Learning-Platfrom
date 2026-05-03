import React, { useState, useEffect } from 'react';
import { getStudentAttendance } from '../../api/attendanceApi';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const StudentAttendanceView = ({ courseId, studentId }) => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getStudentAttendance(courseId, studentId);
                setAttendanceData(data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId && studentId) {
            fetchAttendance();
        }
    }, [courseId, studentId]);

    if (loading) {
        return <div className="text-gray-400 animate-pulse">Loading attendance...</div>;
    }

    if (!attendanceData) {
        return null;
    }

    return (
        <div className="glass-panel p-6 space-y-6">
            <h2 className="text-xl font-orbitron text-white neon-text flex items-center gap-2">
                <Calendar className="text-neon-blue" />
                Attendance Record
            </h2>

            <div className="grid grid-cols-3 gap-4 text-center border-b border-white/10 pb-6">
                <div>
                    <div className="text-3xl font-bold text-white">{attendanceData.totalSessions}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Total Classes</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-green-400">{attendanceData.presentCount}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Attended</div>
                </div>
                <div>
                    <div className={`text-3xl font-bold ${
                        attendanceData.percentage >= 75 ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {attendanceData.percentage.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Percentage</div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">History</h3>
                {attendanceData.history.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No attendance records yet.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {attendanceData.history.map((record, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-sm text-white">
                                        {new Date(record.markedAt).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(record.markedAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div>
                                    {record.isPresent ? (
                                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                                            <CheckCircle size={14} /> Present
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-full border border-red-400/20">
                                            <XCircle size={14} /> Absent
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAttendanceView;
