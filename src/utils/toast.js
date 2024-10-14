import { toast } from 'react-toastify';

export const customToast = {
    success: (message) => toast.success(message, {
        style: {
            background: '#131417', // kb-black
            color: '#DEE4EC', // kb-white
            borderLeft: '4px solid #FF4600', // kb-live-red
        },
    }),
    error: (message) => toast.error(message, {
        style: {
            background: '#131417', // kb-black
            color: '#DEE4EC', // kb-white
            borderLeft: '4px solid #FF0000', // kb-red
        },
    }),
    info: (message) => toast.info(message, {
        style: {
            background: '#131417', // kb-black
            color: '#DEE4EC', // kb-white
            borderLeft: '4px solid #7E8187', // kb-grey
        },
    }),
};
