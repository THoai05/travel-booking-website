// hooks/useApi.js
import { useState, useEffect } from 'react';
import axios from 'axios';

// Đảm bảo PORT và PATH base là đúng theo Postman: http://localhost:3636
const API_BASE_URL = 'http://localhost:3636/api';

export function useApi(path) { // path: '/bookings/list' hoặc '/revenue/summary'
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Full URL: http://localhost:3636/api/bookings/list
                const response = await axios.get(`${API_BASE_URL}${path}`);
                setData(response.data);
            } catch (err) {
                console.error("Lỗi gọi API:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [path]);

    return { data, loading, error };
}