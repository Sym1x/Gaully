chrome.storage.sync.get({
  colorblindMode: "none",
  dyslexiaFont: false,
  highContrast: false,
  ttsOnSelect: false
}, (settings) => {
  document.getElementById("colorblindMode").value = settings.colorblindMode;
  document.getElementById("dyslexiaFont").checked = settings.dyslexiaFont;
  document.getElementById("highContrast").checked = settings.highContrast;
  document.getElementById("ttsOnSelect").checked = settings.ttsOnSelect;
});

// Toggle sections
document.querySelectorAll('.section-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    content.classList.toggle('open');
  });
});

// Save & apply
document.getElementById("saveSettings").addEventListener("click", async () => {
  const settings = {
    colorblindMode: document.getElementById("colorblindMode").value,
    dyslexiaFont: document.getElementById("dyslexiaFont").checked,
    highContrast: document.getElementById("highContrast").checked,
    ttsOnSelect: document.getElementById("ttsOnSelect").checked
  };

  await chrome.storage.sync.set(settings);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: applySettingsFromPopup,
    args: [settings]
  });

  const status = document.getElementById("status");
  status.textContent = "Paramètres appliqués";
  setTimeout(() => status.textContent = "", 2000);
});

// TTS controls
document.getElementById("readPage").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "readFullPage" });
});

document.getElementById("stopTts").addEventListener("click", () => {
  chrome.tts.stop();
});

function applySettingsFromPopup(s) {
  document.dispatchEvent(new CustomEvent("gaully-apply-settings", { detail: s }));
}