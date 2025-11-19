"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3636/admin/hotels";

export default function useHotels() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}?page=${page}&limit=${limit}`);
            setData(res.data.data);
            setTotal(res.data.total);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const create = async (item) => {
        await axios.post(API, item);
        fetchData();
    };

    const update = async (id, item) => {
        await axios.put(`${API}/${id}`, item);
        fetchData();
    };

    const remove = async (id) => {
        await axios.delete(`${API}/${id}`);
        fetchData();
    };

    useEffect(() => { fetchData(); }, [fetchData]);

    return { data, page, setPage, total, limit, loading, create, update, remove };
}
