import Swal from 'sweetalert2';

// Premium animated dark theme with INTENSE SHADOWS
const premiumTheme = {
    background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
    color: '#fff',
    backdrop: `
    rgba(0, 0, 0, 0.85)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='0.08'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    left center
  `,
    showClass: {
        popup: 'animate__animated animate__zoomInDown animate__fast',
        backdrop: 'animate__animated animate__fadeIn'
    },
    hideClass: {
        popup: 'animate__animated animate__zoomOutUp animate__fast',
        backdrop: 'animate__animated animate__fadeOut'
    },
    customClass: {
        // Popup: Strong purple glow + border
        popup: 'rounded-3xl border-2 border-purple-500/50 shadow-[0_0_50px_rgba(147,51,234,0.3)] backdrop-blur-2xl font-orbitron',

        // Title: Gradient text
        title: 'text-white font-bold text-3xl bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent font-orbitron tracking-wider drop-shadow-lg',

        // Content: Readable sans-serif
        htmlContainer: 'text-gray-200 text-lg font-sans tracking-wide',

        // Confirm Button: Intense Purple/Pink Glow
        confirmButton: 'rounded-xl px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] transform hover:scale-105 transition-all duration-300 font-orbitron border border-white/20',

        // Cancel Button: Subtle Glow
        cancelButton: 'rounded-xl px-8 py-4 font-bold text-white bg-gray-800 hover:bg-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-all duration-300 font-orbitron border border-white/10',

        // Icon: Animated
        icon: 'border-4 animate__animated animate__heartBeat shadow-[0_0_20px_rgba(255,255,255,0.1)]'
    }
};

export const showSuccess = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        ...premiumTheme,
        iconColor: '#10b981',
        customClass: {
            ...premiumTheme.customClass,
            popup: 'rounded-3xl border-2 border-green-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-2xl font-orbitron',
            icon: 'border-4 border-green-500/30 animate__animated animate__bounceIn shadow-[0_0_20px_rgba(16,185,129,0.4)]',
            confirmButton: 'rounded-xl px-8 py-4 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)] transform hover:scale-105 transition-all duration-300 font-orbitron border border-white/20'
        }
    });
};

export const showError = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        ...premiumTheme,
        iconColor: '#ef4444',
        confirmButtonColor: '#ef4444',
        customClass: {
            ...premiumTheme.customClass,
            popup: 'rounded-3xl border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)] backdrop-blur-2xl font-orbitron',
            icon: 'border-4 border-red-500/30 animate__animated animate__shakeX shadow-[0_0_20px_rgba(239,68,68,0.4)]',
            confirmButton: 'rounded-xl px-8 py-4 font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-[0_0_20px_rgba(239,68,68,0.6)] transform hover:scale-105 transition-all duration-300 font-orbitron border border-white/20'
        }
    });
};

export const showConfirm = async (title, text) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '✓ Yes, delete it!',
        cancelButtonText: '✕ Cancel',
        ...premiumTheme,
        iconColor: '#f59e0b',
        customClass: {
            ...premiumTheme.customClass,
            popup: 'rounded-3xl border-2 border-orange-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] backdrop-blur-2xl font-orbitron',
            icon: 'border-4 border-orange-500/30 animate__animated animate__tada shadow-[0_0_20px_rgba(245,158,11,0.4)]',
            confirmButton: 'rounded-xl px-8 py-4 font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-[0_0_20px_rgba(239,68,68,0.6)] transform hover:scale-105 transition-all duration-300 font-orbitron border border-white/20'
        }
    });
    return result.isConfirmed;
};

export const showLoading = (text) => {
    return Swal.fire({
        title: '⏳ Loading...',
        text,
        allowOutsideClick: false,
        ...premiumTheme,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

export const showInfo = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'info',
        ...premiumTheme,
        iconColor: '#3b82f6',
        customClass: {
            ...premiumTheme.customClass,
            popup: 'rounded-3xl border-2 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] backdrop-blur-2xl font-orbitron',
            icon: 'border-4 border-blue-500/30 animate__animated animate__pulse shadow-[0_0_20px_rgba(59,130,246,0.4)]',
            confirmButton: 'rounded-xl px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] transform hover:scale-105 transition-all duration-300 font-orbitron border border-white/20'
        }
    });
};

export default {
    showSuccess,
    showError,
    showConfirm,
    showLoading,
    showInfo
};
