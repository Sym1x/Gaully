document.getElementById("applyBtn").addEventListener("click", async () => {
    const mode = document.getElementById("modeSelect").value;

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: setColorBlindMode,
        args: [mode]
    });
});

function setColorBlindMode(mode) {
    document.dispatchEvent(new CustomEvent("cb-mode-change", { detail: mode }));
}