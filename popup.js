document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.sync.get({
    colorblindMode: "none",
    dyslexiaFont: false,
    highContrast: false
  });

  document.getElementById("colorblindMode").value = data.colorblindMode;
  document.getElementById("dyslexiaFont").checked = data.dyslexiaFont;
  document.getElementById("highContrast").checked = data.highContrast;
});

// Save settings
document.getElementById("saveSettings").addEventListener("click", async () => {
  const settings = {
    colorblindMode: document.getElementById("colorblindMode").value,
    dyslexiaFont: document.getElementById("dyslexiaFont").checked,
    highContrast: document.getElementById("highContrast").checked
  };

  await chrome.storage.sync.set(settings);

  const status = document.getElementById("status");
  status.textContent = "Saved!";
  setTimeout(() => status.textContent = "", 1500);
});
