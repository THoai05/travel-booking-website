"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function useDiscounts() {
    const API_URL = "http://localhost:3636/coupons";

    // Data
    const [data, setData] = useState([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //  Fetch data with pagination
    // Dependency array chỉ có API_URL để hàm fetchData không bị tạo lại liên tục
    const fetchData = useCallback(
        async (currentPage = page, currentLimit = limit) => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${API_URL}?page=${currentPage}&limit=${currentLimit}`
                );

                const receivedData = res.data.data || res.data.items || [];
                const receivedTotalItems = res.data.totalItems || res.data.total || 0;

                //  Tự tính totalPages nếu Backend không trả về trực tiếp
                let calculatedTotalPages = res.data.totalPages || 1;
                if (!res.data.totalPages && receivedTotalItems > 0) {
                    // Công thức: Math.ceil(Total Items / Limit)
                    calculatedTotalPages = Math.ceil(receivedTotalItems / currentLimit);
                }

                //  LOG dữ liệu để debug
                console.log(`API Fetch success. Page: ${currentPage}, Total Items: ${receivedTotalItems}, Total Pages: ${calculatedTotalPages}`);

                setData(receivedData);
                setTotalItems(receivedTotalItems);
                setTotalPages(calculatedTotalPages);
            } catch (err) {
                console.error(" Lỗi tải dữ liệu:", err);
                // Log chi tiết lỗi phản hồi từ API
                setError(err.response?.data?.message || "Không thể tải dữ liệu coupon từ API");
            } finally {
                setLoading(false);
            }
        },
        [API_URL]
    );

    //  CRUD APIs
    const create = async (item) => {
        try {
            await axios.post(API_URL, item);
            await fetchData(1);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể tạo coupon");
        }
    };

    const update = async (id, item) => {
        try {
            await axios.put(`${API_URL}/${id}`, item);
            await fetchData(page);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể cập nhật coupon");
        }
    };

    const remove = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            // Sau khi xóa, gọi lại trang hiện tại (hoặc trang 1 nếu trang hiện tại hết data)
            await fetchData(page);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể xóa coupon");
        }
    };

    //  Change page - Thêm Log và điều kiện kiểm tra
    const changePage = (newPage) => {
        console.log(`Attempting to change page to: ${newPage}. Total Pages: ${totalPages}`);

        if (newPage >= 1 && newPage <= totalPages) {
            console.log(` Page change accepted: setting page to ${newPage}`);
            setPage(newPage);
        } else {
            console.log(` Page change rejected: ${newPage} is out of range (1 - ${totalPages}).`);
        }
    };

    //  Change items per page (Giữ nguyên)
    const changeLimit = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // reset về trang đầu
    };

    //  Auto refetch when page or limit changes
    // useEffect này là nơi duy nhất trigger fetchData khi state pagination đổi
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