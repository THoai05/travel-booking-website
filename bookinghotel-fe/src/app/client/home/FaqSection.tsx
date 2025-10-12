"use client";
import React, { useState } from "react";
import { Plus, X, Plane, Activity, MapPin, Hotel, Car, Building2, Ticket } from "lucide-react";
import styles from "../home/css/Faq.module.css";

const faqData = [
  {
    id: 1,
    question: "Làm thế nào để tôi đặt phòng trên website?",
    answer:
      "Chúng tôi cung cấp hướng dẫn từng bước giúp bạn dễ dàng tìm kiếm điểm đến, chọn phòng, xác nhận thanh toán và hoàn tất đặt chỗ chỉ trong vài phút.",
  },
  {
    id: 2,
    question: "Tôi cần chuẩn bị giấy tờ gì cho chuyến đi, và lấy ở đâu?",
    answer:
      "Thông tin giấy tờ cần thiết sẽ được gửi qua email xác nhận hoặc hiển thị trong phần quản lý đặt chỗ của bạn.",
  },
  {
    id: 3,
    question: "Nếu muốn đổi lịch hoặc hủy đặt phòng, tôi phải làm sao?",
    answer:
      "Bạn có thể vào phần quản lý đơn đặt phòng, chọn đặt phòng cần thay đổi và thực hiện thao tác trực tiếp.",
  },
  {
    id: 4,
    question: "Website hỗ trợ những hình thức thanh toán nào?",
    answer:
      "Chúng tôi hỗ trợ nhiều hình thức thanh toán như thẻ tín dụng, chuyển khoản và ví điện tử.",
  },
  {
    id: 5,
    question: "Giờ làm việc của đội ngũ hỗ trợ là khi nào?",
    answer:
      "Đội ngũ hỗ trợ hoạt động 24/7 để đảm bảo bạn luôn nhận được phản hồi kịp thời.",
  },
];

const categories = [
  { name: "Tour du lịch", icon: Plane },
  { name: "Hoạt động", icon: Activity },
  { name: "Điểm đến", icon: MapPin },
  { name: "Đặt phòng khách sạn", icon: Hotel },
  { name: "Thuê xe", icon: Car },
  { name: "Bất động sản nghỉ dưỡng", icon: Building2 },
  { name: "Đặt vé", icon: Ticket },
];

const FaqSection = () => {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <section className={`${styles.faqBackground} w-full py-20 relative overflow-hidden`}>
      <div className="max-w-[900px] mx-auto  z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Câu hỏi thường gặp</h2>
          <p className="text-gray-500">
            Giải đáp nhanh những thắc mắc phổ biến trước khi bạn khởi hành.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
            >
              <Icon className="w-4 h-4 text-gray-600" />
              {name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-[#F2F4F6] shadow-sm rounded-2xl overflow-hidden border border-gray-200">
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`border-b last:border-none transition ${activeId === item.id ? "bg-gray-50" : "bg-white"
                }`}
            >
              <button
                onClick={() =>
                  setActiveId(activeId === item.id ? null : item.id)
                }
                className="w-full flex justify-between items-center text-left p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-semibold text-gray-400">
                    {String(item.id).padStart(2, "0")}
                  </span>
                  <span className="text-base font-medium text-gray-800">
                    {item.question}
                  </span>
                </div>
                {activeId === item.id ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {activeId === item.id && (
                <div className="pl-[65px] pr-5 pb-5 text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer decor */}
      <div className="absolute bottom-0 left-0 w-full h-[80px] bg-[url('/city-footer.png')] bg-no-repeat bg-bottom bg-contain opacity-30"></div>
    </section>
  );
};

export default FaqSection;