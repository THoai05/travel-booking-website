// HotelAdminApp.jsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { HotelList } from './components/HotelList';
import { HotelForm } from './components/HotelForm';
import { HotelDetail } from './components/HotelDetail';
import { AlertModal } from './components/AlertModal';
import { hotelService } from './services/HotelService';

const DEFAULT_PAGINATION = { page: 1, totalItems: 0, totalPages: 0 };

export default function HotelAdminApp() {
    // State quản lý View
    const [view, setView] = useState('list');
    const [selectedHotel, setSelectedHotel] = useState(null);

    // State quản lý Data & API
    const [hotels, setHotels] = useState([]);
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);

    const limit = 10;
    const setPage = (newPage) => setPagination(prev => ({ ...prev, page: newPage }));


    // --- Logic Fetch Data (Find All) ---
    const fetchHotels = useCallback(async (p) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await hotelService.findAll(p, limit);
            setHotels(result.data || []);
            setPagination({
                page: result.page,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
            });
        } catch (e) {
            setError(e.message || 'Lấy danh sách khách sạn thất bại.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === 'list') {
            fetchHotels(pagination.page);
        }
    }, [view, pagination.page, fetchHotels]);


    // --- Logic Thao tác CRUD ---

    const handleViewDetail = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const hotel = await hotelService.findOne(id);
            setSelectedHotel(hotel);
            setView('detail');
        } catch (e) {
            setError(e.message || 'Lấy chi tiết khách sạn thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = (id) => {
        setModal({
            show: true,
            title: 'Xác nhận xoá',
            message: `Ban có chắc muốn xoá khách sạn ID: ${id} không? Hành động này không thể hoàn tác!`,
            isConfirm: true,
            onConfirm: async () => {
                setModal(null);
                setIsLoading(true);
                try {
                    await hotelService.remove(id);
                    setModal({
                        show: true,
                        title: 'Thành công',
                        message: 'Xoá khách sạn thành công!',
                        isSuccess: true,
                        onClose: () => setModal(null),
                    });
                    fetchHotels(1);
                } catch (e) {
                    setError(e.message || 'Xoá khách sạn thất bại.');
                } finally {
                    setIsLoading(false);
                }
            },
            onClose: () => setModal(null),
        });
    };

    const handleFormError = (message) => {
        setError(message);
        setIsLoading(false);
    }

    const handleSubmitForm = async (dto) => {
        setIsLoading(true);
        setError(null);
        try {
            let result;
            if (view === 'create') {
                result = await hotelService.create(dto);
                setModal({
                    show: true,
                    title: 'Thành công',
                    message: `Khách sạn "${result.name}" đã được tạo mới!`,
                    isSuccess: true,
                    onClose: () => setModal(null),
                });
            } else if (view === 'edit' && selectedHotel) {
                result = await hotelService.update(selectedHotel.id, dto);
                setModal({
                    show: true,
                    title: 'Thành công',
                    message: `Khách sạn "${result.name}" đã được cập nhật!`,
                    isSuccess: true,
                    onClose: () => setModal(null),
                });
            }

            setView('list');
            fetchHotels(pagination.page || 1);
        } catch (e) {
            setError(e.message || `Thao tác ${view === 'create' ? 'tạo mới' : 'cập nhật'} thất bại.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (hotel) => {
        setSelectedHotel(hotel);
        setView('edit');
    };

    const handleCreate = () => {
        setSelectedHotel(null);
        setView('create');
    };

    const handleCancel = () => {
        setSelectedHotel(null);
        setError(null);
        setView('list');
    };


    // --- Render Chính (Switch View) ---
    const renderView = () => {
        switch (view) {
            case 'list':
                return (
                    <HotelList
                        data={hotels}
                        pagination={pagination}
                        isLoading={isLoading}
                        onPageChange={setPage}
                        onViewDetail={handleViewDetail}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                        onCreate={handleCreate}
                    />
                );
            case 'create':
                return (
                    <HotelForm
                        isEdit={false}
                        initialData={null}
                        isLoading={isLoading}
                        onSubmit={handleSubmitForm}
                        onCancel={handleCancel}
                        onError={handleFormError}
                    />
                );
            case 'edit':
                if (!selectedHotel) return <div className="p-4 text-red-500">Lỗi: Không có dữ liệu khách sạn để chỉnh sửa.</div>;
                return (
                    <HotelForm
                        isEdit={true}
                        initialData={selectedHotel}
                        isLoading={isLoading}
                        onSubmit={handleSubmitForm}
                        onCancel={handleCancel}
                        onError={handleFormError}
                    />
                );
            case 'detail':
                if (!selectedHotel) return <div className="p-4 text-red-500">Lỗi: Không có dữ liệu khách sạn để xem chi tiết.</div>;
                return (
                    <HotelDetail
                        hotel={selectedHotel}
                        onEdit={handleEdit}
                        onBack={handleCancel}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-['Inter']">


            <main className="max-w-6xl mx-auto">
                {/* Hiển thị lỗi từ API hoặc form ở đây */}
                {error && (
                    <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                        <p className="font-bold">Lỗi Thao Tác:</p>
                        <p className="mt-1 whitespace-pre-wrap">{error}</p>
                    </div>
                )}

                {renderView()}
            </main>

            {/* Render Modal */}
            {modal && (
                <AlertModal
                    title={modal.title}
                    message={modal.message}
                    isConfirm={modal.isConfirm}
                    onConfirm={modal.onConfirm}
                    onClose={() => setModal(null)}
                    isSuccess={modal.isSuccess}
                />
            )}
        </div>
    );
}