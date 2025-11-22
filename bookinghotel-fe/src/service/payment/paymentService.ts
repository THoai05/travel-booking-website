import api from "@/axios/axios";

export const getPayments = async () => {
  try {
    const response = await api.get("/payments");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách payments:", error);
    return { data: [] }; // fallback
  }
};

export const getPaymentById = async (id: number) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy payment id=${id}:`, error);
    return null;
  }
};