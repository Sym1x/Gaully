chrome.storage.sync.get(
  ["colorblindMode", "dyslexiaFont", "highContrast"],
  (settings) => {
    console.log("Gaulish accessibility settings:", settings);
  }
);
