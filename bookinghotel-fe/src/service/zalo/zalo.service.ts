import io, { Socket } from 'socket.io-client';

const BASE_URL = 'http://localhost:3636';

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

    onNewMessage(callback: (msg: any) => void) {
        if (!socket) return;
        socket.on('newMessage', callback);
    },

    sendMessage(messageData: {
        sender_id: number;
        receiver_id: number;
        message: string;
        type: 'text' | 'image' | 'file';
    }) {
        socket?.emit('sendMessage', messageData);
    },

    onTyping(callback: (data: any) => void) {
        socket?.on('typing', callback);
    },

    emitTyping(data: { sender_id: number; receiver_id: number; isTyping: boolean }) {
        socket?.emit('typing', data);
    },
};
