"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useDiscounts() {
    const API_URL = "http://localhost:3636/coupons";

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}?page=${currentPage}&limit=${currentLimit}`);
            const raw = res.data;

            const items = raw?.data || raw?.items || [];
            const total = raw?.totalItems || raw?.total || items.length;
            const pages = raw?.totalPages || Math.ceil(total / currentLimit);

            setData(items);
            setTotalItems(total);
            setTotalPages(pages);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setError(err.response?.data?.message || "Không thể tải dữ liệu coupon từ API");
            toast.error(err.response?.data?.message || "Không thể tải dữ liệu coupon");
        } finally {
            setLoading(false);
        }
    }, [API_URL]); // chỉ phụ thuộc API_URL, không phụ thuộc page/limit

    const create = async (item) => {
        try {
            await axios.post(API_URL, item);
            toast.success("Tạo coupon thành công!");
            await fetchData(1); // quay về trang đầu
            setPage(1);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể tạo coupon");
            toast.error(err.response?.data?.message || "Không thể tạo coupon");
        }
    };

    const update = async (id, item) => {
        try {
            await axios.put(`${API_URL}/${id}`, item);
            toast.success("Cập nhật coupon thành công!");
            await fetchData(page);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể cập nhật coupon");
            toast.error(err.response?.data?.message || "Không thể cập nhật coupon");
        }
    };

    const remove = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            toast.success("Xóa coupon thành công!");

            // Nếu xóa item cuối cùng trên trang hiện tại
            if (data.length === 1 && page > 1) {
                setPage(page - 1);
                await fetchData(page - 1);
            } else {
                await fetchData(page);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Không thể xóa coupon");
            toast.error(err.response?.data?.message || "Không thể xóa coupon");
        }
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const changeLimit = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    useEffect(() => {
        fetchData(page, limit);
    }, [page, limit, fetchData]);

    return {
        data,
        loading,
        error,
        page,
        limit,
        totalItems,
        totalPages,
        fetchData,
        create,
        update,
        remove,
        changePage,
        changeLimit,
    };
}
