import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Oturum süresi dolduğunda veya yetkisiz erişimde login sayfasına yönlendir
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 