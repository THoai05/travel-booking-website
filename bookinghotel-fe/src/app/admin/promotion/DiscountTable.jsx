import { Edit, Trash } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function DiscountTable({ data, onEdit, onDelete }) {
    return (
        <table className="w-full border-collapse text-sm">
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
                {data.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4 text-blue-600 font-medium">{item.code}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{item.discountValue}%</td>
                        <td className="py-3 px-4">{item.startDate}</td>
                        <td className="py-3 px-4">{item.endDate}</td>
                        <td className="py-3 px-4"><StatusBadge status={item.status} /></td>
                        <td className="py-3 px-4 flex gap-3">
                            <button onClick={() => onEdit(item)} className="text-blue-600"><Edit /></button>
                            <button onClick={() => onDelete(item.id)} className="text-red-600"><Trash /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
