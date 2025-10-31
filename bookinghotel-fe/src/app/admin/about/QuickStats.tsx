import { Star, Building2, CreditCard, TrendingUp } from "lucide-react";

export default function StatsList() {
    const stats = [
        { icon: <Star className="text-yellow-500 w-5 h-5" />, text: "92% khách hàng hài lòng" },
        { icon: <Building2 className="text-blue-500 w-5 h-5" />, text: "12 khách sạn đối tác mới" },
        { icon: <CreditCard className="text-green-500 w-5 h-5" />, text: "70% thanh toán qua online" },
        { icon: <TrendingUp className="text-purple-500 w-5 h-5" />, text: "Doanh thu tăng 18.2% so với tháng trước" },
    ];

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border-gray-100">
            <h1 className="font-semibold mb-4">Thống kê nhanh</h1>
            <ul className="space-y-2 mt-10">
                {stats.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-800">
                        {s.icon}
                        <span>{s.text}</span>
                    </li>
                ))}
            </ul>
        </div>

    );
}
