// components/AlertModal.jsx

import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

/** Component Modal thông báo và xác nhận tùy chỉnh. */
export const AlertModal = ({ title, message, onClose, onConfirm, isConfirm = false, isSuccess = false }) => {
    const Icon = isSuccess ? CheckCircle : AlertTriangle;
    const iconColor = isSuccess ? 'text-green-600' : 'text-yellow-600';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <Icon className={`w-5 h-5 mr-2 ${iconColor}`} />
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="mt-4 text-gray-600 whitespace-pre-wrap">{message}</p>
                <div className="mt-6 flex justify-end space-x-3">
                    {isConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
                        >
                            Xác nhận
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 ${isConfirm ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'} font-semibold rounded-lg shadow-md transition`}
                    >
                        {isConfirm ? 'Hủy' : 'Đóng'}
                    </button>
                </div>
            </div>
        </div>
    );
};