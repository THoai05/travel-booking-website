// hooks/useHotelManager.js
import { useState, useCallback, useEffect } from 'react';
import { hotelService } from '../services/HotelService'; // Import service bro đã có

export const useHotelManager = () => {
    const [hotels, setHotels] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalItems: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Dùng useCallback để tránh tạo lại hàm khi re-render
    const fetchHotels = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await hotelService.findAll(page, limit);
            // Fallback an toàn nếu API trả về null/undefined
            setHotels(result?.data.data || []);
            setPagination({
                page: Number(result?.data.page) || 1,
                totalItems: result?.data.totalItems || 0,
                totalPages: result?.data.totalPages || 0,
            });
        } catch (e) {
            console.error("Fetch Error:", e);
            setError(e.response.data.message || 'Không thể tải danh sách khách sạn.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createHotel = async (dto) => {
        setIsLoading(true);
        try {
            await hotelService.create(dto);
            await fetchHotels(1); // Tạo xong reload về trang 1
            return { success: true, message: 'Tạo khách sạn thành công!' };
        } catch (e) {
            console.log(e)
            setError(e.response.data.message);
            return { success: false, message: e.response.data.message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateHotel = async (id, dto) => {
        setIsLoading(true);
        try {
            await hotelService.update(id, dto);
            await fetchHotels(pagination.page); // Update xong reload trang hiện tại
            return { success: true, message: 'Cập nhật thành công!' };
        } catch (e) {
            setError(e.response.data.message);
            return { success: false, message: e.response.data.message };
        } finally {
            setIsLoading(false);
        }
    };

    const removeHotel = async (id) => {
        setIsLoading(true);
        try {
            await hotelService.remove(id);
            // Logic thông minh: Nếu xóa item cuối cùng của trang, lùi về trang trước
            const newPage = (hotels.length === 1 && pagination.page > 1) 
                            ? pagination.page - 1 
                            : pagination.page;
            await fetchHotels(newPage);
            return { success: true };
        } catch (e) {
            setError(e.response.data.message);
            return { success: false, message: e.response.data.message };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        hotels,
        pagination,
        isLoading,
        error,
        setError, // Để UI có thể clear lỗi thủ công
        fetchHotels,
        createHotel,
        updateHotel,
        removeHotel
    };
};