import api from "@/axios/axios";

// Lấy tất cả favourites
export const getFavourites = async () => {
    const res = await api.get('/favourites');
    return res.data;
};

// Lấy favourites theo user
export const getFavouritesByUser = async (userId: number) => {
    const res = await api.get(`/favourites`, { params: { userId } });
    return res.data;
};


// Thêm mới một favourite
export const addFavourite = async (data: { userId: number; hotelId?: number; roomId?: number }) => {
    const res = await api.post('/favourites', data);
    return res.data;
};

// Xóa favourite
export const deleteFavourite = async (id: number) => {
    const res = await api.delete(`/favourites/${id}`);
    return res.data;
};

export const getFavouriteAnalytics = async () => {
    try {
        const response = await api.get(`/favourites/analytics`);
        return response.data; // Trả về dữ liệu JSON
    } catch (error) {
        console.error("Lỗi khi gọi API analytics:", error);
        throw error;
    }
};