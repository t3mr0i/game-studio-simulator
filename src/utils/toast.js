import { toast } from 'react-toastify';

export const customToast = (type, message) => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // You can replace this with a more sophisticated toast notification later
};
