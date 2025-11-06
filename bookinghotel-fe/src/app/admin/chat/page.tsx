'use client';

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Send } from 'lucide-react';
import { fetchClients, fetchAdminChatHistory, sendMessage, ChatMessage, SendMessagePayload } from '@/service/chat/chatService';

interface Client {
    id: number;
    username: string;
    unread: number;
}

let socket: ReturnType<typeof io> | null = null;

export default function AdminChatPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [activeClient, setActiveClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<{ [clientId: number]: ChatMessage[] }>({});
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // ------------------- Socket -------------------
    useEffect(() => {
        if (!socket) {
            socket = io('http://localhost:3636', { transports: ['websocket', 'polling'] });
        }

        socket.emit('join', { user_id: 1, isAdmin: true });

        const handleNewMessage = (msg: ChatMessage) => {
            const clientId = msg.sender?.id === 1 ? msg.receiver?.id : msg.sender?.id;
            if (!clientId) return;

            setMessages(prev => ({
                ...prev,
                [clientId]: [...(prev[clientId] || []), msg],
            }));

            setClients(prev => prev.map(c =>
                c.id === clientId
                    ? { ...c, unread: activeClient?.id === clientId ? 0 : (c.unread + 1) }
                    : c
            ));
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket?.off('newMessage', handleNewMessage);
        };
    }, []); // chỉ chạy 1 lần

    // ------------------- Fetch client list -------------------
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchClients();
                setClients(data);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // ------------------- Fetch chat history khi chọn client -------------------
    useEffect(() => {
        if (!activeClient) return;
        (async () => {
            try {
                const history = await fetchAdminChatHistory(activeClient.id);
                setMessages(prev => ({ ...prev, [activeClient.id]: history }));

                // reset unread khi mở chat
                setClients(prev => prev.map(c => c.id === activeClient.id ? { ...c, unread: 0 } : c));
            } catch (err) {
                console.error(err);
            }
        })();
    }, [activeClient]);

    // ------------------- Scroll auto -------------------
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeClient]);

    // ------------------- Gửi tin nhắn -------------------
    const handleSendMessage = async () => {
        if (!activeClient || !input.trim()) return;

        const payload: SendMessagePayload = {
            senderId: 1,
            receiverId: activeClient.id,
            message: input,
            message_type: 'text',
        };

        try {
            const newMsg = await sendMessage(payload); // lưu DB
            socket?.emit('sendMessage', newMsg);      // emit lên server
            setInput('');                              // reset input
        } catch (err) {
            console.error(err);
        }
    };


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // ------------------- UI -------------------
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-gray-200 bg-gray-50 p-2 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Clients</h2>
                <ul>
                    {clients.map(c => (
                        <li
                            key={c.id}
                            onClick={() => setActiveClient(c)}
                            className={`p-2 rounded-md cursor-pointer hover:bg-gray-200 ${activeClient?.id === c.id ? 'bg-blue-100' : ''}`}
                        >
                            {c.username}
                            {c.unread > 0 && (
                                <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2">{c.unread}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="p-3 border-b flex justify-between items-center bg-blue-600 text-white flex-shrink-0">
                    <span>{activeClient ? activeClient.username : 'Chọn client để chat'}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                    {activeClient ? (
                        messages[activeClient.id]?.length ? (
                            messages[activeClient.id].map((m, idx) => (
                                <div key={idx} className={`mb-2 flex ${m.sender?.id === 1 ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-2 px-3 rounded-2xl text-sm ${m.sender?.id === 1 ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}`}>
                                        {m.message}
                                    </div>
                                </div>
                            ))
                        ) : <div className="text-gray-500 text-sm text-center mt-10">Chưa có tin nhắn</div>
                    ) : <div className="text-gray-500 text-sm text-center mt-10">Chọn client để chat</div>}
                    <div ref={chatEndRef} />
                </div>

                {activeClient && (
                    <div className="p-2 border-t flex items-center gap-2 flex-shrink-0">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 bg-gray-100 px-3 py-2 rounded-full outline-none text-sm"
                        />
                        <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                            <Send size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
