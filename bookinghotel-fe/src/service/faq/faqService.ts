import axios from "@/axios/axios";

// 🧩 Định nghĩa kiểu dữ liệu chung cho FAQ
interface FaqPayload {
    question?: string;
    answer?: string;
    categories?: string;
    status?: string;
    updated_at?: string;
}

// 🟦 Lấy danh sách tất cả FAQ
export const getAllFaqs = async () => {
    try {
        const res = await axios.get(`/faq`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách FAQ:", error);
        throw error;
    }
};

// 🟩 Lấy chi tiết 1 FAQ theo id
export const getFaqById = async (id: number) => {
    try {
        const res = await axios.get(`/faq/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết FAQ:", error);
        throw error;
    }
};

// 🟧 Tạo mới FAQ (dành cho admin)
export const createFaq = async (faqData: FaqPayload) => {
    try {
        const res = await axios.post(`/faq`, faqData);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi tạo FAQ:", error);
        throw error;
    }
};

// 🟨 Cập nhật FAQ (dành cho admin)
export const updateFaq = async (id: number, faqData: FaqPayload) => {
    try {
        const res = await axios.put(`/faq/${id}`, faqData);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật FAQ:", error);
        throw error;
    }
};

// 🟥 Xóa FAQ (dành cho admin)
export const deleteFaq = async (id: number) => {
    try {
        const res = await axios.delete(`/faq/${id}`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi xóa FAQ:", error);
        throw error;
    }
};
