"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function useDiscounts() {
    const api = "http://localhost:3636/coupons";
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await axios.get(api);
        setData(res.data);
    };

    const create = async (item) => {
        await axios.post(api, item);
        fetchData();
    };

    const update = async (id, item) => {
        await axios.put(`${api}/${id}`, item);
        fetchData();
    };  

    const remove = async (id) => {
        await axios.delete(`${api}/${id}`);
        fetchData();
    };

    useEffect(() => { fetchData(); }, []);

    return { data, create, update, remove };
}
