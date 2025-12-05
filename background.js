chrome.runtime.onInstalled.addListener(() => {
  console.log("Gaully installé avec succès !");
});
// Initialize extension
chrome.runtime.onInstalled.addListener(function() {
  // Set default settings
  chrome.storage.sync.set({
    colorblindMode: 'none',
    dyslexiaFont: false,
    highContrast: false,
    ttsOnSelect: false
  });
});

// Inject content script into all tabs when they load
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ['content.js']
    }).catch(error => {
      console.log('Script injection failed:', error);
    });
  }
});