// components/HotelDetail.jsx

import React from 'react';
import { HotelIcon, Edit, List, Clock } from 'lucide-react';

/** Component hiển thị chi tiết thông tin một khách sạn. */
export const HotelDetail = ({ hotel, onEdit, onBack }) => {
    const h = hotel;


    const detailItem = (label, value, isFullWidth = false) => (
        <div className={`py-2 border-b border-gray-100 ${isFullWidth ? 'lg:col-span-2' : ''}`}>
            <span className="block text-sm font-semibold text-gray-500">{label}:</span>
            <div className="mt-1 text-base text-gray-800">{value}</div>
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
                    <HotelIcon className="w-7 h-7 mr-3 text-blue-600" />
                    Chi Tiết: {h.name}
                </h2>
                <div className="flex space-x-3">
                    <button
                        onClick={() => onEdit(h)}
                        className="flex items-center px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 transform hover:scale-[1.02]"
                    >
                        <Edit className="w-5 h-5 mr-2" />
                        Sửa
                    </button>
                    <button
                        onClick={onBack}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
                    >
                        <List className="w-5 h-5 mr-2" />
                        Quay lại Danh sách
                    </button>
                </div>
            </div>

            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                {detailItem("ID", h.id)}
                {detailItem("ID Thành Phố", h.cityId)}
                {detailItem("Quốc Gia", h.country)}
                {detailItem("Số Điện Thoại", h.phone)}
                {detailItem("Địa Chỉ", h.address, true)}
            </div>

            {/* Thông tin Giá, Rating & Check-in/out */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Giá TB */}
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-500 mb-1">Giá TB</span>
                    <span className="text-xl font-bold text-green-600">
                        {h.avgPrice ? `${new Intl.NumberFormat('vi-VN').format(h.avgPrice)} VNĐ` : 'Chưa có'}
                    </span>
                </div>


                {/* Check-in */}
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-500 mb-1">Giờ Check-in</span>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-xl text-gray-800 font-bold">{h.checkInTime || '14:00:00'}</span>
                    </div>
                </div>

                {/* Check-out */}
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-500 mb-1">Giờ Check-out</span>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-5 h-5 text-red-500" />
                        <span className="text-xl text-gray-800 font-bold">{h.checkOutTime || '12:00:00'}</span>
                    </div>
                </div>
            </div>

            {/* Mô tả & Chính sách */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">Mô tả và Chính sách</h3>
                {/* Vẫn truyền <p> vào trong, nhưng giờ nó được chứa trong <div> (trong detailItem) */}
                {detailItem("Mô Tả", <p className="whitespace-pre-wrap">{h.description || 'Chưa có mô tả.'}</p>, true)}
                {detailItem("Chính Sách", <p className="whitespace-pre-wrap">{h.policies || 'Chưa có chính sách.'}</p>, true)}
            </div>

        </div>
    );
};