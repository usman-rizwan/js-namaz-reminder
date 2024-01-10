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
  timer.innerHTML = `<h3 class="cl-g clock"> ${moment().format(
    "LTS"
  )} </h3> <h5 > ${moment().format("Do MMM YYYY")} </h5>`;
}

let latestDate = new Date();
let latestMonth = latestDate.getMonth() + 1;
let latestYear = latestDate.getFullYear();
// console.log("latestYear", latestMonth);

// async function namazTime() {
//   const api = `https://api.aladhan.com/v1/calendarByAddress/${latestYear}/${latestMonth}?address=karachi&method=2`;
//   let res = await fetch(api);
//   let data = await res.json();
//   console.log("data" , data);
//   return data
// }
// async function getDataFromNamazTime() {
//     const result = await namazTime();
//     console.log(result + "with api");
// }
// getDataFromNamazTime()
let date;
let fajr;
let zuhr;
let asr;
let maghrib;
let isha;
let fajrTime = document.getElementById("fajrTime");
let zuhrTime = document.getElementById("zuhrTime");
let asrTime = document.getElementById("asrTime");
let maghribTime = document.getElementById("maghribTime");
let ishaTime = document.getElementById("ishaTime");

async function namazTime() {
  try {
    let api = `https://api.aladhan.com/v1/calendarByAddress/${latestYear}/${latestMonth}?address=karachi&method=2`;
    let res = await fetch(api);
    let data = await res.json();

    let namazTimesByDate = {};

    data.data.forEach((dayData) => {
      date = dayData.date.readable;
      fajr = dayData.timings.Fajr;
      zuhr = dayData.timings.Dhuhr;
      asr = dayData.timings.Asr;
      maghrib = dayData.timings.Maghrib;
      isha = dayData.timings.Isha;

      
      namazTimesByDate[date] = { fajr, zuhr, asr, maghrib, isha };
    });
    fajrTime.innerHTML = `${moment(fajr, "HH:mm:ss").format("hh:mm A")}`;
    zuhrTime.innerHTML = `${moment(zuhr, "HH:mm:ss").format("hh:mm A")}`;
    asrTime.innerHTML = `${moment(asr, "HH:mm:ss").format("hh:mm A")}`;
    maghribTime.innerHTML = `${moment(maghrib, "HH:mm:ss").format("hh:mm A")}`;
    ishaTime.innerHTML = `${moment(isha, "HH:mm:ss").format("hh:mm A")}`;


    // console.log(
    //   "Namaz times for the first date:",
    //   namazTimesByDate[data.data[0].date.readable],
    //   " date ==>",
    //   date
    // );

  
    return namazTimesByDate;
  } catch (error) {
    console.error("Error fetching namaz time data:", error);
    
  }
}


setInterval(namazTime, 3000); 
setInterval(displayTime, 1000);
// let fajr = "05:25:00";
// let zuhr = "12:17:00";
// let asr = "16:07:00";
// let maghrib = "17:43:00";
// let isha = "19:02:00";

function showPrayers() {
  const newTime = moment().format("HH:mm:ss");

  if (newTime >= fajr && newTime < zuhr) {
    namazAfter.innerHTML = `Next Prayer Will Be  <span class="cl-g "> Zuhr </span> At  <h3 class="cl-g clock">${moment(
      zuhr,
      "HH:mm:ss"
    ).format("hh:mm A")} </h3>`;
  } else if (newTime >= zuhr && newTime < asr) {
    namazAfter.innerHTML = `Next Prayer Will Be <span class="cl-g "> Asr </span> At  <h3 class="cl-g clock">${moment(
      asr,
      "HH:mm:ss"
    ).format("hh:mm A")} </h3>`;
  } else if (newTime >= asr && newTime < maghrib) {
    namazAfter.innerHTML = `Next Prayer Will Be  <span class="cl-g "> Maghrib </span> At   <h3 class="cl-g clock">${moment(
      maghrib,
      "HH:mm:ss"
    ).format("hh:mm A")} </h3>`;
  } else if (newTime >= maghrib && newTime < isha) {
    namazAfter.innerHTML = `Next Prayer Will Be  <span class="cl-g "> Isha </span> At   <h3 class="cl-g clock">${moment(
      isha,
      "HH:mm:ss"
    ).format("hh:mm A")} </h3> `;
  } else {
    namazAfter.innerHTML = `Next Prayer Will Be <span class="cl-g "> Fajr </span> At <h3 class="cl-g clock"> ${moment(
      isha,
      "HH:mm:ss"
    ).format("hh:mm A")}  </h3> `;
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
        const notification = new Notification("Namaz Reminder", {
          body: `It\'s time for your ${prayer} Namaz.`,
          icon: "/images/icon.png",
        });
      }
    });
  }
}

setInterval(checkAndSendNotification, 1000);
