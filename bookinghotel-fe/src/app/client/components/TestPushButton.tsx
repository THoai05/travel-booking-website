// src/components/TestPushButton.tsx
'use client'

import React, { useEffect, useState } from 'react';

const VAPID_PUBLIC_KEY = 'BK7X28zynXeAOZiLDh54f43Tk6N0odvv9GLQYQD-cZI2VYutxDPHhrZIkTlSchfhcp-WJUuE_pxIvVVhaA3BgAA';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export const TestPushButton: React.FC = () => {
    const [swReg, setSwReg] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('SW registered', reg);
                    setSwReg(reg);
                })
                .catch(err => console.error('SW registration failed:', err));
        }
    }, []);

    const handleSubscribe = async () => {
        if (!swReg) return alert('Service Worker chưa sẵn sàng');

        try {
            const subscription = await swReg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            console.log('Subscription object:', subscription);

            // gửi subscription lên backend
            await fetch('http://localhost:3636/push-web/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 1, subscription }),
            });

            alert('Đăng ký push thành công!');
        } catch (err) {
            console.error('Subscription failed:', err);
            alert('Đăng ký push thất bại');
        }
    };

    const handleSendTest = async () => {
        try {
            await fetch('http://localhost:3636/push-web/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    title: 'Test Notification',
                    message: 'Đây là thông báo thử nghiệm!',
                    url: '/',
                }),
            });

            alert('Notification gửi thành công!');
        } catch (err) {
            console.error('Send test failed:', err);
            alert('Gửi notification thất bại');
        }
    };

    return (
        <div>
            <button onClick={handleSubscribe} style={{ marginRight: 10 }}>Subscribe Push</button>
            <button onClick={handleSendTest}>Send Test Notification</button>
        </div>
    );
};
