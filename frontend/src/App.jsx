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

// Admin Imports
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import AuditLogs from './pages/admin/AuditLogs';
import QuizManagement from './pages/admin/QuizManagement';
import AdminQuizDetail from './pages/admin/QuizDetail';
import TeacherApplications from './pages/admin/TeacherApplications';

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

// Student Imports
import StudentDashboard from './pages/StudentDashboard';
import MyLearning from './pages/student/MyLearning';
import StudentVideos from './pages/student/Videos';
import StudentQuizList from './pages/student/QuizList';
import QuizStart from './pages/student/QuizStart';
import QuizAttempt from './pages/student/QuizAttempt';
import QuizResult from './pages/student/QuizResult';
import Payment from './pages/Payment';

// Profile
import Profile from './pages/Profile';

// Suspended
import Suspended from './pages/Suspended';

function App() {
    return (
        <ThemeProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/course/:id" element={<CourseDetails />} />

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><Outlet /></ProtectedRoute>}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/courses" element={<CourseManagement />} />
                        <Route path="/admin/audit-logs" element={<AuditLogs />} />
                        <Route path="/admin/quizzes" element={<QuizManagement />} />
                        <Route path="/admin/quizzes/:quizId" element={<AdminQuizDetail />} />
                        <Route path="/admin/applications" element={<TeacherApplications />} />
                    </Route>

                    {/* Teacher Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['TEACHER']}><Outlet /></ProtectedRoute>}>
                        <Route path="/teacher/apply" element={<StartTeaching />} />
                        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                        <Route path="/teacher/course/:id/edit" element={<CourseEditor />} />
                        <Route path="/teacher/upload" element={<UploadVideo />} />
                        <Route path="/teacher/videos" element={<MyVideos />} />
                        <Route path="/teacher/my-courses" element={<TeacherCourses />} />
                        <Route path="/teacher/create-course" element={<CreateCourse />} />
                        <Route path="/teacher/quizzes" element={<TeacherQuizList />} />
                        <Route path="/teacher/quiz/create" element={<CreateQuiz />} />
                        <Route path="/teacher/quiz/:quizId" element={<QuizDetail />} />
                        <Route path="/teacher/quiz/:quizId/edit" element={<EditQuiz />} />
                        <Route path="/teacher/profile" element={<TeacherProfile />} />
                    </Route>

                    {/* Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['STUDENT']}><Outlet /></ProtectedRoute>}>
                        <Route path="/student/dashboard" element={<StudentDashboard />} />
                        <Route path="/my-learning" element={<MyLearning />} />
                        <Route path="/videos" element={<StudentVideos />} />
                        <Route path="/student/quizzes" element={<StudentQuizList />} />
                        <Route path="/student/quiz/:quizId/start" element={<QuizStart />} />
                        <Route path="/student/quiz/:quizId/attempt" element={<QuizAttempt />} />
                        <Route path="/student/quiz/:quizId/result" element={<QuizResult />} />
                        <Route path="/payment/:courseId" element={<Payment />} />
                    </Route>

                    {/* Profile Route (All Users) */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}><Outlet /></ProtectedRoute>}>
                        <Route path="/profile" element={<Profile />} />
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
