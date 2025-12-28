import api from './api';

export const getDashboardStats = async (date) => {
    const params = date ? { date } : {};
    const response = await api.get('dashboard/stats/', { params });
    return response.data;
};

export const getDashboardAnalytics = async (month, year) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get('dashboard/analytics/', { params });
    return response.data;
};
