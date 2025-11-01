"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3636/api';

// Thêm tham số `params` vào Hook
export function useApi(path, params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const url = `${API_BASE_URL}${path}`;

                // Gửi request với tham số tìm kiếm
                const response = await axios.get(url, { params });

                setData(response.data);
            } catch (err) {
                console.error("Lỗi gọi API:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [path, JSON.stringify(params)]); // Quan trọng: Re-fetch khi params thay đổi!

    return { data, loading, error };
}