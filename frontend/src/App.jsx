import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import ForgotPassword from './pages/ForgotPassword';
import Features from './pages/Features';
import Team from './pages/Team';
import FAQ from './pages/FAQ';

// Admin Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import AuditLogs from './pages/admin/AuditLogs';
import QuizManagement from './pages/admin/QuizManagement';
import AdminQuizDetail from './pages/admin/QuizDetail';
import TeacherApplications from './pages/admin/TeacherApplications';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';

// Teacher Imports
import TeacherDashboard from './pages/TeacherDashboard';
import CourseEditor from './pages/teacher/CourseEditor';
import UploadVideo from './pages/UploadVideo';
import MyVideos from './pages/MyVideos';
import VideoPlayerPage from './pages/VideoPlayerPage';
import TeacherCourses from './pages/teacher/MyCourses';
import CreateCourse from './pages/teacher/CreateCourse';
import TeacherQuizList from './pages/teacher/QuizList';
import CreateQuiz from './pages/teacher/CreateQuiz';
import QuizDetail from './pages/teacher/QuizDetail';
import EditQuiz from './pages/teacher/EditQuiz';
import TeacherProfile from './pages/teacher/TeacherProfile';
import StartTeaching from './pages/teacher/StartTeaching';
import TeacherCourseAttendance from './pages/teacher/TeacherCourseAttendance';
import TeacherLiveClass from './pages/teacher/TeacherLiveClass';
import AssignmentList from './pages/teacher/AssignmentList';
import CreateAssignment from './pages/teacher/CreateAssignment';
import GradingPage from './pages/teacher/GradingPage';

// Student Imports
import StudentDashboard from './pages/StudentDashboard';
import MyLearning from './pages/student/MyLearning';
import StudentVideos from './pages/student/Videos';
import StudentQuizList from './pages/student/QuizList';
import QuizStart from './pages/student/QuizStart';
import QuizAttempt from './pages/student/QuizAttempt';
import QuizResult from './pages/student/QuizResult';
import Payment from './pages/Payment';
import StudentLiveClass from './pages/student/StudentLiveClass';
import StudentAssignments from './pages/student/StudentAssignments';
import SubmitAssignment from './pages/student/SubmitAssignment';

// Profile
import Profile from './pages/Profile';

// Settings
import SettingsLayout from './pages/settings/SettingsLayout';

// Suspended
import Suspended from './pages/Suspended';

import RoleBasedLayout from './layouts/RoleBasedLayout';
import PublicLayout from './layouts/PublicLayout';

function App() {
    return (
        <ThemeProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    {/* Public Guest Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                    </Route>

                    {/* Auth Routes (Standalone) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Shared Public Routes (Auth-Aware Layout) */}
                    <Route element={<RoleBasedLayout />}>
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/course/:id" element={<CourseDetails />} />
                    </Route>

                    {/* Protected Shared Routes (All Roles) */}
                    <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}><RoleBasedLayout /></ProtectedRoute>}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/courses" element={<CourseManagement />} />
                        <Route path="/admin/audit-logs" element={<AuditLogs />} />
                        <Route path="/admin/quizzes" element={<QuizManagement />} />
                        <Route path="/admin/quizzes/:quizId" element={<AdminQuizDetail />} />
                        <Route path="/admin/applications" element={<TeacherApplications />} />
                        <Route path="/admin/settings" element={<SettingsLayout />} />
                    </Route>

                    {/* Teacher Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherLayout /></ProtectedRoute>}>
                        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                        <Route path="/teacher/my-courses" element={<TeacherCourses />} />
                        <Route path="/teacher/create-course" element={<CreateCourse />} />
                        <Route path="/teacher/upload" element={<UploadVideo />} />
                        <Route path="/teacher/course/edit/:courseId" element={<CourseEditor />} />
                        <Route path="/teacher/apply" element={<StartTeaching />} />
                        <Route path="/teacher/quizzes" element={<TeacherQuizList />} />
                        <Route path="/teacher/quiz/create" element={<CreateQuiz />} />
                        <Route path="/teacher/quiz/:quizId" element={<QuizDetail />} />
                        <Route path="/teacher/quiz/:quizId/edit" element={<EditQuiz />} />
                        <Route path="/teacher/profile" element={<TeacherProfile />} />
                        <Route path="/teacher/course/:courseId/attendance" element={<TeacherCourseAttendance />} />
                        <Route path="/teacher/live-class" element={<TeacherLiveClass />} />
                        <Route path="/teacher/assignments" element={<AssignmentList />} />
                        <Route path="/teacher/assignment/create" element={<CreateAssignment />} />
                        <Route path="/teacher/assignment/:assignmentId/submissions" element={<GradingPage />} />
                        <Route path="/teacher/settings" element={<SettingsLayout />} />
                    </Route>

                    {/* Student Exclusive Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentLayout /></ProtectedRoute>}>
                        <Route path="/student/dashboard" element={<StudentDashboard />} />
                        <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
                        <Route path="/my-learning" element={<MyLearning />} />
                        <Route path="/videos" element={<StudentVideos />} />
                        <Route path="/student/quizzes" element={<StudentQuizList />} />
                        <Route path="/student/quiz/:quizId/start" element={<QuizStart />} />
                        <Route path="/student/quiz/:quizId/attempt" element={<QuizAttempt />} />
                        <Route path="/student/quiz/:quizId/result" element={<QuizResult />} />
                        <Route path="/payment/:courseId" element={<Payment />} />
                        <Route path="/student/live-class" element={<StudentLiveClass />} />
                        <Route path="/student/assignments" element={<StudentAssignments />} />
                        <Route path="/student/assignment/:assignmentId" element={<SubmitAssignment />} />
                        <Route path="/student/settings" element={<SettingsLayout />} />
                        <Route path="/watch/:id" element={<VideoPlayerPage />} />
                    </Route>

                    {/* Suspended Account Page */}
                    <Route path="/suspended" element={<Suspended />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
