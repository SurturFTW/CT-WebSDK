// with the exception of one of Identity, Email, or FBID
// each of the following fields is optional

clevertap.onUserLogin.push({
  Site: {
    Name: "Jack Montana", // String
    Identity: 61026032, // String or number
    Email: "jack@gmail.com", // Email address of the user
    Phone: "+14155551234", // Phone (with the country code)
    Gender: "M", // Can be either M or F
    DOB: new Date(), // Date of Birth. Date object
    // optional fields. controls whether the user will be sent email, push etc.
    "MSG-email": false, // Disable email notifications
    "MSG-push": true, // Enable push notifications
    "MSG-sms": true, // Enable sms notifications
    "MSG-whatsapp": true, // Enable WhatsApp notifications
  },
});

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

clevertap.profile.push({
  Site: {
    "Customer Type": "Silver",
    "Prefered Language": "English",
  },
});

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
    clevertap.event.push("Web push registered.");
  });
}

function onPopup() {
  document.getElementById("btn5").addEventListener("click", function (event) {
    alert("Web popup button clicked");
    clevertap.event.push("Web Session Started");
  });
}
