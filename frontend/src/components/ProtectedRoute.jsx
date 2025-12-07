import React from 'react';
import { Navigate } from 'react-router-dom';
import { showError } from '../utils/sweetAlert';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    const isApproved = localStorage.getItem('isApproved');

    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Teacher Approval Check
    // We check if it is NOT 'true' (handling 'false', null, undefined, boolean false)
    const isApprovedBool = String(isApproved) === 'true';

    if (userRole === 'TEACHER' && !isApprovedBool && window.location.pathname !== '/teacher/apply') {
        return <Navigate to="/teacher/apply" replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Show error message for unauthorized access
        setTimeout(() => {
            showError(
                'Access Denied',
                `You don't have permission to access this page. Required role: ${allowedRoles.join(' or ')}`
            );
        }, 100);

        // Redirect based on user role
        const roleRedirects = {
            'ADMIN': '/admin/dashboard',
            'TEACHER': '/teacher/dashboard',
            'STUDENT': '/dashboard'
        };

        return <Navigate to={roleRedirects[userRole] || '/dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;