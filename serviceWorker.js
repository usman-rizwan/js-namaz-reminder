const namazNotifier = "namaz-reminder-site-v1"
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/images/icon.png",
    "/images/icon2.png",

]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(namazNotifier).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})

self.addEventListener("push", function (event) {
    const options = {
        body: event.data.text(),
        icon: "images/icon.png", // Adjust the path based on your file structure
        badge: "images/icon.png", // Adjust the path based on your file structure
    };

    event.waitUntil(
        self.registration.showNotification('Namaz Reminder', options)
    );
});