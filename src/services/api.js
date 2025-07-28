import axios from 'axios';

const API_BASE_URL = 'https://api.example.com/traces';

export const fetchProductTrace = async (traceId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${traceId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product trace:', error);
        throw error;
    }
};

export const submitTraceData = async (traceData) => {
    try {
        const response = await axios.post(API_BASE_URL, traceData);
        return response.data;
    } catch (error) {
        console.error('Error submitting trace data:', error);
        throw error;
    }
};