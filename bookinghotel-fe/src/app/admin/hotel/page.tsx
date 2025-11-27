// HotelAdminApp.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useHotelManager } from './hooks/useHotelManager'; // Import custom hook
import { HotelList } from './components/HotelList';
import { HotelForm } from './components/HotelForm';
import { HotelDetail } from './components/HotelDetail';
import { AlertModal } from './components/AlertModal';

export default function HotelAdminApp() {
    // 1. Logic API & Data (Lấy từ Hook)
    const { 
        hotels, pagination, isLoading, error, setError, 
        fetchHotels, createHotel, updateHotel, removeHotel 
    } = useHotelManager();

    console.log(hotels)

    // 2. Logic View (UI State)
    const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'detail'
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [modal, setModal] = useState(null); // Modal thông báo

    // Load data lần đầu
    useEffect(() => {
        fetchHotels(1);
    }, [fetchHotels]);

    // --- Handlers ---
    const handleSave = async (dto) => {
        let res;
        if (view === 'create') {
            res = await createHotel(dto);
        } else {
            res = await updateHotel(selectedHotel.id, dto);
        }

        if (res.success) {
            setModal({ 
                type: 'success', 
                title: 'Thành công', 
                message: res.message,
                onClose: () => { setModal(null); setView('list'); } 
            });
        }
    };

    const confirmDelete = (id) => {
        setModal({
            type: 'confirm',
            title: 'Xác nhận xóa',
            message: `Bạn có chắc muốn xóa khách sạn #${id}?`,
            onConfirm: async () => {
                const res = await removeHotel(id);
                setModal(res.success 
                    ? { type: 'success', title: 'Đã xóa', message: 'Xóa thành công!', onClose: () => setModal(null) }
                    : null // Nếu lỗi thì hook đã set error rồi
                );
            },
            onClose: () => setModal(null)
        });
    };

    // --- Render View Switcher ---
    const renderContent = () => {
        switch (view) {
            case 'create':
                return <HotelForm isLoading={isLoading} onSubmit={handleSave} onCancel={() => setView('list')} />;
            case 'edit':
                return <HotelForm isEdit initialData={selectedHotel} isLoading={isLoading} onSubmit={handleSave} onCancel={() => setView('list')} />;
            case 'detail':
                return <HotelDetail hotel={selectedHotel} onBack={() => setView('list')} onEdit={() => setView('edit')} />;
            default:
                return (
                    <HotelList 
                        data={hotels} 
                        pagination={pagination} 
                        isLoading={isLoading}
                        onPageChange={fetchHotels}
                        onCreate={() => { setSelectedHotel(null); setView('create'); }}
                        onEdit={(h) => { setSelectedHotel(h); setView('edit'); }}
                        onDetail={(h) => { setSelectedHotel(h); setView('detail'); }}
                        onRemove={(id) => confirmDelete(id)}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto">
                {/* Global Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm flex justify-between items-center">
                        <div><strong className="font-bold">Lỗi:</strong> {error}</div>
                        <button onClick={() => setError(null)} className="text-red-700 font-bold">✕</button>
                    </div>
                )}

                {renderContent()}
            </div>

            {/* Global Modal */}
            {modal && (
                <AlertModal 
                    {...modal}
                    isSuccess={modal.type === 'success'}
                    isConfirm={modal.type === 'confirm'}
                />
            )}
        </div>
    );
}