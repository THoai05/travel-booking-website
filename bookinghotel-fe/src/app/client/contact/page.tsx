"use client"
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import Image from "next/image";
import { Button } from "primereact/button"
import { sendContact } from "@/service/contact/contactService"
import { toast, Toaster } from "sonner";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })

    const maxName = 50;
    const maxEmail = 50;
    const maxMessage = 1000;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };
    const validateForm = () => {
        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; // chỉ chữ và khoảng trắng
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Họ tên
        if (!formData.name.trim()) {
            toast.error("Họ và tên là bắt buộc");
            return false;
        }
        if (!nameRegex.test(formData.name)) {
            toast.error("Không đúng định dạng họ và tên");
            return false;
        }
        if (formData.name.length > maxName) {
            toast.error(`Họ và tên không quá ${maxName} ký tự`);
            return false;
        }

        // Email
        if (!formData.email.trim()) {
            toast.error("Email là bắt buộc");
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error("Định dạng email không đúng");
            return false;
        }
        if (formData.email.length > maxEmail) {
            toast.error(`Email không quá ${maxEmail} ký tự`);
            return false;
        }

        // Nội dung
        if (!formData.message.trim()) {
            toast.error("Nội dung là bắt buộc");
            return false;
        }
        if (formData.message.length > maxMessage) {
            toast.error(`Nội dung không vượt quá ${maxMessage} ký tự`);
            return false;
        }

        return true;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const res = await sendContact(formData);
            toast.success(res.message);
            setFormData({ name: "", email: "", message: "" });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Không thể gửi email, vui lòng thử lại sau");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <Toaster richColors position="top-right" />
            <div className="max-w-6xl mx-auto mt-5">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Liên hệ với chúng tôi</h1>
                <p className="text-gray-600 mb-8">
                    Gửi thắc mắc hoặc góp ý của bạn, chúng tôi sẽ phản hồi sớm nhất.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit}
                        className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><i className="pi pi-send text-gray-800 text-xl"></i> Gửi tin nhắn cho chúng tôi</h2>
                        <p className="text-gray-500">Điền thông tin và tin nhắn, chúng tôi sẽ liên hệ lại với bạn</p>
                        <div className="relative mb-10">
                            <label className="block mb-3 mt-5">
                                <span className="text-lg font-medium text-gray-800">Họ tên *</span>
                                <InputText type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    maxLength={50}
                                    placeholder="Nhập họ tên của bạn"
                                    className="bg-gray-100 w-full mt-1 border border-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500" />
                            </label>
                            <div className="absolute bottom-1 right-3 text-sm text-gray-500">
                                {formData.name.length}/{maxName}
                            </div>
                        </div>
                        <div className="relative mb-10">
                            <label className="block mb-3 mt-5">
                                <span className="text-lg font-medium text-gray-800">Email *</span>
                                <InputText type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    maxLength={50}
                                    placeholder="email@gmail.com"
                                    className="bg-gray-100 w-full mt-1 border border-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500" />
                            </label>
                            <div className="absolute bottom-1 right-3 text-sm text-gray-500">
                                {formData.email.length}/{maxEmail}
                            </div>
                        </div>
                        <div className="relative mb-10">
                            <label className="block mb-3 mt-5">
                                <span className="text-lg font-medium text-gray-800">Nội dung liên hệ *</span>
                                <InputText type="text"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    maxLength={1000}
                                    placeholder="Nhập nội dung mà bạn muốn gửi đến chúng tôi"
                                    className="bg-gray-100 w-full mt-1 border border-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500" />
                            </label>
                            <div className="absolute bottom-1 right-3 text-sm text-gray-500">
                                {formData.message.length}/{maxMessage}
                            </div>
                        </div>
                        <Button
                            label="Gửi liên hệ"
                            icon="pi pi-send"
                            className="w-full rounded-lg !bg-black !text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                        />
                    </form>
                    {/* Google Map */}
                    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <Image src={"/images/map.png"} alt="icon" width={25} height={25} /> Vị trí khách sạn
                        </h2>
                        <p className="text-sm text-gray-600 mb-3">Tìm đường đến trụ sở Bluvera Company</p>

                        <div className="w-full h-100 overflow-hidden rounded-xl">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.501364021568!2d106.69825237481904!3d10.773374989377002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f41a37b8b4f%3A0x3d3af57e40978ff9!2zQ2jhu6MgQ8OhIFbEg24gVGjhuqFuaCBQaOG6p24!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-6">
                        <h2 className="text-xl mb-4 flex items-center gap-2"><i className="pi pi-phone text-gray-700 text-2xl font-semibold"></i>Thông tin liên hệ</h2>
                        <h2 className="text-xl font-semibold flex items-center gap-2"><i className="pi pi-map-marker text-blue-600"></i>Địa chỉ </h2>
                        <p className="text-gray-600">88 Đồng Khởi, Quận 1,TP. Hồ Chí Minh</p>
                        <hr className="my-6 border-t border-gray-300" />
                        <h2 className="text-xl font-semibold flex items-center gap-2"><i className="pi pi-phone text-green-500 text-2xl font-semibold"></i>Điện thoại</h2>
                        <p className="text-gray-600">(028) 3822 8888</p>
                        <p className="text-gray-600">Hotline: 1900 6688</p>
                        <hr className="my-6 border-t border-gray-300" />
                        <h2 className="text-xl font-semibold flex items-center gap-2"><i className="pi pi-envelope text-violet-700"></i>Email</h2>
                        <p className="text-gray-600">info@bluvera.com</p>
                        <hr className="my-6 border-t border-gray-300" />
                        <h2 className="text-xl font-semibold flex items-center gap-2"><i className="pi pi-clock text-orange-600"></i>Giờ làm việc</h2>
                        <p className="text-gray-600">Thứ 2 - Chủ nhật: 24/7</p>
                    </div>
                    <div className="h-48 bg-blue-50 rounded-2xl border border-blue-200 shadow-md">
                        <div className="flex items-center justify-center py-5">
                            <h1 className="text-blue-800 text-2xl font-semibold">Cần hỗ trợ ngay?</h1>
                        </div>
                        <div className="flex gap-4 justify-center items-center">
                            <Button label="Gọi hotline"
                                icon="pi pi-phone"
                                iconPos="left"
                                className="w-50 h-auto !bg-white !text-black !rounded-lg shadow-md border !border-gray-100 hover: !border-gray-200 transition" />
                            <Button label="Gửi email"
                                icon="pi pi-envelope"
                                iconPos="left"
                                className="w-50 h-auto !bg-white !text-black !rounded-lg shadow-md border !border-gray-100 hover: !border-gray-200 transition" />
                        </div>
                        <div className="flex text-blue-500 justify-center items-center py-4">Đội ngũ chăm sóc khách hàng 24/7 sẵn sàng hỗ trợ bạn</div>
                    </div>
                </div>
            </div >
        </div >
    )
}