'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { Send, X } from 'lucide-react';

interface User {
    id: number;
    username: string;
}

interface ChatMessage {
    id: number;
    sender: User | null;
    receiver: User | null;
    message: string;
    message_type: 'text' | 'image' | 'file';
    is_read: boolean;
    created_at: string;
}

let socket: ReturnType<typeof io> | null = null;

interface ChatBoxProps {
    userId: number | null; // null khi logout
}

export default function ChatBox({ userId }: ChatBoxProps) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // 🔹 Kết nối socket & lắng nghe realtime
    useEffect(() => {
        if (!userId) return;

        if (!socket) {
            socket = io('http://localhost:3636', {
                transports: ['websocket', 'polling'],
            });
        }

        socket.emit('join', { user_id: userId });

        socket.on('newMessage', (msg: ChatMessage) => {
            if (!msg || !msg.sender || !msg.receiver) return;
            if (msg.sender.id === userId || msg.receiver.id === userId) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        // 🔹 Load lịch sử chat
        const loadHistory = async () => {
            try {
                const res = await fetch(`http://localhost:3636/chat/${userId}/1`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMessages(data);
                }
            } catch (err) {
                console.error('❌ Load chat history error:', err);
            }
        };
        loadHistory();

        return () => {
            socket?.off('newMessage');
        };
    }, [userId]);

    // 🔹 Khi logout: reset messages + thu nhỏ chatbox
    useEffect(() => {
        if (!userId) {
            setMessages([]);
            setOpen(false);
        }
    }, [userId]);

    // 🔹 Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !socket || !userId) return;

        socket.emit('send', {
            senderId: userId,
            receiverId: 1, // admin cố định
            message: input,
            message_type: 'text',
        });

        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!open ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => userId && setOpen(true)}
                    className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold"
                >
                    💬
                </motion.button>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="w-80 h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                            <span className="font-semibold">Bluvera Support</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="hover:bg-blue-500 p-1 rounded-md"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10 text-sm">
                                    {userId
                                        ? 'Bắt đầu cuộc trò chuyện với đội ngũ hỗ trợ 💬'
                                        : 'Vui lòng đăng nhập để trò chuyện 💬'}
                                </div>
                            ) : (
                                messages.map((m, index) => (
                                    <div
                                        key={index}
                                        className={`mb-2 flex ${m.sender?.id === userId ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[70%] p-2 px-3 rounded-2xl text-sm ${m.sender?.id === userId
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                                }`}
                                        >
                                            {m.message}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        {userId && (
                            <div className="p-2 border-t flex items-center gap-2 bg-white">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 bg-gray-100 px-3 py-2 rounded-full outline-none text-sm"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
