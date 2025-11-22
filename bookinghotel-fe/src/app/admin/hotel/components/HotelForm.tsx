// components/HotelForm.jsx

import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

// Hàm tiện ích tạo initial state (Đã TỐI ƯU để luôn trả về string cho input)
const createInitialState = (initialData, isEdit) => {
    const defaultState = {
        name: '',
        description: '',
        address: '',
        country: 'Việt Nam',
        phone: '',
        policies: '',
        checkInTime: '14:00:00',
        checkOutTime: '12:00:00',
        cityId: '',
        avgPrice: '',
        isFeatured: false,
    };

    if (isEdit && initialData) {
        return {
            ...defaultState,
            // Đảm bảo mọi giá trị được khởi tạo luôn là STRING
            name: String(initialData.name || defaultState.name),
            description: String(initialData.description || defaultState.description),
            address: String(initialData.address || defaultState.address),
            country: String(initialData.country || defaultState.country),
            phone: String(initialData.phone || defaultState.phone),
            policies: String(initialData.policies || defaultState.policies),
            checkInTime: String(initialData.checkInTime || defaultState.checkInTime),
            checkOutTime: String(initialData.checkOutTime || defaultState.checkOutTime),

            // Xử lý Number: convert sang String cho input
            cityId: initialData.cityId !== undefined && initialData.cityId !== null ? String(initialData.cityId) : defaultState.cityId,
            avgPrice: initialData.avgPrice !== undefined && initialData.avgPrice !== null ? String(initialData.avgPrice) : defaultState.avgPrice,
            isFeatured: !!initialData.isFeatured,
        };
    }

    return defaultState;
};

/** Component Form dùng để tạo mới hoặc cập nhật khách sạn (Đã FIX lỗi reset input). */
export const HotelForm = ({ isEdit, initialData, isLoading, onSubmit, onCancel, onError }) => {

    //  Khởi tạo state lười (lazy initialization)
    const [formData, setFormData] = useState(() => createInitialState(initialData, isEdit));

    //  FIX: Đồng bộ lại khi chuyển mode hoặc chuyển giữa các hotel
    useEffect(() => {
        setFormData(createInitialState(initialData, isEdit));
    }, [isEdit, initialData?.id]);


    //  TỐI ƯU CÁCH XỬ LÝ CHANGE: Đảm bảo giá trị lưu trong state luôn là string
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const rawPayload = { ...formData };
        const payload = {};

        // 1. Validation và Type Casting cho City ID (Bắt buộc)
        const cityIdNum = Number(rawPayload.cityId);
        if (isNaN(cityIdNum) || cityIdNum <= 0) {
            onError('ID Thành Phố là bắt buộc và phải là số nguyên dương.');
            return;
        }
        payload.cityId = cityIdNum;

        // 2. Validation và Type Casting cho Avg Price (Tùy chọn)
        const avgPriceNum = Number(rawPayload.avgPrice);
        if (!isNaN(avgPriceNum) && rawPayload.avgPrice !== '') {
            payload.avgPrice = avgPriceNum;
        }


        // 3. Process Boolean (isFeatured)
        payload.isFeatured = !!rawPayload.isFeatured;

        // 4. Process String fields (Đã tối ưu logic kiểm tra rỗng)
        ['name', 'address', 'country', 'phone', 'checkOutTime', 'description', 'policies', 'checkInTime'].forEach(key => {
            if (rawPayload[key] !== undefined && rawPayload[key] !== null) {
                const value = String(rawPayload[key]);
                payload[key] = value;
            }
        });

        // Cần đảm bảo các trường bắt buộc phải có giá trị
        if (!payload.name || !payload.address || !payload.country || !payload.phone || !payload.checkOutTime) {
            onError('Các trường Tên, Địa chỉ, Quốc gia, Số điện thoại, Giờ Check-out là bắt buộc.');
            return;
        }


        onSubmit(payload);
    };

    const InputField = ({ label, name, type = 'text', required = false, placeholder = '' }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                // ✅ Đảm bảo value luôn lấy từ formData[name] (đã là string)
                value={formData[name] === undefined || formData[name] === null ? '' : formData[name]}
                onChange={handleChange}
                required={required}
                placeholder={placeholder}
                min={type === 'number' ? 0 : undefined}
                step={type === 'number' && name === 'avgPrice' ? 'any' : name === 'cityId' ? '1' : undefined}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
            />
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">
                {isEdit ? 'Cập Nhật Khách Sạn' : 'Tạo Khách Sạn Mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Tên Khách Sạn" name="name" required />
                    <InputField label="ID Thành Phố" name="cityId" type="number" required placeholder='Ví dụ: 1, 2, 3...' />
                    <InputField label="Địa chỉ" name="address" required />
                    <InputField label="Quốc gia" name="country" required />
                    <InputField label="Số Điện Thoại" name="phone" type="tel" required />
                    <InputField label="Giá Trung Bình (VNĐ)" name="avgPrice" type="number" placeholder='Ví dụ: 1500000' />
                    <InputField label="Giờ Check-in (HH:MM:SS)" name="checkInTime" placeholder="Ví dụ: 14:00:00" />
                    <InputField label="Giờ Check-out (HH:MM:SS)" name="checkOutTime" required placeholder="Ví dụ: 12:00:00" />
                </div>

                {/* Mô tả */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    ></textarea>
                </div>

                {/* Chính sách */}
                <div>
                    <label htmlFor="policies" className="block text-sm font-medium text-gray-700">Chính sách</label>
                    <textarea
                        name="policies"
                        id="policies"
                        rows={3}
                        value={formData.policies}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    ></textarea>
                </div>

                {/* Is Featured */}
                <div className="flex items-center">
                    <input
                        id="isFeatured"
                        name="isFeatured"
                        type="checkbox"
                        checked={!!formData.isFeatured}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <label htmlFor="isFeatured" className="ml-3 text-base font-medium text-gray-700 cursor-pointer">
                        Là Khách Sạn Nổi Bật
                    </label>
                </div>

                {/* Actions */}
                <div className="pt-5 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] flex items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                {isEdit ? 'Cập Nhật' : 'Tạo Mới'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};