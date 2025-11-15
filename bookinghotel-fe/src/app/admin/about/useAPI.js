"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3636/api';

/**
 * Custom Hook gọi API với khả năng quản lý trạng thái, lỗi và phân trang.
 * @param path Đường dẫn API (ví dụ: '/bookings/list')
 * @param initialParams Tham số tìm kiếm/lọc ban đầu (ví dụ: { search: 'hotel' })
 * @param initialPage Trang mặc định
 * @param initialLimit Giới hạn mục trên mỗi trang mặc định
 */
export function useApi(
    path,
    initialParams = {},
    initialPage = 1,
    initialLimit = 10
) {
// --- States cho Data và Trạng thái ---
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- States cho Phân trang (Pagination) ---
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    // Thông tin Pagination trả về từ Backend
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);


    // Hàm fetch data chính
    const fetchData = useCallback(async () => {
        // Giả định chỉ các endpoint có '/list' là cần phân trang
        const isPaginatedEndpoint = path.includes('/list');

        try {
            setLoading(true);
            setError(null);

            const url = `${API_BASE_URL}${path}`;

            // 1. Tạo tham số cuối cùng
            let finalParams = { ...initialParams };

            //  CHỈ THÊM PAGE/LIMIT NẾU ĐÓ LÀ ENDPOINT PHÂN TRANG
            if (isPaginatedEndpoint) {
                finalParams = {
                    ...finalParams,
                    page: page, // ⬅️ Luôn gửi tham số page
                    limit: limit, // ⬅️ Luôn gửi tham số limit
                };
            }

            // 2. Gửi request
            const response = await axios.get(url, { params: finalParams });
            const responseData = response.data;

            // 3. Xử lý Data và Pagination Info từ Backend
            if (isPaginatedEndpoint) {
                // Endpoint phân trang: Lấy data từ trường 'data'
                setData(responseData.data);

                // Cập nhật thông tin phân trang
                setTotalItems(responseData.totalItems || responseData.total || 0);
                setTotalPages(responseData.totalPages || 1);
            } else {
                // Endpoint không phân trang (ví dụ: /revenue/summary)
                setData(responseData);

                // Reset/đặt mặc định thông tin phân trang
                setTotalItems(1);
                setTotalPages(1);
            }

        } catch (err) {
            console.error("Lỗi gọi API:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [path, page, limit, JSON.stringify(initialParams)]);
    // Re-fetch khi path, page, limit hoặc initialParams thay đổi


    // useEffect để tự động gọi API
    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // --- Hàm điều khiển Phân trang ---

    // Hàm đổi trang (Dùng trong component Table)
    const changePage = (newPage) => {
        // Chỉ cho phép chuyển trang nếu là endpoint phân trang và trang hợp lệ
        if (path.includes('/list') && newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Hàm đổi limit (reset về trang 1)
    const changeLimit = (newLimit) => {
        if (path.includes('/list')) {
            setLimit(newLimit);
            setPage(1); // Luôn về trang 1 khi đổi limit
        }
    };


    // ✅ Trả về kết quả đầy đủ
    return {
        // Data & Status
        data,
        loading,
        error,
        // Pagination Info 
        page,
        limit,
        totalItems,
        totalPages,
        // Pagination Controls
        setPage,
        setLimit: changeLimit, // Đổi tên hàm
        changePage,
        fetchData, // Cho phép re-fetch thủ công
    };
}