'use client'
import { useEffect } from "react";
import api from "@/axios/axios";

function urlBase64ToUint8Array(base64: string) {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = window.atob(base64Safe);
    return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function useWebPush(userId: number | null) {
    useEffect(() => {
        if (!userId) return;

        const registerPush = async () => {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();

            if (!sub) {
                const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidKey),
                });
            }

            await api.post("/push-web/subscribe", {
                userId,
                subscription: sub,
            });

            console.log("Web push subscribed!");
        };

        registerPush();
    }, [userId]);
}
