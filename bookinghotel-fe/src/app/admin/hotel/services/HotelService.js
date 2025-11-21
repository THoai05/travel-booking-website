// services/HotelService.js

// --- CẤU HÌNH API VÀ MOCK DATA ---
const HOTEL_API_BASE_URL = 'http://localhost:3636/admin/hotels';
const MAX_RETRIES = 3;

/**
 * Hàm chung gọi API với cơ chế Exponential Backoff.
 * @param {string} url
 * @param {RequestInit} [options={}]
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, options = {}) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(url, options);

            if (response.ok || response.status < 500) {
                return response;
            }

            const errorBody = await response.json().catch(() => ({ message: 'Server error (5xx)' }));
            throw new Error(`Server Error (${response.status}): ${errorBody.message}`);

        } catch (e) {
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            } else {
                throw new Error(`Không thể kết nối đến server: ${e.message || 'Lỗi mạng không xác định'}`);
            }
        }
    }
    throw new Error("Không thể kết nối đến server sau nhiều lần thử.");
}

/**
 * Lớp Service chịu trách nhiệm giao tiếp với API Hotel.
 */
class HotelService {
    /**
     * Hàm kiểm tra response và throw lỗi chi tiết
     * @param {Response} response
     */
    async checkError(response) {
        if (!response.ok) {
            const status = response.status;
            const errorBody = await response.json().catch(() => ({ message: 'Lỗi phản hồi không xác định' }));
            throw new Error(errorBody.message || `Lỗi HTTP ${status}: Thao tác thất bại.`);
        }
    }

    async findAll(page = 1, limit = 10) {
        const response = await fetchWithRetry(`${HOTEL_API_BASE_URL}?page=${page}&limit=${limit}`);
        await this.checkError(response);
        return response.json();
    }

    async findOne(id) {
        const response = await fetchWithRetry(`${HOTEL_API_BASE_URL}/${id}`);
        await this.checkError(response);
        return response.json();
    }

    async create(dto) {
        const response = await fetchWithRetry(HOTEL_API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        await this.checkError(response);
        return response.json();
    }

    async update(id, dto) {
        const response = await fetchWithRetry(`${HOTEL_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });
        await this.checkError(response);
        return response.json();
    }

    async remove(id) {
        const response = await fetchWithRetry(`${HOTEL_API_BASE_URL}/${id}`, { method: 'DELETE' });
        await this.checkError(response);
        return response.json();
    }
}

export const hotelService = new HotelService();