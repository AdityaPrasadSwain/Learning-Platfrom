import Swal from 'sweetalert2';

// Theme-aware configuration that uses CSS classes defined in index.css
const baseConfig = {
    showClass: {
        popup: 'animate__animated animate__zoomInDown animate__fast',
        backdrop: 'animate__animated animate__fadeIn'
    },
    hideClass: {
        popup: 'animate__animated animate__zoomOutUp animate__fast',
        backdrop: 'animate__animated animate__fadeOut'
    },
    customClass: {
        popup: 'swal-antigravity-popup',
        title: 'swal-antigravity-title',
        htmlContainer: 'swal-antigravity-html',
        confirmButton: 'swal-antigravity-confirm',
        cancelButton: 'swal-antigravity-cancel',
        icon: 'animate__animated animate__heartBeat'
    },
    buttonsStyling: false
};

export const showSuccess = (title, text) => {
    return Swal.fire({
        ...baseConfig,
        title,
        text,
        icon: 'success',
        customClass: {
            ...baseConfig.customClass,
            popup: `${baseConfig.customClass.popup} swal-success-popup`,
            confirmButton: `${baseConfig.customClass.confirmButton} swal-success-confirm`
        }
    });
};

export const showError = (title, text) => {
    return Swal.fire({
        ...baseConfig,
        title,
        text,
        icon: 'error',
        customClass: {
            ...baseConfig.customClass,
            popup: `${baseConfig.customClass.popup} swal-error-popup`,
            confirmButton: `${baseConfig.customClass.confirmButton} swal-error-confirm`
        }
    });
};

export const showConfirm = async (title, text) => {
    const result = await Swal.fire({
        ...baseConfig,
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '✓ Yes, proceed',
        cancelButtonText: '✕ Cancel',
        customClass: {
            ...baseConfig.customClass,
            popup: `${baseConfig.customClass.popup} swal-warning-popup`,
            confirmButton: `${baseConfig.customClass.confirmButton} swal-warning-confirm`
        }
    });
    return result.isConfirmed;
};

export const showInput = async (title, inputLabel, inputPlaceholder = '', inputType = 'text') => {
    const { value } = await Swal.fire({
        ...baseConfig,
        title,
        input: inputType,
        inputLabel,
        inputPlaceholder,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        customClass: {
            ...baseConfig.customClass,
            input: 'swal-antigravity-input'
        }
    });
    return value;
};

export const showLoading = (text) => {
    return Swal.fire({
        ...baseConfig,
        title: '⏳ Loading...',
        text,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

export const showInfo = (title, text) => {
    return Swal.fire({
        ...baseConfig,
        title,
        text,
        icon: 'info',
        customClass: {
            ...baseConfig.customClass,
            popup: `${baseConfig.customClass.popup} swal-info-popup`,
            confirmButton: `${baseConfig.customClass.confirmButton} swal-info-confirm`
        }
    });
};

export default {
    showSuccess,
    showError,
    showConfirm,
    showInput,
    showLoading,
    showInfo
};
