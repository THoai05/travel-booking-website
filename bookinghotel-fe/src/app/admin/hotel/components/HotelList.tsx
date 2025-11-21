// components/HotelList.jsx

import React from 'react';
import { Plus, Edit, Trash2, Eye, List } from 'lucide-react';

/** Component hiển thị danh sách khách sạn và phân trang. */
export const HotelList = ({ data, pagination, isLoading, onPageChange, onViewDetail, onEdit, onRemove, onCreate }) => {
    const { page, totalItems, totalPages } = pagination;

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-t-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu...</span>
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
                    <List className="w-7 h-7 mr-3 text-blue-600" />
                    Danh Sách Khách Sạn
                </h2>
                <button
                    onClick={onCreate}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Thêm Khách Sạn Mới
                </button>
            </div>

            {isLoading && <LoadingSpinner />}

            {!isLoading && data.length === 0 && (
                <div className="p-10 text-center text-gray-500 italic">
                    Chưa có khách sạn nào được tạo. Bấm "Thêm Khách Sạn Mới" để bắt đầu!
                </div>
            )}

            {!isLoading && data.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Khách Sạn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá TB</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ vào</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ ra</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-blue-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hotel.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{hotel.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hotel.cityId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {hotel.avgPrice ? `${new Intl.NumberFormat('vi-VN').format(hotel.avgPrice)} VNĐ` : 'Chưa có'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 break-words overflow-hidden">
                                        {hotel.address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-sm text-gray-700">{hotel.phone}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-sm text-gray-700">{hotel.checkInTime}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-sm text-gray-700">{hotel.checkOutTime}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => onViewDetail(hotel.id)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition duration-150" title="Xem chi tiết">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => onEdit(hotel)} className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-100 transition duration-150" title="Chỉnh sửa">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => onRemove(hotel.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition duration-150" title="Xóa">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Hiển thị {data.length} trên tổng số {totalItems} mục.
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1 || isLoading}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            Trang Trước
                        </button>
                        <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages || isLoading}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            Trang Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};