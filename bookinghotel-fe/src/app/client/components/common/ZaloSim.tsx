// src/components/ZaloChatBox.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Send, X } from 'lucide-react'

interface Message {
    id: string
    senderId: number
    receiverId: number
    content: string
    createdAt: string
}

interface ZaloChatBoxProps {
    userId: number // current user
    receiverId?: number // optional, để demo chat với admin hoặc người khác
}

const socket = io('http://localhost:3000') // thay bằng server socket của bạn

const ZaloChatBox: React.FC<ZaloChatBoxProps> = ({ userId, receiverId = 0 }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        // kết nối socket và lắng nghe tin nhắn
        socket.on('receive_message', (msg: Message) => {
            if (msg.senderId === receiverId || msg.receiverId === receiverId) {
                setMessages(prev => [...prev, msg])
            }
        })

        // optional: join room theo userId để server gửi riêng
        socket.emit('join_room', userId)

        return () => {
            socket.off('receive_message')
        }
    }, [userId, receiverId])

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const message: Message = {
            id: `${Date.now()}`,
            senderId: userId,
            receiverId,
            content: newMessage,
            createdAt: new Date().toISOString(),
        }

        // gửi qua socket
        socket.emit('send_message', message)

        // thêm vào chat local luôn
        setMessages(prev => [...prev, message])
        setNewMessage('')
    }

    return (
        <>
            {/* Icon Zalo Floating */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-20 right-4 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg text-white text-2xl"
            >
                💬
            </button>

            {/* Chat Box */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-96 bg-white border shadow-lg rounded-lg flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 bg-blue-500 text-white rounded-t-lg">
                        <span>Zalo Chat</span>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`p-2 rounded-lg max-w-[70%] ${msg.senderId === userId ? 'bg-blue-100 ml-auto' : 'bg-gray-200'
                                    }`}
                            >
                                {msg.content}
                                <div className="text-xs text-gray-400 text-right mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-2 flex gap-2 border-t">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ZaloChatBox
