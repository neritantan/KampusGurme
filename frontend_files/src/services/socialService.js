import api from './api';

export const getComments = async (menuId) => {
    try {
        const response = await api.get(`menu/${menuId}/comment/`);
        return response.data;
    } catch (error) {
        console.error('Yorumlar alinamadi:', error);
        return [];
    }
};

export const postComment = async (menuId, mealId, text) => {
    try {
        const payload = {
            comment_text: text,
            subject_meal: mealId // Optional, can be null for general comments
        };
        const response = await api.post(`menu/${menuId}/comment/`, payload);
        return response.data;
    } catch (error) {
        console.error('Yorum gonderilemedi:', error);
        throw error;
    }
};

export const rateMeal = async (menuId, mealId, rating) => {
    try {
        const payload = {
            meal: mealId,
            rating: rating
        };
        const response = await api.post(`menu/${menuId}/rate/`, payload);
        return response.data;
    } catch (error) {
        console.error('Puan verilemedi:', error);
        throw error;
    }
};

export const voteComment = async (commentId, type) => {
    try {
        // type: 'UP' or 'DOWN'
        const response = await api.post(`social/vote/${commentId}/`, { vote_type: type });
        return response.data;
    } catch (error) {
        console.error('Oylama başarısız:', error);
        throw error;
    }
};

export const getLeaderboard = async () => {
    try {
        const response = await api.get('social/leaderboard/');
        return response.data;
    } catch (error) {
        console.error('Liderlik tablosu alınamadı:', error);
        throw error;
    }
};

export const getUserActivity = async () => {
    try {
        const response = await api.get('user/activity/');
        return response.data;
    } catch (error) {
        console.error('Kullanıcı aktivitesi alınamadı:', error);
        throw error;
    }
};
