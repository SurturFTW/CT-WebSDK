// importScripts('https://s3-eu-west-1.amazonaws.com/static.wizrocket.com/js/sw_webpush.js');// remove CleverTap server worker from your root folder
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("clevertap_sw.js")
    .then(function (registration) {
      console.log("Service Worker Registered");
      console.log(registration);
    })
    .catch(function (error) {
      console.log("Service Worker Registration Failed");
      console.log(error);
    });
}

// Display CleverTap ID when available
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    if (clevertap && clevertap.getCleverTapID) {
      const ctId = clevertap.getCleverTapID();
      document.getElementById("ctId").innerText = ctId || "Not available";
    }
  }, 2000); // Wait for CleverTap to initialize
});

// Log events to UI
function logEvent(eventName, details) {
  const logElement = document.getElementById("eventLog");
  const timestamp = new Date().toLocaleTimeString();
  const logItem = document.createElement("div");
  logItem.className = "mb-2 pb-2 border-b border-gray-200";
  logItem.innerHTML = `<span class="text-blue-600">${timestamp}</span> - <span class="font-semibold">${eventName}</span>: ${
    details || ""
  }`;
  logElement.prepend(logItem);
}

// Override the original event handler to include logging
const originalPushEvent = clevertap.event.push;
clevertap.event.push = function (eventData) {
  const eventName = Object.keys(eventData)[0];
  logEvent(
    eventName,
    JSON.stringify(eventData[eventName]).substring(0, 50) + "..."
  );
  return originalPushEvent.apply(this, arguments);
};

function onLogin() {
  document.getElementById("login").addEventListener("click", function (event) {
    const identity =
      document.getElementById("userIdentity").value || "61026032";
    const name = document.getElementById("userName").value || "Jack Montana";
    const email =
      document.getElementById("userEmail").value || "jack@gmail.com";
    const phone = document.getElementById("userPhone").value || "+14155551234";

    clevertap.onUserLogin.push({
      Site: {
        Name: name,
        Identity: identity,
        Email: email,
        Phone: phone,
        Gender: "M",
        DOB: new Date(),
        "MSG-email": false,
        "MSG-push": true,
        "MSG-sms": true,
        "MSG-whatsapp": true,
      },
    });
    logEvent("User Login", `User: ${name}, Email: ${email}`);
  });
}

function viewProduct() {
  document.getElementById("btn1").addEventListener("click", function (event) {
    const product =
      document.getElementById("userProduct").value || "Casio Chronograph Watch";
    alert("button clicked!");
    clevertap.event.push("Product Viewed", {
      "Product name": product,
      Category: "Mens Accessories",
      Price: 59.99,
      Date: new Date(),
    });
  });
}

function onSubscribe() {
  document.getElementById("btn2").addEventListener("click", function (event) {
    alert("Clicked Subscribe");
    clevertap.notifications.push({
      titleText: "Would you like to receive Push Notifications?",
      bodyText:
        "We promise to only send you relevant content and give you updates on your transactions",
      okButtonText: "Sign me up!",
      rejectButtonText: "No thanks",
      okButtonColor: "#f28046",
    });
    logEvent("Subscribe Clicked", "Push notification permission requested");
  });
}

function onnativeBanner() {
  document.getElementById("btn3").addEventListener("click", function (event) {
    console.log("Native button clicked");
    clevertap.event.push("Native Event");
    logEvent("Native Banner Requested", "Triggering native display");
  });
}

function onWebPush() {
  document.getElementById("btn4").addEventListener("click", function (event) {
    alert("Clicked web push button");
    clevertap.event.push("Web-push Event");
    logEvent("Web Push Requested", "Triggering web push notification");
  });
}

function onExit() {
  document.getElementById("btn6").addEventListener("click", function (event) {
    console.log("Exit button clicked");
    logEvent("Exit Intent", "Exit intent triggered");
  });
}

function onPopup() {
  document.getElementById("btn5").addEventListener("click", function (event) {
    alert("Web popup button clicked");
    clevertap.event.push("Web-Popup Event");
    logEvent("Web Popup Requested", "Triggering web popup");
  });
}

function renderCartDropOffPersonalisationCampaign(data) {
  const name = data.kv.Name;
  const product = data.kv.Cart;
  const containerEl = document.getElementById("container");
  const userNameEl = containerEl.querySelector("#user-name");
  userNameEl.innerText = name;
  const productNameEl = containerEl.querySelector("#product-name");
  productNameEl.innerText = product;

  // Show the container
  containerEl.classList.remove("hidden");

  // Add close functionality
  containerEl.querySelector(".close").addEventListener("click", function () {
    containerEl.classList.add("hidden");
  });

  logEvent("Personalization Shown", `For user: ${name}, Product: ${product}`);
}

document.addEventListener("CT_web_native_display", function (event) {
  console.log(event);
  const data = event.detail;
  renderCartDropOffPersonalisationCampaign(data);
  logEvent(
    "Native Display Received",
    JSON.stringify(data.kv).substring(0, 50) + "..."
  );
});

// Initialize all event handlers when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  onLogin();
  viewProduct();
  onSubscribe();
  onnativeBanner();
  onWebPush();
  onExit();
  onPopup();
});
