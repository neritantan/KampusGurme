import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
});

api.interceptors.request.use(config => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
        const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
        if (match) {
            config.headers['X-CSRFToken'] = match[2];
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
