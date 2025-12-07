import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Users, Star, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
        <div className={`p-4 rounded-full ${color} bg-opacity-10 mr-4`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch all courses (could be filtered by teacher on backend later)
        axios.get('/api/courses')
            .then(response => setCourses(response.data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="My Courses"
                    value={courses.length.toString()}
                    icon={BookOpen}
                    color="text-indigo-600 bg-indigo-600"
                />
                <StatCard
                    title="Total Students"
                    value="120"
                    icon={Users}
                    color="text-emerald-600 bg-emerald-600"
                />
                <StatCard
                    title="Average Rating"
                    value="4.8"
                    icon={Star}
                    color="text-yellow-500 bg-yellow-500"
                />
                <StatCard
                    title="Hours Taught"
                    value="45"
                    icon={Clock}
                    color="text-blue-600 bg-blue-600"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">My Courses</h2>
                {courses.length === 0 ? (
                    <p className="text-gray-500">No courses created yet.</p>
                ) : (
                    <ul className="list-disc pl-5 space-y-2">
                        {courses.map(course => (
                            <li key={course.id} className="text-gray-800">
                                {course.title} - {course.category}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
