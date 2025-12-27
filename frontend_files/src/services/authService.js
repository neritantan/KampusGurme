import api from './api';

export const login = async (username, password) => {
    const response = await api.post('auth/login/', { username, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('auth/register/', userData);
    return response.data;
};

export const logout = async () => {
    await api.post('auth/logout/');
};

export const checkAuth = async () => {
    try {
        const response = await api.get('auth/check/');
        return response.data;
    } catch (error) {
        return { isAuthenticated: false };
    }
};

export const getCsrfToken = async () => {
    await api.get('auth/csrf/');
};
