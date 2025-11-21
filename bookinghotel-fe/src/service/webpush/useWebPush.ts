// hooks/useWebPush.ts
import { useEffect } from "react";

export default function useWebPush(userId?: number) {
    useEffect(() => {
        if (!userId) return; // chỉ chạy khi user đã login

        async function registerPush() {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

            try {
                const sw = await navigator.serviceWorker.register("/sw.js");

                const subscription = await sw.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                        "BNFtbUrK1TkBAiehTvi_kmtycIqRuH4NdvYIApYGGZr6JoN36n8zhJUN6DwtO97DHXHfVyv-U73eV2cbN-KuCXE",
                });

                // Gửi subscription lên backend
                await fetch("http://localhost:3000/push-web/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, subscription }),
                });

                console.log("Web Push subscription registered!");
            } catch (error) {
                console.error("Web Push registration failed:", error);
            }
        }

        registerPush();
    }, [userId]);
}
