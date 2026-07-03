// mCaffeine / Hyphen — Product Experiences demo
// Defines PE variable groups, fetches/renders their values, and lets the
// presenter switch the logged-in identity live to show personalization + the
// PE A/B test (configured on the "Spotlight" variable group in the dashboard).

const LAST_IDENTITY_KEY = "pe_demo_last_identity";
const LAST_PROFILE_KEY = "pe_demo_last_profile";

const Ecomm_Variables = {
    Ecomm_Hero: {
        hero_headline: "Wake Up Your Skin. Caffeine-Charged Care.",
        hero_subheadline: "India's #1 Caffeine Skincare & Bodycare Brand",
        hero_cta_text: "Shop Bestsellers",
        hero_banner_image:
            "https://placehold.co/1400x600/3B2417/F5E6D3?text=mCaffeine",
    },
    Ecomm_Offer: {
        offer_badge_text: "FLAT 20% OFF",
        offer_headline: "Get Your Glow On",
        discount_code: "GLOW20",
        discount_percentage: 20,
    },
    Ecomm_Spotlight: {
        spotlight_product_name: "Coffee Body Wash",
        spotlight_product_tagline: "Deep Cleanse. Zero Dryness.",
        spotlight_price: 399,
        spotlight_cta_text: "Add to Cart",
        spotlight_image:
            "https://placehold.co/560x560/6B4226/FFFFFF?text=Coffee+Body+Wash",
    },
    Ecomm_Personalization: {
        welcome_message: "Welcome to mCaffeine!",
    },
};

const PRESETS = {
    new_visitor: {
        label: "New Visitor",
        profile: {
            Identity: "guest_new_001",
            Name: "New Visitor",
            "Customer Tier": "New",
            "Visit Count": 1,
        },
    },
    returning_customer: {
        label: "Returning Customer",
        profile: {
            Identity: "returning_customer_014",
            Name: "Pushkar Sane",
            Email: "pushkar.sane@example.com",
            "Customer Tier": "Returning",
            "Visit Count": 4,
        },
    },
    vip_shopper: {
        label: "VIP Shopper",
        profile: {
            Identity: "vip_shopper_057",
            Name: "Priya Pachisia",
            Email: "priya.pachisia@example.com",
            "Customer Tier": "VIP",
            "Lifetime Orders": 12,
        },
    },
};

function waitForCleverTap(callback) {
    if (
        typeof clevertap !== "undefined" &&
        typeof clevertap.defineVariable === "function"
    ) {
        callback();
        return;
    }
    setTimeout(() => waitForCleverTap(callback), 100);
}

function defineAllVariables() {
    clevertap.setLogLevel(4);
    clevertap.defineVariable("Ecomm_Variables", Ecomm_Variables);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.textContent = value;
}

function setSrc(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.src = value;
}

function renderPage() {
    const hero =
        clevertap.getVariableValue("Ecomm_Hero") || Ecomm_Variables.Ecomm_Hero;
    const offer =
        clevertap.getVariableValue("Ecomm_Offer") ||
        Ecomm_Variables.Ecomm_Offer;
    const spotlight =
        clevertap.getVariableValue("Ecomm_Spotlight") ||
        Ecomm_Variables.Ecomm_Spotlight;
    const personalization =
        clevertap.getVariableValue("Ecomm_Personalization") ||
        Ecomm_Variables.Ecomm_Personalization;

    setText("heroHeadline", hero.hero_headline);
    setText("heroSubheadline", hero.hero_subheadline);
    setText("heroCtaText", hero.hero_cta_text);
    setSrc("heroBannerImage", hero.hero_banner_image);

    setText("offerBadgeText", offer.offer_badge_text);
    setText("offerHeadline", offer.offer_headline);
    setText("discountCode", offer.discount_code);
    setText("discountPercentage", offer.discount_percentage);

    setText("spotlightProductName", spotlight.spotlight_product_name);
    setText("spotlightTagline", spotlight.spotlight_product_tagline);
    setText("spotlightPrice", spotlight.spotlight_price);
    setText("spotlightCtaText", spotlight.spotlight_cta_text);
    setSrc("spotlightImage", spotlight.spotlight_image);

    setText("welcomeMessage", personalization.welcome_message);

    const debugOutput = document.getElementById("debugOutput");
    if (debugOutput) {
        debugOutput.textContent = JSON.stringify(
            {
                Hero: hero,
                Offer: offer,
                Spotlight: spotlight,
                Personalization: personalization,
            },
            null,
            2,
        );
    }

    const fetchedAt = document.getElementById("debugFetchedAt");
    if (fetchedAt) fetchedAt.textContent = new Date().toLocaleTimeString();
}

function refreshVariables() {
    clevertap.fetchVariables(
        () => {
            console.log("PE variables fetched");
            renderPage();
        },
        (error) => {
            console.log("PE variable fetch failed, using defaults", error);
            renderPage();
        },
    );
}

function syncVariables() {
    clevertap.syncVariables();
}

function updateCurrentUserBanner() {
    const identity = localStorage.getItem(LAST_IDENTITY_KEY);
    const banner = document.getElementById("currentUserBanner");
    if (banner)
        banner.textContent = identity
            ? `Viewing as: ${identity}`
            : "Viewing as: Guest";
}

function openSwitchUserModal() {
    document.getElementById("switchUserModal").classList.remove("hidden");
    document.getElementById("switchUserModal").classList.add("flex");
    document.getElementById("switchIdentity").focus();
}

function closeSwitchUserModal() {
    document.getElementById("switchUserModal").classList.add("hidden");
    document.getElementById("switchUserModal").classList.remove("flex");
}

function addSwitchUserProperty() {
    const container = document.getElementById("switchUserExtraProps");
    const row = document.createElement("div");
    row.className = "flex gap-2 items-center";
    row.innerHTML = `
        <input type="text" placeholder="Key" class="pe-input flex-1" />
        <input type="text" placeholder="Value" class="pe-input flex-1" />
        <button onclick="this.parentElement.remove()" class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-red-100 transition-colors">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>`;
    container.appendChild(row);
    row.querySelector("input").focus();
}

function fillPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    document.getElementById("switchIdentity").value =
        preset.profile.Identity || "";
    document.getElementById("switchName").value = preset.profile.Name || "";
    document.getElementById("switchEmail").value = preset.profile.Email || "";

    document.getElementById("switchUserExtraProps").innerHTML = "";
    Object.entries(preset.profile).forEach(([key, value]) => {
        if (["Identity", "Name", "Email"].includes(key)) return;
        addSwitchUserProperty();
        const rows = document.querySelectorAll("#switchUserExtraProps > div");
        const lastRow = rows[rows.length - 1];
        const [keyInput, valInput] = lastRow.querySelectorAll("input");
        keyInput.value = key;
        valInput.value = value;
    });
}

function switchUser() {
    const identity = document.getElementById("switchIdentity").value.trim();
    if (!identity) {
        document.getElementById("switchIdentity").focus();
        return;
    }

    const profile = { Identity: identity };
    const name = document.getElementById("switchName").value.trim();
    const email = document.getElementById("switchEmail").value.trim();
    if (name) profile.Name = name;
    if (email) profile.Email = email;

    document.querySelectorAll("#switchUserExtraProps > div").forEach((row) => {
        const [keyInput, valInput] = row.querySelectorAll("input");
        const key = keyInput.value.trim();
        const val = valInput.value.trim();
        if (key && val) profile[key] = val;
    });

    clevertap.onUserLogin.push({ Site: profile });
    localStorage.setItem(LAST_IDENTITY_KEY, identity);
    localStorage.setItem(LAST_PROFILE_KEY, JSON.stringify(profile));
    console.log("Switched user to", profile);

    // Reload so the new profile's device/session is fully established before
    // the next fetchVariables() call — keeps A/B bucketing/personalization accurate.
    window.location.reload();
}

function resetToGuest() {
    // localStorage.removeItem(LAST_IDENTITY_KEY);
    // localStorage.removeItem(LAST_PROFILE_KEY);
    // localStorage.clear(); // Never uncomment this.
    window.location.reload();
}

function trackEvent(eventName, props) {
    clevertap.event.push(eventName, props || {});
    console.log("Event tracked:", eventName, props);
}

function initPEDemo() {
    waitForCleverTap(() => {
        clevertap.setLogLevel(4);
        defineAllVariables();
        // syncVariables(); // only to sync variables with the dashboard.
        updateCurrentUserBanner();
        renderPage();
        refreshVariables();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPEDemo);
} else {
    initPEDemo();
}
