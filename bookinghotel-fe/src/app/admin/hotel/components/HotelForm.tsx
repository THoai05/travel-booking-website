// components/HotelForm.jsx
import React, { useState, useEffect } from 'react';
import { 
    Loader2, Save, X, CheckSquare, Square, Plus, Trash2, 
    BedDouble, DollarSign, CalendarClock, ShieldCheck 
} from 'lucide-react';

// --- ENUMS & DEFAULTS ---

const PAYMENT_POLICIES = ['PAY_NOW', 'PAY_AT_HOTEL', 'PAY_LATER'];
const CANCELLATION_POLICIES = ['NON_REFUNDABLE', 'FREE_CANCELLATION', 'PAY_AT_HOTEL'];
const ROOM_TYPE_OPTIONS = [
    'standard', 'double room', 'triple room', 'deluxe double', 
    'deluxe triple', 'deluxe family', 'grand family'
];

const DEFAULT_RATE_PLAN = {
    name: 'Standard Rate',
    original_price: 0,
    sale_price: 0,
    includes_breakfast: false,
    payment_policy: 'PAY_NOW',
    cancellation_policy: 'NON_REFUNDABLE',
    cancellation_deadline_days: 0
};

const DEFAULT_ROOM_TYPE = {
    name: 'standard',
    description: '',
    max_guests: 2,
    total_inventory: 1,
    bed_type: '',
    area: '',
    quantity: 1,
    ratePlans: [] // ✅ Có thêm mảng RatePlans
};

const DEFAULT_FORM_STATE = {
    name: '',
    description: '',
    address: '',
    country: 'Vietnam',
    phone: '',
    policies: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cityId: '',
    avgPrice: '',
    isFeatured: false,
    amenities: [],
    roomTypes: []
};

// Mock Amenities
const MOCK_AMENITIES_OPTIONS = [
    { id: 1, name: 'Wifi miễn phí' },
    { id: 2, name: 'Bể bơi' },
    { id: 3, name: 'Bãi đỗ xe' },
    { id: 4, name: 'Nhà hàng' },
    { id: 5, name: 'Gym' },
];

export const HotelForm = ({ isEdit, initialData, isLoading, onSubmit, onCancel, amenitiesOptions = MOCK_AMENITIES_OPTIONS }) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
    const [localError, setLocalError] = useState(null);

    // --- 1. INITIALIZE DATA ---
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                ...DEFAULT_FORM_STATE,
                ...initialData,
                cityId: initialData.cityId ?? '', 
                avgPrice: initialData.avgPrice ?? '',
                description: initialData.description || '',
                policies: initialData.policies || '',
                checkInTime: initialData.checkInTime?.slice(0, 5) || '14:00',
                checkOutTime: initialData.checkOutTime?.slice(0, 5) || '12:00',
                amenities: initialData.amenities ? initialData.amenities.map(a => a.id) : [],
                // Map Deep Nested Data (RoomTypes -> RatePlans)
                roomTypes: (initialData.roomTypes || []).map(rt => ({
                    ...rt,
                    ratePlans: rt.ratePlans || []
                }))
            });
        } else {
            setFormData(DEFAULT_FORM_STATE);
        }
    }, [isEdit, initialData]);

    // --- 2. BASIC HANDLERS ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (localError) setLocalError(null);
    };

    const toggleAmenity = (amenityId) => {
        setFormData(prev => {
            const currentAmenities = prev.amenities || [];
            return currentAmenities.includes(amenityId)
                ? { ...prev, amenities: currentAmenities.filter(id => id !== amenityId) }
                : { ...prev, amenities: [...currentAmenities, amenityId] };
        });
    };

    // --- 3. ROOM TYPE LOGIC ---
    const addRoomType = () => {
        setFormData(prev => ({
            ...prev,
            roomTypes: [...prev.roomTypes, { ...DEFAULT_ROOM_TYPE, ratePlans: [] }]
        }));
    };

    const removeRoomType = (index) => {
        setFormData(prev => ({
            ...prev,
            roomTypes: prev.roomTypes.filter((_, i) => i !== index)
        }));
    };

    const handleRoomTypeChange = (index, field, value) => {
        const newRoomTypes = [...formData.roomTypes];
        newRoomTypes[index] = { ...newRoomTypes[index], [field]: value };
        setFormData(prev => ({ ...prev, roomTypes: newRoomTypes }));
    };

    // --- 4. RATE PLAN LOGIC (DEEP NESTED) ---
    // Thêm Rate Plan vào Room Type cụ thể
    const addRatePlan = (roomTypeIndex) => {
        const newRoomTypes = [...formData.roomTypes];
        newRoomTypes[roomTypeIndex].ratePlans.push({ ...DEFAULT_RATE_PLAN });
        setFormData(prev => ({ ...prev, roomTypes: newRoomTypes }));
    };

    // Xóa Rate Plan
    const removeRatePlan = (roomTypeIndex, ratePlanIndex) => {
        const newRoomTypes = [...formData.roomTypes];
        newRoomTypes[roomTypeIndex].ratePlans = newRoomTypes[roomTypeIndex].ratePlans.filter((_, i) => i !== ratePlanIndex);
        setFormData(prev => ({ ...prev, roomTypes: newRoomTypes }));
    };

    // Update Rate Plan Field
    const handleRatePlanChange = (roomTypeIndex, ratePlanIndex, field, value, type = 'text', checked = false) => {
        const newRoomTypes = [...formData.roomTypes];
        const targetRatePlan = newRoomTypes[roomTypeIndex].ratePlans[ratePlanIndex];
        
        newRoomTypes[roomTypeIndex].ratePlans[ratePlanIndex] = {
            ...targetRatePlan,
            [field]: type === 'checkbox' ? checked : value
        };
        setFormData(prev => ({ ...prev, roomTypes: newRoomTypes }));
    };

    // --- 5. SUBMIT HANDLER ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prepare Payload (Convert Types)
        const payload = {
            ...formData,
            cityId: Number(formData.cityId),
            avgPrice: formData.avgPrice ? Number(formData.avgPrice) : 0,
            
            name: formData.name.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim(),
            description: formData.description?.trim(),
            policies: formData.policies?.trim(),
            country: formData.country.trim(),
            isFeatured: Boolean(formData.isFeatured),
            
            amenities: formData.amenities,
            
            // Map RoomTypes
            roomTypes: formData.roomTypes.map(rt => ({
                ...rt,
                max_guests: Number(rt.max_guests),
                total_inventory: Number(rt.total_inventory),
                quantity: Number(rt.quantity || rt.total_inventory),
                
                // ✅ Map RatePlans (Level 3)
                ratePlans: rt.ratePlans.map(rp => ({
                    ...rp,
                    original_price: Number(rp.original_price),
                    sale_price: Number(rp.sale_price),
                    cancellation_deadline_days: Number(rp.cancellation_deadline_days || 0),
                    includes_breakfast: Boolean(rp.includes_breakfast)
                }))
            }))
        };

        // Basic Validation
        if (!payload.cityId || isNaN(payload.cityId) || payload.cityId < 1) {
            setLocalError("ID Thành phố phải là số nguyên dương.");
            return;
        }

        const phoneRegex = /^[0-9+ ]+$/;
        if (!phoneRegex.test(payload.phone)) {
            setLocalError("Số điện thoại không hợp lệ.");
            return;
        }

        if (payload.name.length > 30) return setLocalError("Tên khách sạn quá dài (tối đa 30 ký tự).");
        
        onSubmit(payload);
    };

    // Helper Input
    const renderInput = (label, name, type = "text", required = false, maxLength = 255, placeholder = "") => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                maxLength={maxLength}
                placeholder={placeholder}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
            />
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {isEdit ? 'Chỉnh Sửa Khách Sạn' : 'Thêm Mới Khách Sạn'}
                </h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {localError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-medium">
                    ⚠️ {localError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* --- PHẦN 1: THÔNG TIN CHUNG --- */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">1. Thông Tin Chung</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderInput("Tên Khách Sạn", "name", "text", true, 30, "Ví dụ: Grand Hotel")}
                        {renderInput("ID Thành Phố", "cityId", "number", true, undefined, "Nhập ID (Ví dụ: 1)")}
                        {renderInput("Địa Chỉ", "address", "text", true, 255)}
                        {renderInput("Quốc Gia", "country", "text", true, 100)}
                        {renderInput("Số Điện Thoại", "phone", "tel", true, 20)}
                        {renderInput("Giá Trung Bình", "avgPrice", "number")}
                        {renderInput("Giờ Check-in", "checkInTime", "time")}
                        {renderInput("Giờ Check-out", "checkOutTime", "time", true)}
                    </div>
                </div>

                {/* --- PHẦN 2: TIỆN ÍCH --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">2. Tiện Nghi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {amenitiesOptions.map((amenity) => {
                            const isSelected = formData.amenities?.includes(amenity.id);
                            return (
                                <div key={amenity.id} onClick={() => !isLoading && toggleAmenity(amenity.id)}
                                    className={`flex items-center space-x-2 cursor-pointer p-2 rounded transition ${isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}>
                                    {isSelected ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                                    <span className="text-sm font-medium">{amenity.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* --- PHẦN 3: LOẠI PHÒNG & GIÁ (NESTED DTO) --- */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">3. Loại Phòng & Giá</h3>
                        <button type="button" onClick={addRoomType} className="flex items-center text-sm px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition">
                            <Plus className="w-4 h-4 mr-1" /> Thêm Loại Phòng
                        </button>
                    </div>

                    {formData.roomTypes.length === 0 && (
                        <div className="text-gray-500 text-sm italic p-4 bg-gray-50 rounded border border-dashed border-gray-300 text-center">
                            Chưa có loại phòng nào.
                        </div>
                    )}

                    <div className="space-y-6">
                        {formData.roomTypes.map((rt, rtIndex) => (
                            <div key={rtIndex} className="p-5 border border-gray-300 rounded-xl bg-gray-50 relative animate-fade-in-up shadow-sm">
                                {/* DELETE ROOM BUTTON */}
                                <button type="button" onClick={() => removeRoomType(rtIndex)}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 bg-white rounded-full shadow border border-gray-200">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                
                                {/* --- ROOM TYPE INPUTS --- */}
                                <div className="mb-4">
                                    <h4 className="text-md font-bold text-gray-800 flex items-center mb-3">
                                        <BedDouble className="w-5 h-5 mr-2 text-blue-600" /> 
                                        Thông Tin Phòng #{rtIndex + 1}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600">Loại Phòng</label>
                                            <select value={rt.name} onChange={(e) => handleRoomTypeChange(rtIndex, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border rounded text-sm bg-white">
                                                {ROOM_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600">Số khách</label>
                                            <input type="number" value={rt.max_guests} min="1"
                                                onChange={(e) => handleRoomTypeChange(rtIndex, 'max_guests', e.target.value)}
                                                className="w-full px-3 py-2 border rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600">Số lượng</label>
                                            <input type="number" value={rt.total_inventory} min="0"
                                                onChange={(e) => handleRoomTypeChange(rtIndex, 'total_inventory', e.target.value)}
                                                className="w-full px-3 py-2 border rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600">Loại Giường</label>
                                            <input type="text" value={rt.bed_type} placeholder="VD: 1 King"
                                                onChange={(e) => handleRoomTypeChange(rtIndex, 'bed_type', e.target.value)}
                                                className="w-full px-3 py-2 border rounded text-sm" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-gray-600">Mô tả phòng</label>
                                            <input type="text" value={rt.description} placeholder="Mô tả..."
                                                onChange={(e) => handleRoomTypeChange(rtIndex, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border rounded text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* --- RATE PLANS (NESTED LEVEL 3) --- */}
                                
                                <div className="mt-4 pl-4 border-l-2 border-blue-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="text-sm font-bold text-gray-700 flex items-center">
                                            <DollarSign className="w-4 h-4 mr-1" /> Các Gói Giá (Rate Plans)
                                        </h5>
                                        <button type="button" onClick={() => addRatePlan(rtIndex)}
                                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium">
                                            + Thêm Giá
                                        </button>
                                    </div>

                                    {rt.ratePlans.length === 0 && <p className="text-xs text-gray-400 italic">Chưa có gói giá nào.</p>}

                                    <div className="space-y-3">
                                        {rt.ratePlans.map((rp, rpIndex) => (
                                            <div key={rpIndex} className="p-3 bg-white border border-dashed border-gray-300 rounded-lg relative">
                                                <button type="button" onClick={() => removeRatePlan(rtIndex, rpIndex)}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div className="md:col-span-2">
                                                        <input type="text" placeholder="Tên gói (VD: Bao ăn sáng)" value={rp.name}
                                                            onChange={(e) => handleRatePlanChange(rtIndex, rpIndex, 'name', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded text-xs font-medium" />
                                                    </div>
                                                    <div>
                                                        <input type="number" placeholder="Giá Gốc" value={rp.original_price}
                                                            onChange={(e) => handleRatePlanChange(rtIndex, rpIndex, 'original_price', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded text-xs" />
                                                    </div>
                                                    <div>
                                                        <input type="number" placeholder="Giá Bán" value={rp.sale_price}
                                                            onChange={(e) => handleRatePlanChange(rtIndex, rpIndex, 'sale_price', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded text-xs font-bold text-green-600" />
                                                    </div>
                                                    
                                                    {/* Policies Enums */}
                                                    <div>
                                                        <select value={rp.payment_policy} onChange={(e) => handleRatePlanChange(rtIndex, rpIndex, 'payment_policy', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded text-xs">
                                                            {PAYMENT_POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <select value={rp.cancellation_policy} onChange={(e) => handleRatePlanChange(rtIndex, rpIndex, 'cancellation_policy', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded text-xs">
                                                            {CANCELLATION_POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                                                        </select>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <input type="checkbox" checked={rp.includes_breakfast}
                                                            onChange={(e) => handleRatePlanChange(rtIndex, rpIndex, 'includes_breakfast', null, 'checkbox', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 rounded" />
                                                        <span className="text-xs text-gray-600">Bao ăn sáng</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                    <button type="button" onClick={onCancel} disabled={isLoading} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Hủy Bỏ</button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center shadow-lg disabled:opacity-70">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {isEdit ? 'Lưu Thay Đổi' : 'Tạo Khách Sạn'}
                    </button>
                </div>
            </form>
        </div>
    );
};