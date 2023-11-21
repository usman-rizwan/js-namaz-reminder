// Register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then((res) => console.log("Service worker registered"))
            .catch((err) => console.log("Service worker not registered", err));

        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted");
                // sendNotification('Namaz Reminder', 'Welcome! You will now receive Namaz reminders.');
            } else {
                console.log("Notification permission denied");
            }
        });
    });
}

// Display current time
let timer = document.getElementById("showTime");
let namazAfter = document.getElementById("namazAfter");

function displayTime() {
    timer.innerHTML = `<h3 class="cl-g"> ${moment().format("LTS")} </h3> <h5> ${moment().format("Do MMM YYYY")} </h5>`;
}

setInterval(displayTime, 1000);
let fajr = "05:25:00";
let zuhr = "12:17:00";
let asr = "16:07:00";
let maghrib = "17:43:00";
let isha = "19:02:00";

function showPrayers() {
    const newTime = moment().format("HH:mm:ss");
    if (newTime >= fajr && newTime < zuhr) {
        namazAfter.innerHTML = `Next Prayer Will Be Zuhr At <br/>  <h3 class="cl-g">${zuhr} pm </h3>`;
    } else if (newTime >= zuhr && newTime < asr) {
        namazAfter.innerHTML = `Next Prayer Will Be Asr At <br/>  <h3 class="cl-g">${asr} pm </h3>`;
    } else if (newTime >= asr && newTime < maghrib) {
        namazAfter.innerHTML = `Next Prayer Will Be Asr At <br/>  <h3 class="cl-g">${maghrib} pm </h3>`;
    } else if (newTime >= maghrib && newTime < isha) {
        namazAfter.innerHTML = `Next Prayer Will Be Isha At <br/>  <h3 class="cl-g">${isha} pm </h3>`;
    } else  {
        namazAfter.innerHTML = `Next Prayer Will Be Fajr At <br/> <h3 class="cl-g">${fajr} am </h3> `;
    }
}

setInterval(showPrayers, 1000);
function checkAndSendNotification() {
    const currentTime = moment().format("HH:mm:ss");

    if (currentTime == fajr) {
        sendNotification("Fajr");
    } else if (currentTime == zuhr) {
        sendNotification("Zuhur");
    } else if (currentTime == asr) {
        sendNotification("Asr");
    } else if (currentTime == maghrib) {
        sendNotification("Maghrib");
    } else if (currentTime == isha) {
        // console.log("isha ready hai");
        sendNotification("Isha");
    }
}


function sendNotification(prayer) {
    // Check if the browser supports notifications
    if ("Notification" in window) {
        // Request notification permission
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                // Create a notification
                const notification = new Notification("Namaz Reminder", {
                    body: `It\'s time for your ${prayer} Namaz.`,
                    icon: "/images/icon.png",
                });
            }
        });
    }
}

setInterval(checkAndSendNotification, 1000);
