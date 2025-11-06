export interface User {
    id: number;
    username: string;
}

export interface ChatMessage {
    id: number;
    sender: User | null;
    receiver: User | null;
    message: string;
    message_type: 'text' | 'image' | 'file';
    is_read: boolean;
    created_at: string;
}

export interface SendMessagePayload {
    senderId: number;
    receiverId: number;
    message: string;
    message_type: 'text' | 'image' | 'file';
}
export interface Client {
    id: number;
    username: string;
    unread: number; // số tin nhắn chưa đọc
}

// ------------------- Fetch lịch sử chat -------------------
export const fetchChatHistory = async (
    userId: number,
    page: number = 1
): Promise<ChatMessage[]> => {
    const res = await fetch(`http://localhost:3636/chat/${userId}/${page}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // gửi cookie tự động
    });

    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};
// fetch chat admin với client
export const fetchAdminChatHistory = async (clientId: number): Promise<ChatMessage[]> => {
    const res = await fetch(`http://localhost:3636/chat/admin/${clientId}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // gửi cookie
    });

    if (!res.ok) throw new Error('Unauthorized hoặc lỗi server');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};


// ------------------- Gửi tin nhắn -------------------
export const sendMessage = async (
    payload: SendMessagePayload
): Promise<ChatMessage> => {
    const res = await fetch('http://localhost:3636/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Send message failed');
    const data = await res.json();
    return data;
};

// ------------------- Fetch danh sách client (dành cho admin) -------------------
export interface Client {
    id: number;
    username: string;
    unread: number; // số tin nhắn chưa đọc
}

export const fetchClients = async (): Promise<Client[]> => {
    try {
        const res = await fetch('http://localhost:3636/chat/admin/clients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // gửi cookie tự động
        });

        if (res.status === 401) {
            throw new Error('Unauthorized: bạn cần login admin hoặc token hết hạn');
        }

        if (!res.ok) {
            throw new Error(`Failed to fetch clients: ${res.statusText}`);
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('[fetchClients]', error);
        return [];
    }
};
