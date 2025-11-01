"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type TransportTipKey =
    | "Taxi"
    | "Dịch vụ gọi xe"
    | "Xe buýt công cộng"
    | "Cho thuê xe máy"
    | "Cho thuê xe"
    | "Xe xích lô"
    | "Xe đạp"
    | "Đi bộ";

const TravelTipsSection = () => {
    const [activeTab, setActiveTab] = useState<TransportTipKey>("Taxi");
    const [openTip, setOpenTip] = useState<number | null>(null);

    const transportTips: Record<TransportTipKey, string> = {
        Taxi:
            "Taxi ở Thành phố Hồ Chí Minh rất phổ biến và thuận tiện, là lựa chọn phổ biến của khách du lịch. Một số hãng taxi uy tín hoạt động trong thành phố, chẳng hạn như Vinasun và Mai Linh, đảm bảo chuyến đi an toàn và có đồng hồ tính tiền. Hầu hết tài xế đều hiểu tiếng Anh cơ bản, giúp việc giao tiếp trở nên dễ dàng. Bạn nên ghi rõ địa điểm đến bằng tiếng Việt để tránh hiểu lầm.",
        "Dịch vụ gọi xe":
            "Các ứng dụng như Grab, Gojek và Be rất phổ biến, cho phép bạn đặt xe máy hoặc ô tô dễ dàng qua điện thoại.",
        "Xe buýt công cộng":
            "Xe buýt là phương tiện rẻ và phủ khắp thành phố, nhưng đôi khi đông đúc và không đúng giờ.",
        "Cho thuê xe máy":
            "Thuê xe máy là cách tuyệt vời để khám phá thành phố, giá thuê trung bình từ 100.000 – 150.000đ/ngày.",
        "Cho thuê xe":
            "Nếu đi theo nhóm, bạn có thể thuê ô tô riêng có tài xế để di chuyển tiện lợi hơn.",
        "Xe xích lô":
            "Trải nghiệm xe xích lô là cách thú vị để tham quan khu trung tâm, đặc biệt là khu Bến Thành.",
        "Xe đạp":
            "Một số khu vực như Thảo Điền có dịch vụ thuê xe đạp để bạn dạo quanh phố phường.",
        "Đi bộ":
            "Một số khu vực trung tâm như phố đi bộ Nguyễn Huệ rất thân thiện với người đi bộ.",
    };

    const practicalTips = [
        {
            title: "Thời điểm nào là tốt nhất để đến thăm Thành phố Hồ Chí Minh?",
            content:
                "Thời điểm tốt nhất để đến thăm Thành phố Hồ Chí Minh là vào mùa khô, từ tháng 12 đến tháng 4, khi thời tiết dễ chịu hơn và lượng mưa ít.",
        },
        {
            title:
                "Làm thế nào để tôi đi từ Sân bay Quốc tế Tân Sơn Nhất đến trung tâm thành phố?",
            content:
                "Bạn có thể đi taxi, đặt xe công nghệ hoặc sử dụng xe buýt 109/152 để đến trung tâm.",
        },
        {
            title:
                "Những điểm tham quan du lịch hàng đầu ở Thành phố Hồ Chí Minh là gì?",
            content:
                "Các điểm nổi bật bao gồm Nhà thờ Đức Bà, Bưu điện Trung tâm, Chợ Bến Thành và Phố đi bộ Nguyễn Huệ.",
        },
    ];

    return (
        <section className="max-w-[1200px] mx-auto py-16">
            <div className="flex items-start gap-3 mb-8 border-b border-gray-600 pb-4">
                <div className="bg-white backdrop-blur-md w-12 h-12 
                rounded-full flex items-center justify-center shadow-md">
                    <Image
                        src="/tips.png"
                        alt="icon"
                        width={35}
                        height={35}
                    />
                </div>
                <div>
                    <h2 className="text-2xl text-white font-bold">Mẹo du lịch thành phố Hồ Chí Minh</h2>
                    <p className="text-gray-400 text-sm">
                        Những điều cần biết trước khi du lịch ở đây
                    </p>
                </div>
            </div>

            {/* TRANSPORT */}
            <div className="mb-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tabs */}
                <div className="flex flex-col gap-2">
                    {Object.keys(transportTips).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as TransportTipKey)}
                            className={`px-4 py-2 text-left rounded-md font-medium text-sm transition ${activeTab === key
                                ? "bg-white text-[#0394f3] shadow-md"
                                : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="md:col-span-2 h-fit bg-white text-gray-800 p-4 rounded-md shadow-md">
                    {transportTips[activeTab]}
                </div>
            </div>

            {/* PRACTICAL TIPS */}
            <div>
                <h3 className="text-xl text-white font-semibold mb-3">
                    Mẹo thực tế cho Thành phố Hồ Chí Minh
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                    Những điều cần chuẩn bị và cách tốt nhất để tham quan
                </p>

                <div className="space-y-3">
                    {practicalTips.map((tip, index) => (
                        <div
                            key={index}
                            className="bg-white text-gray-900 rounded-md p-4 font-medium hover:shadow-lg transition"
                        >
                            <button
                                onClick={() => setOpenTip(openTip === index ? null : index)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <span>
                                    {index + 1}. {tip.title}
                                </span>
                                {openTip === index ? (
                                    <ChevronUp className="w-5 h-5 text-gray-700" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-700" />
                                )}
                            </button>

                            {openTip === index && (
                                <div className="mt-2 text-sm text-gray-700 font-normal">
                                    {tip.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button className="mt-6 text-sm text-white underline underline-offset-4 hover:text-sky-400 transition">
                    Xem tất cả các mẹo thực tế cho Thành Phố Hồ Chí Minh
                </button>
            </div>

        </section>
    );
};

export default TravelTipsSection;
