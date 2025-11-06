'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { Send, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchChatHistory, sendMessage, ChatMessage, SendMessagePayload } from '@/service/chat/chatService';

let socket: ReturnType<typeof io> | null = null;

export default function ChatBox() {
    const { user, isAuthenticated } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // ------------------- Socket realtime -------------------
    useEffect(() => {
        if (!isAuthenticated || !user) {
            setMessages([]);
            setOpen(false);
            socket?.disconnect();
            socket = null;
            return;
        }

        if (!socket) socket = io('http://localhost:3636', { transports: ['websocket', 'polling'] });
        socket.emit('join', { user_id: user.id });

        const handleNewMessage = (msg: ChatMessage) => {
            if (!msg) return;
            if (msg.sender?.id === user.id || msg.receiver?.id === user.id) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket?.off('newMessage', handleNewMessage);
        };
    }, [isAuthenticated, user]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (open && user && isAuthenticated) {
            (async () => {
                try {
                    const history = await fetchChatHistory(user.id);
                    setMessages(history);
                } catch (err) {
                    console.error(err);
                }
            })();
        }
    }, [open, user, isAuthenticated]);

    const handleSendMessage = async () => {
        if (!input.trim() || !user || !socket) return;

        const payload: SendMessagePayload = {
            senderId: user.id,
            receiverId: 1,
            message: input,
            message_type: 'text',
        };

        try {
            await sendMessage(payload);
            setInput('');
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

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!open ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(true)}
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
                        <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                            <span className="font-semibold">Bluvera Support</span>
                            <button onClick={() => setOpen(false)} className="hover:bg-blue-500 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10 text-sm">
                                    {user ? 'Bắt đầu cuộc trò chuyện với đội ngũ hỗ trợ 💬' : 'Vui lòng đăng nhập 💬'}
                                </div>
                            ) : (
                                messages.map((m, idx) => (
                                    <div key={idx} className={`mb-2 flex ${m.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-2 px-3 rounded-2xl text-sm ${m.sender?.id === user?.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}`}>
                                            {m.message}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {user && (
                            <div className="p-2 border-t flex items-center gap-2 bg-white">
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
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
