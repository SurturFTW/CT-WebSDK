// importScripts('https://s3-eu-west-1.amazonaws.com/static.wizrocket.com/js/sw_webpush.js');// remove CleverTap server worker from your root folder

document.getElementById("btn1").addEventListener("click", function (event) {
    console.log("Button clicked.");
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    clevertap.onUserLogin.push({
        "Site": {
            "Name": name,                      // String
            "Identity": phone,
            "Email": email,                    // Email address of the user
            "Phone": `+91${phone}`,            // Phone (with the country code)

            "MSG-email": false,                // Disable email notifications
            "MSG-push": true,                  // Enable push notifications
            "MSG-sms": true,                   // Enable sms notifications
            "MSG-whatsapp": true,     
        }
    });

    clevertap.profile.push({
        "Site": {
            "Prefered Language": "English"
        }
    });
    alert("User Added and profile updated")
});




/*
function onLogin() {
    document.getElementById("btn1").addEventListener("click", function (event) {
    alert("Login Button clicked.");
    event.preventDefault();
    console.log('----inside login----')
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;

    console.log({ name, email, phone })
  
    clevertap.onUserLogin.push({
        "Site": {
            "Name": name,                     // use the Name variable
            "Email": email,                   // Email address of the user
            "Identity": phone,
            "Phone": `+91${phone}`,           // Phone (with the country code
            "DOB": new Date(),                 // Date of Birth. Date object 
      
            "MSG-email": false,                // Disable email notifications
            "MSG-push": true,                  // Enable push notifications
            "MSG-sms": true,                   // Enable sms notifications
            "MSG-whatsapp": true,  
        }});
    }
)}

function onPush(){
    document.getElementById("btn2").addEventListener("click", function (event) {
    console.log("Button clicked.");
    alert("On-Push Button clicked.");
    event.preventDefault();

    console.log('-----inside push-----')
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;

    console.log({name, email, phone})
    clevertap.profile.push({
        "site":{
            "Name": name,
            "Email": email,
            "Identity": phone,
            "Phone": `+91${phone}`,
            "DOB": new Date()
        }
    })
    });
}

function subscribe(){
    document.getElementById("btn3").addEventListener("click", function (event) {
    console.log("Button clicked.");
    event.preventDefault();

    console.log("clicked subscribe button!");
    clevertap.notifications.push({
        "titleText": 'Would you like to receive Push Notifications?',
        "bodyText": 'We promise to only send you relevant content and give you updates on your transactions',
        "okButtonText": 'Sign me up!',
        "rejectButtonText": 'No thanks',
        "okButtonColor": '#f28046'
    });
})} */