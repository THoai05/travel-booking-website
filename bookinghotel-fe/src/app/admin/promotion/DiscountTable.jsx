// DiscountTable.js (Giữ nguyên - chỉ là minh họa)
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
// import StatusBadge from "./StatusBadge"; // Nhớ import StatusBadge nếu chưa có

export default function DiscountTable({
    data,
    page,
    totalPages,
    onEdit,
    onDelete,
    onNext,
    onPrev
}) {
    return (
        <div className="w-full border rounded-xl overflow-hidden shadow-sm bg-white">
            {/* Table */}
            <table className="w-full border-collapse text-sm">
                {/* ... (Phần Header và Body Table giữ nguyên) ... */}
                <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left">
                        <th className="py-3 px-4">Mã</th>
                        <th className="py-3 px-4">Giảm (%)</th>
                        <th className="py-3 px-4">Bắt đầu</th>
                        <th className="py-3 px-4">Kết thúc</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                                <td className="py-3 px-4 text-blue-600 font-medium">{item.code}</td>
                                <td className="py-3 px-4 text-green-600 font-semibold">
                                    {item.discountValue}%
                                </td>
                                <td className="py-3 px-4">{new Date(item.startDate).toLocaleDateString("vi-VN")}</td>
                                <td className="py-3 px-4">{new Date(item.endDate).toLocaleDateString("vi-VN")}</td>
                                <td className="py-3 px-4">
                                    {/* <StatusBadge status={item.status} /> */}
                                </td>
                                <td className="py-3 px-4 flex gap-3">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-blue-600 hover:text-blue-800 transition"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="text-red-600 hover:text-red-800 transition"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-5 text-gray-500">
                                Không có mã giảm giá nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                <button
                    onClick={onPrev}
                    disabled={page <= 1}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm ${page <= 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <ChevronLeft size={16} /> Trước
                </button>

                <p className="text-gray-600 text-sm">
                    Trang <span className="font-semibold">{page}</span> / {totalPages}
                </p>

                <button
                    onClick={onNext}
                    disabled={page >= totalPages}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm ${page >= totalPages
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    Sau <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}