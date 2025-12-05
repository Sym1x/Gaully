let current = {};

chrome.storage.sync.get({
  colorblindMode: "none",
  dyslexiaFont: false,
  highContrast: false,
  ttsOnSelect: false
}, (s) => {
  current = s;
  applyAll(s);
});

document.addEventListener("gaully-apply-settings", e => {
  current = e.detail;
  applyAll(e.detail);
});

function applyAll(s) {
  const filter = s.colorblindMode === "none"
    ? "none"
    : `url(${chrome.runtime.getURL("filters.svg")}#${s.colorblindMode})`;
  document.documentElement.style.filter = filter;

  if (s.dyslexiaFont) {
    document.body.style.fontFamily = '"OpenDyslexic", Arial, sans-serif';
    if (!document.getElementById("opendyslexic-css")) {
      const link = document.createElement("link");
      link.id = "opendyslexic-css";
      link.rel = "stylesheet";
      link.href = "https://fonts.cdnfonts.com/css/open-dyslexic";
      document.head.appendChild(link);
    }
  }

  document.documentElement.classList.toggle("gaully-high-contrast", s.highContrast);

  if (s.ttsOnSelect) {
    document.addEventListener("mouseup", handleSelection);
  } else {
    document.removeEventListener("mouseup", handleSelection);
  }
}

if (!document.getElementById("gaully-hc")) {
  const style = document.createElement("style");
  style.id = "gaully-hc";
  style.textContent = `
    .gaully-high-contrast *, .gaully-high-contrast {
      background: black !important;
      color: white !important;
      border-color: white !important;
    }
    .gaully-high-contrast a { color: #ff0 !important; text-decoration: underline !important; }
    .gaully-high-contrast img { filter: brightness(0.9) contrast(1.8) !important; }
  `;
  document.head.appendChild(style);
}

function handleSelection() {
  const text = window.getSelection().toString().trim();
  if (text) {
    chrome.tts.speak(text, { lang: "fr-FR", rate: 1.0 });
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "readFullPage") {
    let text = document.body.innerText || "";
    text = text.replace(/\s+/g, " ").trim();
    if (text.length > 10000) text = text.substring(0, 10000) + "...";
    chrome.tts.speak(text, { lang: "fr-FR", rate: 0.95 });
  }
});