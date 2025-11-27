self.addEventListener("push", function (event) {
    if (!event.data) return;

    const data = event.data.json();

    const title = data.title || "Thông báo mới";
    const message = data.message || "";
    const url = data.url || "/";

    event.waitUntil(
        self.registration.showNotification(title, {
            body: message,
            icon: "/icons/icon-192.png",
            badge: "/icons/badge.png",
            data: { url },
        })
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const url = event.notification.data.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === url && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
