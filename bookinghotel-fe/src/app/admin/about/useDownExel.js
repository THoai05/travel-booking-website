"use client";

import { useState } from 'react';

// BASE URL của Backend NestJS 
const API_BASE_URL = 'http://localhost:3636/api';

/**
 * Hook tùy chỉnh để xử lý việc gọi API và tải file tự động.
 * Hook này quản lý trạng thái tải xuống và lỗi.
 */
export function useDownloader() {
    // 1. State để theo dõi trạng thái tải xuống
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    /**
     * Thực hiện gọi API BE và kích hoạt tải xuống file.
     * @param {string} endpoint - Ví dụ: /bookings/export/excel
     * @param {string} filename - Tên file tải về (ví dụ: chi_tiet_dat_phong.xlsx)
     * @param {string} mimeType - MIME Type của file (ví dụ: application/pdf)
     */
    const downloadFile = async (endpoint, filename) => {
        setIsDownloading(true);
        setDownloadError(null);

        try {
            const fullUrl = `${API_BASE_URL}${endpoint}`;

            // Dùng fetch để tải file từ BE
            const response = await fetch(fullUrl, { method: 'GET' });

            if (!response.ok) {
                // Đọc lỗi từ body (nếu BE trả về lỗi 500, ví dụ: lỗi DB)
                const errorText = await response.text();
                throw new Error(`Lỗi Server (${response.status}): ${errorText.substring(0, 100)}...`);
            }

            // 2. Lấy Blob (Binary Large Object) của file
            const blob = await response.blob();

            // 3. Tạo URL tạm thời và kích hoạt tải xuống (Client-side)
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();

            // 4. Dọn dẹp
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Lỗi tải file:", error);
            setDownloadError(error.message || "Lỗi mạng hoặc client không xác định.");
        } finally {
            setIsDownloading(false);
        }
    };

    // Trả về hàm và trạng thái để Component sử dụng
    return { downloadFile, isDownloading, downloadError };
}
