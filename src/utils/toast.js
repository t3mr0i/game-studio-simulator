import { toast } from 'react-toastify';

export const customToast = {
    success: (message) => toast.success(message, { autoClose: 2000 }),
    error: (message) => toast.error(message, { autoClose: 2000 }),
    info: (message) => toast.info(message, { autoClose: 2000 }),
    warning: (message) => toast.warning(message, { autoClose: 2000 }),
};
