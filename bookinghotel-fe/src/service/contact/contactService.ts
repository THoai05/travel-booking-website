import api from "@/axios/axios";

export const sendContact = async (data: { name: string, email: string, message: string }) => {
    const res = await api.post(`/contact`, data);
    return res.data;
}

