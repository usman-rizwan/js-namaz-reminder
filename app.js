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
let islamicDate;

function displayTime() {
  timer.innerHTML = `<h3 class="cl-g clock text-center"> ${moment().format(
    "LTS"
  )} </h3> <h5 > ${moment().format("Do MMM YYYY")} ${
    islamicDate && `<span class="cl-g">(${islamicDate})</span>`
  } </h5>`;
}

let latestDate = new Date();
let latestMonth = latestDate.getMonth() + 1;
let latestYear = latestDate.getFullYear();

let fajr, zuhr, asr, maghrib, isha;
let fajrTime = document.getElementById("fajrTime");
let zuhrTime = document.getElementById("zuhrTime");
let asrTime = document.getElementById("asrTime");
let maghribTime = document.getElementById("maghribTime");
let ishaTime = document.getElementById("ishaTime");

async function namazTime() {
  try {
    let api = `https://api.aladhan.com/v1/calendarByAddress/${latestYear}/${latestMonth}?address=karachi&method=2`;
    let data = await fetch(api);
    let response = await data.json();
    // console.log("dataa", response);

    let todayNamaz = response.data.find(
      (todayData) => todayData.date.readable === moment().format("DD MMM YYYY")
    );
    let { date } = todayNamaz;
    let { hijri } = date;
    console.log(hijri);

    islamicDate = `${hijri.day}-${hijri.month.en}-${hijri.year}`;
    // console.log(islamicDate);

    // console.log("todayNamaz", todayNamaz[0]?.timings?.Fajr);

    if (todayNamaz) {
      fajr = todayNamaz?.timings?.Fajr;
      zuhr = todayNamaz?.timings?.Dhuhr;
      asr = todayNamaz?.timings?.Asr;
      maghrib = todayNamaz?.timings?.Maghrib;
      isha = todayNamaz?.timings?.Isha;

      // Updating Time HTML
      fajrTime.innerHTML = moment(fajr, "HH:mm (PKT)").format("hh:mm A");
      zuhrTime.innerHTML = moment(zuhr, "HH:mm (PKT)").format("hh:mm A");
      asrTime.innerHTML = moment(asr, "HH:mm (PKT)").format("hh:mm A");
      maghribTime.innerHTML = moment(maghrib, "HH:mm (PKT)").format("hh:mm A");
      ishaTime.innerHTML = moment(isha, "HH:mm (PKT)").format("hh:mm A");
      showPrayers();
    }
  } catch (error) {
    console.error("Error fetching namaz time data:", error);
  }
}

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
      fajr,
      "HH:mm:ss"
    ).format("hh:mm A")}  </h3> `;
  }
}

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

window.onload = function () {
  let currentDate = moment().format("DD MMM YYYY");
  namazTime();

  setInterval(() => {
    let newDate = moment().format("DD MMM YYYY");
    console.log(newDate);
    if (currentDate != newDate) {
      namazTime();
      currentDate = newDate;
      // console.log("current date", currentDate);
    }
  }, 600000);

  setInterval(checkAndSendNotification, 1000);
  setInterval(displayTime, 1000);
};
