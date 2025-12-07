import React from 'react';
import AdminNavbar from './AdminNavbar';
import TeacherNavbar from './TeacherNavbar';
import TeacherRegistrationNavbar from './TeacherRegistrationNavbar';
import StudentNavbar from './StudentNavbar';
import GuestNavbar from './GuestNavbar';

const Navbar = () => {
    const role = localStorage.getItem('role');
    const isApproved = localStorage.getItem('isApproved');

    // Return appropriate navbar based on user role
    switch (role) {
        case 'ADMIN':
            return <AdminNavbar />;
        case 'TEACHER':
            // Provide restricted navbar for unapproved teachers
            if (isApproved !== 'true') {
                return <TeacherRegistrationNavbar />;
            }
            return <TeacherNavbar />;
        case 'STUDENT':
            return <StudentNavbar />;
        default:
            return <GuestNavbar />;
    }
};

export default Navbar;
