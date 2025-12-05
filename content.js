chrome.storage.sync.get(
  ["colorblindMode", "dyslexiaFont", "highContrast"],
  (settings) => {
    console.log("accessibility settings:", settings);
  }
);

document.addEventListener("cb-mode-change", (event) => {
    applyFilter(event.detail);
});

function applyFilter(mode) {
    const filters = {
        none: "none",
        protanopia: "url('#protanopia')",
        deuteranopia: "url('#deuteranopia')",
        tritanopia: "url('#tritanopia')"
    };

    const cssFilters = {
        none: "none",
        protanopia: "grayscale(50%) sepia(100%) hue-rotate(-50deg)",
        deuteranopia: "grayscale(40%) sepia(80%) hue-rotate(20deg)",
        tritanopia: "grayscale(60%) sepia(80%) hue-rotate(150deg)"
    };

    document.documentElement.style.filter = cssFilters[mode] || "none";
}