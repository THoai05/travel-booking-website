'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Image } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ZaloChatService, ZaloMessage } from '@/service/zalo/zaloService';

export interface User {
    id: number;
    name?: string;
    avatar?: string;
}

interface Props {
    user: User;
}

export default function ZaloChatPopup({ user }: Props) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ZaloMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;


        // Kết nối socket
        ZaloChatService.connect(user.id);

        // Nhận tin nhắn mới realtime
        const handleMessage = (msg: ZaloMessage) => setMessages(prev => [...prev, msg]);
        const handleNoti = (noti: ZaloMessage) => {
            if (!noti.id || !noti.message) return; // bỏ qua object trống
            setMessages(prev => {
                const exists = prev.some(m => m.id === noti.id);
                if (exists) return prev;
                return [...prev, noti];
            });
        };

        ZaloChatService.onNewMessage(handleMessage);
        ZaloChatService.onNewNotification(handleNoti);
        // Fetch lịch sử chat
        const fetchHistory = async () => {
            const history = await ZaloChatService.fetchChatHistory(user.id, 1);
            const filtered = history.filter(msg => !(msg.type === 'notification' && (!msg.title && !msg.message)));
            setMessages(filtered);
        };

        fetchHistory();

        // Cleanup khi unmount
        return () => {
            ZaloChatService.offNewMessage(handleMessage); // cần thêm hàm này trong service
            ZaloChatService.offNewNotification(handleNoti);
            ZaloChatService.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (!open || !user) return;

        const markRead = async () => {
            try {
                await fetch(`http://localhost:3636/notifications/mark-notifications-read/${user.id}`, {
                    method: 'PATCH',
                });
                console.log('Notifications marked as read');
            } catch (err) {
                console.error(err);
            }
        };

        markRead();
    }, [open, user]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (type: 'text' | 'image' | 'file' = 'text', fileUrl?: string) => {
        if (!input.trim() && type === 'text') return;

        // Chỉ gửi các loại text/image/file
        if (!['text', 'image', 'file'].includes(type)) return;

        const msg: ZaloMessage = {
            sender_id: user.id,
            receiver_id: 1,
            message: type === 'text' ? input : fileUrl || '',
            type,
            sender: user,
            file_url: fileUrl || undefined,
            status: 'sent'
        };

        ZaloChatService.sendMessage({
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            message: msg.message,
            type: msg.type as 'text' | 'image' | 'file',
            file_url: msg.file_url,
        });

        setInput('');
        setShowEmoji(false);
    };

    const handleTyping = (status: boolean) => {
        ZaloChatService.emitTyping({
            sender_id: user.id,
            receiver_id: 1,
            isTyping: status,
        });
    };

    const handleEmojiSelect = (emojiData: EmojiClickData) => {
        setInput((prev) => prev + emojiData.emoji);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('sender_id', String(user.id));
        formData.append('receiver_id', '1'); // admin ID

        try {
            await fetch('http://localhost:3636/zalo/send-image', {
                method: 'POST',
                body: formData,
            });
            // Tin nhắn sẽ được socket phát về tự động
        } catch (err) {
            console.error('Upload image failed', err);
        }
    };

    return (
        <div className="fixed bottom-20 right-6 sm:bottom-4 sm:right-4 z-51">
            {!open ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(true)}
                    className="w-16 h-16 bg-[#0084FF] rounded-full overflow-hidden shadow-lg flex items-center justify-center"
                    style={{ bottom: '30px', right: '20px' }}
                >
                    <img
                        src="/images/zalo-logo.png"
                        alt="Zalo"
                        className="w-22 h-22 object-contain"
                    />
                </motion.button>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="w-96 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#0084FF] text-white p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <img src="/images/logo.png" alt="admin" className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="font-semibold text-sm">Admin</p>
                                    {isTyping && <p className="text-xs italic text-gray-200 animate-pulse">Đang nhập...</p>}
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="hover:bg-blue-500 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                            {messages.map((m, i) => {
                                if (m.type === 'notification') {
                                    return (
                                        <div key={i} className="flex justify-center mb-3">
                                            <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-3 max-w-[80%] shadow-sm flex flex-col gap-1">
                                                <div className="flex items-center gap-2 font-semibold text-yellow-900">
                                                    <span>🎉</span> {m.title || 'Thông báo'}
                                                </div>
                                                <div className="text-yellow-800 text-sm">{m.message}</div>
                                                <div className="text-xs text-yellow-700 text-right italic">
                                                    {new Date(m.createdAt || '').toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                if (m.type === 'booking') {
                                    return (
                                        <div key={i} className="flex justify-center mb-3">
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 max-w-[85%] shadow-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-semibold text-blue-800">Booking #{m.booking_id}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full 
                                                        ${m.message?.includes('expired') ? 'bg-red-200 text-red-800' :
                                                            m.message?.includes('confirmed') ? 'bg-green-200 text-green-800' :
                                                                'bg-gray-200 text-gray-800'}`}>
                                                        {m.message}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-blue-900 flex flex-col gap-1">
                                                    {m.check_in_date && <div><strong>Check-in:</strong> {m.check_in_date}</div>}
                                                    {m.check_out_date && <div><strong>Check-out:</strong> {m.check_out_date}</div>}
                                                    {m.guest_count !== undefined && <div><strong>Guests:</strong> {m.guest_count}</div>}
                                                    {m.contact_full_name && <div><strong>Name:</strong> {m.contact_full_name}</div>}
                                                    {m.contact_email && <div><strong>Email:</strong> {m.contact_email}</div>}
                                                    {m.contact_phone && <div><strong>Phone:</strong> {m.contact_phone}</div>}
                                                    {m.total_price !== undefined && <div><strong>Total:</strong> ${m.total_price}</div>}
                                                    {m.special_requests && <div><strong>Requests:</strong> {m.special_requests}</div>}
                                                </div>
                                                <div className="text-xs text-blue-600 text-right mt-1 italic">
                                                    {new Date(m.createdAt || '').toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                // Tin nhắn text / image / file
                                return (
                                    <div key={i} className={`flex items-end mb-2 ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                        {m.sender_id !== user.id && (
                                            <img src="/avatar.png" alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                                        )}

                                        <div className={`max-w-[70%] p-2 px-3 rounded-2xl text-sm break-words
                                            ${m.sender_id === user.id ? 'bg-[#0084FF] text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}`}>
                                            {m.type === 'text' ? m.message : m.file_url ? (
                                                <img src={`http://localhost:3636${m.file_url}`} alt="img" className="max-w-full rounded-md" />
                                            ) : null}
                                        </div>

                                        {m.sender_id === user.id && (
                                            <img src="/avatar.png" alt="avatar" className="w-6 h-6 rounded-full ml-2" />
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-2 border-t flex items-center gap-2 bg-white shadow-inner relative">
                            {showEmoji && (
                                <div className="absolute bottom-12 left-2 z-50">
                                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                                </div>
                            )}

                            <button
                                onClick={() => setShowEmoji((prev) => !prev)}
                                className="p-1 rounded-full hover:bg-gray-200"
                            >
                                😊
                            </button>

                            <input
                                value={input}
                                onChange={(e) => { setInput(e.target.value); handleTyping(true); }}
                                onBlur={() => handleTyping(false)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 bg-gray-100 px-3 py-2 rounded-full outline-none text-sm"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-1 rounded-full hover:bg-gray-200"
                            >
                                <Image size={16} />
                            </button>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

                            <button
                                onClick={() => handleSend()}
                                className="bg-[#0084FF] hover:bg-[#0071E3] text-white p-2 rounded-full"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
