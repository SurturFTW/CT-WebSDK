// with the exception of one of Identity, Email, or FBID
// each of the following fields is optional

if (ServiceWorker in navigator) {
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

function onLogin() {
  document.getElementById("login").addEventListener("click", function (event) {
    // Get date from frontend input
    const subscriptionExpiryDateInput = document.getElementById(
      "subscriptionExpiryDate"
    );
    const expiryDate = subscriptionExpiryDateInput
      ? new Date(subscriptionExpiryDateInput.value)
      : null;

    clevertap.onUserLogin.push({
      Site: {
        Name: "Push Test", // String
        Identity: 22222, // String or number
        Email: "pushtest@gmail.com", // Email address of the user
        Phone: "+56765676567", // Phone (with the country code),
        Gender: "M", // Can be either M or F
        DOB: new Date(), // Date of Birth. Date object

        SubscriptionExpiryDate: expiryDate,

        // optional fields. controls whether the user will be sent email, push etc.
        "MSG-email": false, // Disable email notifications
        "MSG-push": true, // Enable push notifications
        "MSG-sms": true, // Enable sms notifications
        "MSG-whatsapp": true, // Enable WhatsApp notifications
      },
    });
    console.log("User logged in");
    console.log("Test DateTime: ", subscriptionExpiryDateInput.value);
    // alert(clevertap.getClevertapID());
  });
}

/* clevertap.profile.push({
  Site: {
    "Customer Type": "Silver",
    "Prefered Language": "English",
  },
}); */

function viewProduct() {
  document.getElementById("btn1").addEventListener("click", function (event) {
    alert("button clicked!");
    clevertap.event.push("Product Viewed", {
      "Product name": "Casio Chronograph Watch",
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
  });
}

function onWebPush() {
  document.getElementById("btn4").addEventListener("click", function (event) {
    alert("Clicked web push button");
    clevertap.event.push("Web-push Event");
  });
}

function onPopup() {
  document.getElementById("btn5").addEventListener("click", function (event) {
    alert("Web popup button clicked");
    clevertap.event.push("Web-Popup Event");
  });
}

function onExit() {
  document.getElementById("btn6").addEventListener("click", function (event) {
    console.log("Exit button clicked");
  });
}

function onnativeBanner() {
  document.getElementById("btn3").addEventListener("click", function (event) {
    console.log("Native button clicked");
    clevertap.event.push("Native Event");
  });
}

function getCTid() {
  document.getElementById("ctid").addEventListener("click", function (event) {
    console.log("Clevertap ID: " + clevertap.getCleverTapID());
  });
}

function clearCache() {
  document.getElementById("clear").addEventListener("click", function (event) {
    console.log("Clearing cache");
    localStorage.clear();
  });
}
