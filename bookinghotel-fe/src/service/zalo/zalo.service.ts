import io, { Socket } from 'socket.io-client';

const BASE_URL = 'http://localhost:3636';

export type ZaloMessageType = 'text' | 'image' | 'file' | 'booking' | 'notification';

export interface User {
    id: number;
    name?: string;
    avatar?: string;
}
export interface ZaloMessage {
    id?: string | number;
    sender_id: number;
    receiver_id: number;
    message: string;
    type: ZaloMessageType;
    file_url?: string;
    booking_id?: number;
    notification_id?: number;
    createdAt?: string;
    sender?: User

    // Booking details
    check_in_date?: string;
    check_out_date?: string;
    guest_count?: number;
    contact_full_name?: string;
    contact_email?: string;
    contact_phone?: string;
    total_price?: number;
    special_requests?: string;

    // Notification details
    title?: string;
}

let socket: ReturnType<typeof io> | null = null;

export const ZaloChatService = {
    connect(userId: number) {
        if (!socket) {
            socket = io(BASE_URL, { transports: ['websocket', 'polling'] });
            socket.emit('joinRoom', { userId });
        }
    },

    disconnect() {
        socket?.disconnect();
        socket = null;
    },

    onNewMessage(callback: (msg: ZaloMessage) => void) {
        if (!socket) return;
        socket.on('newMessage', callback);
    },

    sendMessage(messageData: {
        sender_id: number;
        receiver_id: number;
        message: string;
        type: ZaloMessageType; // chỉ gửi các loại user tạo ra
        file_url?: string;
    }) {
        socket?.emit('sendMessage', messageData);
    },

    onTyping(callback: (data: any) => void) {
        if (!socket) return;
        socket.on('typing', callback);
    },

    emitTyping(data: { sender_id: number; receiver_id: number; isTyping: boolean }) {
        socket?.emit('typing', data);
    },

    fetchChatHistory: async (userId: number, adminId: number): Promise<ZaloMessage[]> => {
        const res = await fetch(`${BASE_URL}/zalo/${userId}/${adminId}`);
        if (!res.ok) throw new Error('Failed to fetch chat history');
        const data: ZaloMessage[] = await res.json();

        return data.map(msg => ({
            ...msg,
            file_url: msg.file_url ?? undefined,
            title: msg.type === 'notification' ? msg.title ?? undefined : undefined,
            check_in_date: msg.type === 'booking' ? msg.check_in_date ?? undefined : undefined,
            check_out_date: msg.type === 'booking' ? msg.check_out_date ?? undefined : undefined,
            guest_count: msg.type === 'booking' ? msg.guest_count ?? undefined : undefined,
            contact_full_name: msg.type === 'booking' ? msg.contact_full_name ?? undefined : undefined,
            contact_email: msg.type === 'booking' ? msg.contact_email ?? undefined : undefined,
            contact_phone: msg.type === 'booking' ? msg.contact_phone ?? undefined : undefined,
            total_price: msg.type === 'booking' ? msg.total_price ?? undefined : undefined,
            special_requests: msg.type === 'booking' ? msg.special_requests ?? undefined : undefined,
        }));
    },
};
