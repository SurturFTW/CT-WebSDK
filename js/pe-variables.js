// Wait for CleverTap to be ready
function initializeCleverTapVariables() {
  if (
    typeof clevertap === "undefined" ||
    typeof clevertap.defineVariable !== "function"
  ) {
    console.log("Waiting for CleverTap to load...");
    setTimeout(initializeCleverTapVariables, 100);
    return;
  }

  console.log("CleverTap loaded, initializing variables...");

  clevertap.setLogLevel(4); // Set log level to 4 for debugging

  // Define CleverTap variables organized by category
  clevertap.defineVariable("Banner", {
    banner_image_1: "",
    banner_image_2: "",
    banner_image_3: "",
  });

  clevertap.defineVariable("Header", {
    header_title: "Choose Your Premium Plan",
    header_subtitle:
      "Get unlimited access to premium articles, expert analysis, and exclusive insights",
  });

  clevertap.defineVariable("Pricing", {
    monthly_price: 299,
    annual_price: 2499,
    quarterly_price: 799,
  });

  clevertap.defineVariable("Discount", {
    annual_discount_text: "Save 30% (₹1,089)",
    quarterly_discount_text: "Save 11% (₹98)",
  });

  clevertap.defineVariable("Features", {
    premium_feature_1: "Unlimited premium articles",
    premium_feature_2: "Ad-free experience",
  });

  // Update page content with variable values
  function updatePageContent() {
    // Get variable values
    const bannerValue = clevertap.getVariableValue("Banner");
    const headerValue = clevertap.getVariableValue("Header");
    const pricingValue = clevertap.getVariableValue("Pricing");
    const discountValue = clevertap.getVariableValue("Discount");
    const featuresValue = clevertap.getVariableValue("Features");

    console.log("Variable values:", {
      bannerValue: bannerValue,
      header: headerValue,
      pricing: pricingValue,
      discount: discountValue,
      features: featuresValue,
    });

    // Update header
    const mainHeading = document.querySelector("h1.text-4xl");
    const subHeading = document.querySelector("p.text-lg.text-gray-600");

    if (mainHeading && headerValue) {
      mainHeading.textContent = headerValue.header_title;
    }
    if (subHeading && headerValue) {
      subHeading.textContent = headerValue.header_subtitle;
    }

    // Update pricing using IDs
    const monthlyPriceEl = document.getElementById("monthlyPrice");
    const annualPriceEl = document.getElementById("annualPrice");
    const quarterlyPriceEl = document.getElementById("quarterlyPrice");

    if (monthlyPriceEl && pricingValue) {
      monthlyPriceEl.textContent = `₹${pricingValue.monthly_price}`;
    }
    if (annualPriceEl && pricingValue) {
      annualPriceEl.textContent = `₹${pricingValue.annual_price}`;
    }
    if (quarterlyPriceEl && pricingValue) {
      quarterlyPriceEl.textContent = `₹${pricingValue.quarterly_price}`;
    }

    // Update discount texts using IDs
    const annualSavingsEl = document.getElementById("annualSavings");
    const quarterlySavingsEl = document.getElementById("quarterlySavings");

    if (annualSavingsEl && discountValue) {
      annualSavingsEl.textContent = discountValue.annual_discount_text;
    }
    if (quarterlySavingsEl && discountValue) {
      quarterlySavingsEl.textContent = discountValue.quarterly_discount_text;
    }

    // Update feature list items (first two features in each plan)
    const featureLists = document.querySelectorAll("ul.space-y-3");
    if (featureLists.length >= 1 && featuresValue) {
      const features = featureLists[0].querySelectorAll(
        "li span.text-gray-700"
      );
      if (features[0]) {
        features[0].textContent = featuresValue.premium_feature_1;
      }
      if (features[1]) {
        features[1].textContent = featuresValue.premium_feature_2;
      }
    }

    // Update button onclick handlers with new prices
    const buttons = document.querySelectorAll('button[onclick*="selectPlan"]');
    if (buttons[0] && pricingValue) {
      buttons[0].setAttribute(
        "onclick",
        `selectPlan('monthly', ${pricingValue.monthly_price})`
      );
    }
    if (buttons[1] && pricingValue) {
      buttons[1].setAttribute(
        "onclick",
        `selectPlan('annual', ${pricingValue.annual_price})`
      );
    }
    if (buttons[2] && pricingValue) {
      buttons[2].setAttribute(
        "onclick",
        `selectPlan('quarterly', ${pricingValue.quarterly_price})`
      );
    }
  }

  // Add callback to handle variable changes
  /* clevertap.addVariablesChangedCallback(() => {
    console.log("🔔 Variables updated from CleverTap dashboard");
    updatePageContent();
  }); */

  /* clevertap.syncVariables(
    () => {
      updatePageContent();
      console.log("✅ Variable sync initiated");
    },
    (error) => {
      console.log("❌ Variable sync initiation failed", error);
    }
  ); */

  clevertap.fetchVariables(
    () => {
      console.log("✅ Variable sync successful");
      updatePageContent();
    },
    (error) => {
      console.log("❌ Variable sync failed - using default values", error);
      updatePageContent(); // Still update with defaults
    }
  );

  // Make selectPlan globally available
  window.selectPlan = function (planType, price) {
    // Store plan details and redirect to checkout
    sessionStorage.setItem(
      "selectedPlan",
      JSON.stringify({
        type: planType,
        price: price,
      })
    );

    // Redirect to checkout page
    window.location.href = "#";
  };
}

// Start initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCleverTapVariables);
} else {
  initializeCleverTapVariables();
}
