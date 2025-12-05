document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    content.style.display = (content.style.display === 'flex') ? 'none' : 'flex';
  });
});

document.getElementById("saveSettings").addEventListener("click", async () => {

    const mode = document.getElementById("colorblindMode").value;
    const dys = document.getElementById("dyslexiaFont").checked;
    const contrast = document.getElementById("highContrast").checked;

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: applyAccessibilitySettings,
        args: [mode, dys, contrast]
    });

    const status = document.getElementById("status");
    status.textContent = "Paramètres enregistrés !";
    setTimeout(() => status.textContent = "", 2000);
});

function applyAccessibilitySettings(mode, dyslexic, contrast) {

    document.dispatchEvent(new CustomEvent("cb-mode-change", { detail: mode }));
    document.dispatchEvent(new CustomEvent("dyslexia-change", { detail: dyslexic }));
    document.dispatchEvent(new CustomEvent("contrast-change", { detail: contrast }));
}
