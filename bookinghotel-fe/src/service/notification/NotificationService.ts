// src/services/NotificationService.ts
import api from '@/axios/axios'; // dùng đúng file axios của bạn

const NotificationService = {
    // ==========================
    // CLIENT
    // ==========================

    // Lấy danh sách thông báo theo userId
    getUserNotifications(userId: number) {
        return api.get(`/notifications/user/${userId}`);
    },

    // Đếm số thông báo chưa đọc của user
    getUnreadCount(userId: number) {
        return api.get(`/notifications/user/${userId}/unread-count`);
    },

    // Đánh dấu đã đọc
    markAsRead(notificationId: number) {
        return api.patch(`/notifications/${notificationId}/read`);
    },

    // Xóa thông báo
    deleteNotification(notificationId: number) {
        return api.delete(`/notifications/${notificationId}`);
    },

    // ==========================
    // ADMIN
    // ==========================

    // Lấy tất cả notifications
    getAllNotifications(page: number, limit: number) {
        return api.get(`/notifications?page=${page}&limit=${limit}`);
    },

    // Lấy chi tiết thông báo
    getNotificationDetail(notificationId: number) {
        return api.get(`/notifications/detail/${notificationId}`);
    },

    // Cập nhật thông báo
    updateNotification(notificationId: number, data: any) {
        return api.patch(`/notifications/${notificationId}`, data);
    },

    // Tạo thông báo mới
    createNotification(data: any) {
        return api.post(`/notifications`, data);
    },

    broadcastNotification(data: any) {
        return api.post("/notifications/broadcast", data);
    },
};

export default NotificationService;
