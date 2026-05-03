import React from 'react';
import StudentLayout from './StudentLayout';
import PublicLayout from './PublicLayout';

const RoleBasedLayout = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // If logged in as a student, show the Sidebar layout
    if (token && role === 'STUDENT') {
        return <StudentLayout />;
    }

    // Otherwise, show the Public layout (Navbar + Footer)
    return <PublicLayout />;
};

export default RoleBasedLayout;
