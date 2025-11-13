'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Image } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ZaloChatService } from '@/service/zalo/zalo.service';

export interface User {
    id: number;
    name?: string;
    avatar?: string;
}

export interface Message {
    sender_id: number;
    receiver_id: number;
    message: string;
    type: 'text' | 'image' | 'file';
    file_url?: string | null;
    sender?: User;
}

interface Props {
    user: User;
}

export default function ZaloChatPopup({ user }: Props) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;

        ZaloChatService.connect(user.id);

        ZaloChatService.onNewMessage((msg: Message) => {
            console.log('Tin nhắn nhận được:', msg);
            setMessages(prev => [...prev, msg]);
        });


        ZaloChatService.onTyping((data: any) => {
            if (data.receiver_id === user.id) setIsTyping(data.isTyping);
        });

        return () => ZaloChatService.disconnect();
    }, [user]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (type: 'text' | 'image' | 'file' = 'text', fileUrl?: string) => {
        if (!input.trim() && type === 'text') return;

        const msg: Message = {
            sender_id: user.id,
            receiver_id: 1,
            message: type === 'text' ? input : fileUrl || '',
            type,
            sender: user,
            file_url: fileUrl || null,
        };

        ZaloChatService.sendMessage(msg);
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

            // ❌ Không setMessages ở đây nữa
            // Tin nhắn sẽ được Socket phát về tự động và add vào
        } catch (err) {
            console.error('Upload image failed', err);
        }
    };

    return (
        <div className="fixed z-60 bottom-20 right-6 sm:bottom-4 sm:right-4 z-50">
            {!open ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(true)}
                    className="w-16 h-16 bg-[#0084FF] rounded-full overflow-hidden shadow-lg flex items-center justify-center"
                    style={{ bottom: '30px', right: '20px' }}
                >
                    <img
                        src="/images/zalo-logo.png" // đường dẫn đến hình Zalo trong folder public
                        alt="Zalo"
                        className="w-22 h-22 object-contain" // chỉnh kích thước phù hợp
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
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex items-end mb-2 ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    {m.sender_id !== user.id && (
                                        <img
                                            src={m.sender?.avatar || '/avatar.png'}
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                    )}

                                    <div
                                        className={`max-w-[70%] p-2 px-3 rounded-2xl text-sm break-words ${m.sender_id === user.id
                                            ? 'bg-[#0084FF] text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                            }`}
                                    >
                                        {m.type === 'text' ? (
                                            m.message
                                        ) : m.file_url ? (
                                            <img
                                                src={`http://localhost:3636${m.file_url}`} // chỉ prepend BE cho ảnh gửi từ server
                                                alt="img"
                                                className="max-w-full rounded-md"
                                            />
                                        ) : null}




                                    </div>

                                    {m.sender_id === user.id && (
                                        <img
                                            src={m.sender?.avatar || '/avatar.png'}
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full ml-2"
                                        />
                                    )}
                                </div>
                            ))}
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
