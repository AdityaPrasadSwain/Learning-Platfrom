import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError, showLoading } from '../utils/sweetAlert';
import Swal from 'sweetalert2';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleLogin = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (token) {
                showLoading('Logging you in...');
                localStorage.setItem('token', token);

                // Decode token to get role/username if needed, or fetch profile
                // For now, we'll assume STUDENT role as default for OAuth users
                // In a real app, you might want to fetch user details here
                localStorage.setItem('role', 'STUDENT');

                Swal.close();
                await showSuccess('Welcome Back!', 'Successfully logged in with Google');
                navigate('/dashboard');
            } else {
                showError('Login Failed', error || 'Could not authenticate with Google');
                navigate('/login');
            }
        };

        handleLogin();
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Processing Login...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mx-auto"></div>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
