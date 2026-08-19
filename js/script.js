// with the exception of one of Identity, Email, or FBID
// each of the following fields is optional

if (ServiceWorker in navigator) {
    navigator.serviceWorker
        .register("./clevertap_sw.js")
        .then(function (registration) {
            console.log("Service Worker Registered");
            console.log(registration);
        })
        .catch(function (error) {
            console.log("Service Worker Registration Failed");
            console.log(error);
        });
}

function openLoginModal() {
    const modal = document.getElementById("loginModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.getElementById("loginIdentity").focus();
}

function closeLoginModal() {
    const modal = document.getElementById("loginModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

function addPropertyRow(containerId) {
    const container = document.getElementById(containerId);
    const row = document.createElement("div");
    row.className = "flex gap-2 items-center";
    row.innerHTML = `
        <input type="text" placeholder="Key" class="flex h-9 w-1/2 rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
        <input type="text" placeholder="Value" class="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
        <button onclick="this.parentElement.remove()" class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-destructive/10 transition-colors">
            <svg class="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>`;
    container.appendChild(row);
    row.querySelector("input").focus();
}

function collectPropertiesFromContainer(containerId) {
    const props = {};
    document.querySelectorAll(`#${containerId} > div`).forEach((row) => {
        const [keyInput, valInput] = row.querySelectorAll("input");
        const key = keyInput.value.trim();
        const val = valInput.value.trim();
        if (key && val) props[key] = val;
    });
    return props;
}

function addLoginProperty() {
    addPropertyRow("loginExtraProps");
}

function onLogin() {
    const identity = document.getElementById("loginIdentity").value.trim();
    if (!identity) {
        document.getElementById("loginIdentity").focus();
        return;
    }

    const profile = { Identity: identity };
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const phone = document.getElementById("loginPhone").value.trim();
    if (name) profile.Name = name;
    if (email) profile.Email = email;
    if (phone) profile.Phone = phone;

    Object.assign(profile, collectPropertiesFromContainer("loginExtraProps"));

    // clevertap.getLocation();
    clevertap.onUserLogin.push({ Site: profile });
    clevertap.event.push("User Login", {
        Identity: identity,
        Name: name,
        Email: email,
        Phone: phone,
    });
    console.log("User logged in", profile);
    closeLoginModal();
}

function openEventModal() {
    const modal = document.getElementById("eventModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.getElementById("eventName").focus();
}

function closeEventModal() {
    const modal = document.getElementById("eventModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

function addEventProperty() {
    addPropertyRow("eventExtraProps");
}

function onPushEvent() {
    const eventName = document.getElementById("eventName").value.trim();
    if (!eventName) {
        document.getElementById("eventName").focus();
        return;
    }

    const eventProps = collectPropertiesFromContainer("eventExtraProps");
    if (Object.keys(eventProps).length) {
        clevertap.event.push(eventName, eventProps);
    } else {
        clevertap.event.push(eventName);
    }
    console.log("Event pushed", eventName, eventProps);
    closeEventModal();
}

// function onProfilePush() {
//   document
//     .getElementById("profilepush")
//     .addEventListener("click", function (event) {
//       clevertap.profile.push({
//         Identity: "112233",
//         Email: "hhaaayyy@clevertap.com",
//       });
//       console.log("Profile push executed");
//     });
// }

function viewProduct() {
    document.getElementById("btn1").addEventListener("click", function (event) {
        alert("button clicked!");
        clevertap.event.push("Product Viewed", {
            "Product name": "Casio Chronograph Watch",
            Category: "Mens Accessories",
            Price: 59.99,
            Date: new Date(),
            createdAt: "$D_1785486540",
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
            okButtonColor: "#F28046",
            askAgainTimeInSeconds: 5,
            serviceWorkerPath: "./clevertap_sw.js", // path to your custom service worker file
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

function newPopup() {
    document.getElementById("btn7").addEventListener("click", function (event) {
        clevertap.notifications.push({
            titleText: "Would you like to receive Push Notifications?",
            bodyText:
                "We promise to only send you relevant content and give you updates on your transactions",
            okButtonText: "Sign me up!",
            rejectButtonText: "No thanks",
            okButtonColor: "#F28046",
            askAgainTimeInSeconds: 5,
        });
        console.log("New popup button clicked");
    });
}

function onCustomPopup() {
    document.getElementById("btn7").addEventListener("click", function (event) {
        alert("Article button clicked");
        clevertap.event.push("Article Click");
    });
}

function onDeepLinkPopup() {
    document
        .getElementById("deeplinkpopup")
        .addEventListener("click", function (event) {
            console.log("Deep link button clicked");
            clevertap.event.push("Order Placed", {
                Type: "Deep LinkTest",
            });
        });
}

function onMultiValueEvent() {
    document
        .getElementById("multi-value-event")
        .addEventListener("click", function (event) {
            clevertap.event.push("Collection Viewed", {
                Platform: "android",
                "Collection Handle": "rareism-eoss",
                "Collection ID": "293491048519",
                "Collection Page name": "RAREISM EOSS",
                "Collection Title": "RAREISM EOSS",
                "Collection URL":
                    "https://thehouseofrare.com/collections/rareism-eoss",
                Vendor_Source: "APP",
                Category: [
                    "TOP",
                    "DRESS",
                    "TROUSER",
                    "T-SHIRT",
                    "SHIRT",
                    "JEANS",
                    "SKIRT",
                    "POLO",
                    "SHORTS",
                    "TRACK PANT",
                    "SHRUG",
                    "BELT",
                    "SWEATER",
                    "SWEAT TEE",
                    "OUTER WEAR",
                    "INNERWEAR",
                    "BAG",
                    "WAIST COAT",
                    "BLAZER",
                    "PLAYSUIT",
                ],
                Fabric: [
                    "COTTON",
                    "POLYESTER",
                    "COTTON BLEND",
                    "POLYESTER BLEND",
                    "VISCOSE BLEND",
                    "VISCOSE",
                    "SATIN",
                    "LINEN",
                    "LINEN BLEND",
                    "MODAL",
                    "100% LINEN",
                    "LEATHER",
                    "NYLON BLEND",
                    "POPLIN",
                    "VELVET",
                    "MODAL BLEND",
                    "RAYON BLEND",
                    "ACRYLIC BLEND",
                    "WAKANDA",
                    "RAYON",
                ],
                Color: [
                    "BLACK",
                    "MULTI",
                    "BLUE",
                    "PINK",
                    "GREEN",
                    "BEIGE",
                    "OFF WHITE",
                    "WHITE",
                    "BROWN",
                    "NAVY",
                    "PURPLE",
                    "YELLOW",
                    "OLIVE",
                    "MAROON",
                    "RED",
                    "GREY",
                    "ORANGE",
                    "RUST",
                    "MUSTARD",
                    "PEACH",
                ],
                CLOSURE: [
                    "PULL-ON",
                    "BUTTON",
                    "ZIPPER",
                    "TIE-UP",
                    "DRAWSTRING",
                    "HOOK",
                    "BUTTON AND ZIP",
                    "SHANK AND ZIPPER",
                    "ELASTIC",
                    "BUCKLE",
                    "CROP",
                    "WRAP",
                    "Zipper",
                ],
                COLLAR: [
                    "CREW NECK",
                    "V-NECK",
                    "SPREAD COLLAR",
                    "MANDARIN COLLAR",
                    "DROP COLLAR",
                    "TIE-UP",
                    "HIGH NECK",
                    "BOAT NECK",
                    "JOHNNY COLLAR",
                    "SHOULDER STRAP",
                    "COWL NECK",
                    "OVERLAP",
                    "LAPEL NECK",
                    "HALTER NECK",
                    "COLLARLESS",
                    "TUBE NECK",
                    "BAND COLLAR",
                    "RUFFLED NECK",
                    "ONE SHOULDER",
                    "SWEETHEART NECK",
                ],
                FIT: [
                    "REGULAR",
                    "RELAXED",
                    "FIT AND FLARE",
                    "FLARED",
                    "A-LINE",
                    "STRAIGHT",
                    "WIDE LEG",
                    "BOXY",
                    "TAILORED",
                    "OVERSIZED",
                    "FITTED",
                    "TAPERED",
                    "SLIM",
                    "TALL STRAIGHT",
                    "CLASSIC BOOTCUT",
                    "SLEEK SKINNY",
                    "BOOTCUT",
                    "SCULPT HIGH WIDE",
                    "BODYCON",
                    "WRAP",
                ],
                OCCASION: [
                    "CASUAL",
                    "BRUNCH",
                    "FORMAL",
                    "EVENING",
                    "RESORT",
                    "PARTY",
                    "BUSINESS",
                    "DESK TO DINNER",
                    "SUMMER",
                    "WINTER",
                    "FESTIVE",
                    "EVERYDAY",
                    "WORKWEAR",
                    "ETHNIC",
                    "SEMI FORMAL",
                    "TRAVEL",
                    "BASICS",
                    "CORE",
                ],
                PATTERN: [
                    "PLAIN",
                    "FLORAL PRINT",
                    "ABSTRACT PRINT",
                    "GEOMETRIC PRINT",
                    "GRAPHIC PRINT",
                    "PRINTED",
                    "STRIPED",
                    "PAISLEY PRINT",
                    "POLKA PRINT",
                    "TYPOGRAPHY PRINT",
                    "EMBROIDERED",
                    "SEQUINED",
                    "MONOGRAM PRINT",
                    "SCHIFFILI",
                    "JACQUARD",
                    "OMBRE",
                    "TROPICAL PRINT",
                    "FLANNEL PRINT",
                    "DYED",
                    "CHECKED",
                ],
                SLEEVE: [
                    "FULL SLEEVE",
                    "HALF SLEEVE",
                    "SLEEVELESS",
                    "3/4TH SLEEVE",
                ],
                "Login Status": "Logged In",
                "Vendor name": "RARERABBIT",
                "Customer Type": "Repeat",
            });
        });
}

function onExit() {
    document.getElementById("btn6").addEventListener("click", function (event) {
        console.log("Exit button clicked");
    });
}

function onScratchCard() {
    document
        .getElementById("scratchcard")
        .addEventListener("click", function (event) {
            console.log("Scratch card button clicked");
            alert("Scratch card button clicked");
            clevertap.event.push("Scratch Card");
        });
}

function onStories() {
    document
        .getElementById("stories")
        .addEventListener("click", function (event) {
            console.log("Stories button clicked");
            clevertap.event.push("Stories Event");
        });
}

function onBFSale() {
    document
        .getElementById("bfsale")
        .addEventListener("click", function (event) {
            console.log("Black Friday Sale button clicked");
            clevertap.event.push("Black Friday Sale");
        });
}

function onnativeBanner() {
    document.getElementById("btn3").addEventListener("click", function (event) {
        console.log("Native button clicked");
        // Push the event that will trigger the native display
        clevertap.event.push("Native Event", {});
        // document.dispatchEvent(testEvent);
    });
}

function getCTid() {
    document.getElementById("ctid").addEventListener("click", function (event) {
        console.log("Clevertap ID: " + clevertap.getCleverTapID());
    });
}

function clearCache() {
    document
        .getElementById("clear")
        .addEventListener("click", function (event) {
            console.log("Clearing cache");
            localStorage.clear();
        });
}

function onSurveyForm() {
    document
        .getElementById("surveyform")
        .addEventListener("click", function (event) {
            console.log("Survey Form button clicked");
            clevertap.event.push("Survey Form Event");
        });
}

function onInstallApp() {
    document
        .getElementById("installapp")
        .addEventListener("click", function (event) {
            console.log("Install App button clicked");
            clevertap.event.push("inapp_action");
        });
}

function onTestPopup() {
    document
        .getElementById("testpopup")
        .addEventListener("click", function (event) {
            console.log("Test Popup button clicked");
            clevertap.event.push("React Web Test");
        });
}

function onLoginViaPopup() {
    document
        .getElementById("loginviapopup")
        .addEventListener("click", function (event) {
            console.log("Login via Popup button clicked");
            clevertap.event.push("User Login", {});
        });
}

// Initialize the image carousel functionality for CleverTap native display
function initImageCarousel() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const carouselContainer = document.querySelector(".carousel-container");

    if (prevBtn && nextBtn && carouselContainer) {
        // Scroll left on previous button click
        prevBtn.addEventListener("click", () => {
            carouselContainer.scrollBy({ left: -300, behavior: "smooth" });
        });

        // Scroll right on next button click
        nextBtn.addEventListener("click", () => {
            carouselContainer.scrollBy({ left: 300, behavior: "smooth" });
        });
    }
}

// Function to handle CleverTap Native Display data for the image carousel
function handleCarouselNativeDisplay(data) {
    const carouselContainer = document.querySelector(".carousel-container");
    const carouselSection = document.querySelector(".carousel-section");

    if (!carouselContainer || !data || !data.kv) {
        console.error("Missing carousel container or data");
        // Hide the carousel section if no data and if it exists
        if (carouselSection) {
            carouselSection.classList.remove("show");
        }
        return;
    }

    // Fire notification viewed event
    if (
        typeof clevertap !== "undefined" &&
        clevertap.renderNotificationViewed
    ) {
        clevertap.renderNotificationViewed(data);
    }

    // Clear existing content
    carouselContainer.innerHTML = "";

    // Check if we have image data in the custom key-value pairs
    const images = [];

    // Check if we have unnumbered keys first
    if (data.kv.image) {
        images.push({
            imageUrl: data.kv.image,
            title: data.kv.title || "Default Title",
            link: data.kv.link || "#",
        });
    }

    // Then check for numbered keys (image1, image2, etc.)
    for (let i = 1; i <= 5; i++) {
        // Support up to 5 images
        const imageKey = `image${i}`;
        const titleKey = `title${i}`;
        const linkKey = `link${i}`;

        if (data.kv[imageKey]) {
            images.push({
                imageUrl: data.kv[imageKey],
                title: data.kv[titleKey] || `Product ${i}`,
                link: data.kv[linkKey] || "#",
            });
        }
    }

    // Only show the carousel section if we have images
    if (images.length > 0) {
        // Only try to show the carousel section if it exists
        if (carouselSection) {
            carouselSection.classList.add("show");
        }

        // Simple image file extension check
        const imageRegex = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;

        // Create carousel items for each item
        images.forEach((item, index) => {
            const carouselItem = document.createElement("div");
            carouselItem.className = "carousel-item";

            const isImage = imageRegex.test(item.imageUrl);

            if (isImage) {
                // If it's an image URL, show it as an image
                carouselItem.innerHTML = `
          <a href="${item.link}" target="_blank">
            <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
            <div class="carousel-caption">${item.title}</div>
          </a>
        `;
            } else {
                // If it's not an image URL (like an article URL), show a card instead
                carouselItem.innerHTML = `
          <a href="${
              item.link || item.imageUrl
          }" target="_blank" style="display:block;height:200px;padding:15px;text-decoration:none;color:inherit;background:#f6f7fb;border-radius:8px;">
            <div style="text-align:center;">
              <h3 style="font-size:16px;margin:0 0 10px 0;">${item.title}</h3>
              <p style="margin:0;color:#555;font-size:13px;overflow:hidden;text-overflow:ellipsis;">${item.imageUrl.substring(
                  0,
                  80,
              )}...</p>
            </div>
          </a>
        `;
            }

            carouselContainer.appendChild(carouselItem);
        });

        // Initialize carousel controls
        initImageCarousel();
    }
}

// Listen for CleverTap native display events
document.addEventListener("CT_web_native_display", function (event) {
    console.log("CT_web_native_display event received:", event.detail);

    // Debug: Show exactly what keys and values are in the payload
    if (event.detail && event.detail.kv) {
        console.log("Native display keys:", Object.keys(event.detail.kv));
        console.log("Looking for topic:", event.detail.kv.topic);
        // console.log("Looking for displayType:", event.detail.kv.displayType);
    }

    if (event.detail && event.detail.kv) {
        // Check if this is for our carousel by looking for either displayType or topic
        if (
            event.detail.kv.displayType === "imageCarousel" ||
            event.detail.kv.topic === "blueprint"
        ) {
            handleCarouselNativeDisplay(event.detail);
        } else {
            console.log(
                "No match for imageCarousel in either displayType or topic",
            );
        }
    }
});

// Initialize the carousel on page load
document.addEventListener("DOMContentLoaded", function () {
    initImageCarousel();
});

function onBottomBanner() {
    document
        .getElementById("bottombanner")
        .addEventListener("click", function (event) {
            console.log("Bottom Banner button clicked");
            clevertap.event.push("Bottom Banner");
        });
}

function nativeDisplayOverride() {
    document
        .getElementById("nativeDisplayOverride")
        .addEventListener("click", function (event) {
            console.log("Native Display Override button clicked");
            clevertap.event.push("TestCT1WProps");
        });
}

function onTopBanner() {
    document
        .getElementById("topbanner")
        .addEventListener("click", function (event) {
            console.log("Top Banner button clicked");
            clevertap.event.push("Top Banner");
        });
}

function onProductExperiences() {
    document
        .getElementById("productexperiences")
        .addEventListener("click", function (event) {
            window.location.href = "./ProductExperiences/pePaymentPage.html";
        });
}

function onMcaffeinePE() {
    document
        .getElementById("mcaffeinePE")
        .addEventListener("click", function (event) {
            window.location.href = "./ProductExperiences/Mcaffeine/index.html";
        });
}
