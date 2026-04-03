import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getStars = async () => {
    const res = await api.get('/stars');
    return res.data;
}

export const getLightCurve = async (starId: string) => {
    const res = await api.get(`/stars/${starId}/lightcurve`);
    return res.data;
}

export const detectAnomalies = async (starId: string) => {
    const res = await api.post(`/stars/${starId}/anomalies`);
    return res.data;
}
