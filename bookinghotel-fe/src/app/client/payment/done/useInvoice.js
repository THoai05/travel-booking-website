import axios from "axios";
import toast from "react-hot-toast";

export const sendInvoice = async (bookingId) => {
    try {
        const res = await axios.post("http://localhost:3636/invoice/send", {
            bookingId: Number(bookingId)
        });

        toast.success("Email hóa đơn đã được gửi thành công!");
        return res.data;

    } catch (err) {
        const message = err.response?.data?.message || "Không thể gửi email hóa đơn!";
        toast.error(message);
        console.error(message);
    }
};
