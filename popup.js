document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get([
    'colorblindMode',
    'dyslexiaFont',
    'highContrast',
    'ttsOnSelect'
  ], function(settings) {
    if (settings.colorblindMode) {
      document.getElementById('colorblindMode').value = settings.colorblindMode;
    }
    if (settings.dyslexiaFont !== undefined) {
      document.getElementById('dyslexiaFont').checked = settings.dyslexiaFont;
    }
    if (settings.highContrast !== undefined) {
      document.getElementById('highContrast').checked = settings.highContrast;
    }
    if (settings.ttsOnSelect !== undefined) {
      document.getElementById('ttsOnSelect').checked = settings.ttsOnSelect;
    }
  });

  // Toggle section visibility
  document.querySelectorAll('.section-header').forEach(button => {
    button.addEventListener('click', function() {
      const content = this.nextElementSibling;
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
  });

  // Save and apply settings
  document.getElementById('saveSettings').addEventListener('click', function() {
    const settings = {
      colorblindMode: document.getElementById('colorblindMode').value,
      dyslexiaFont: document.getElementById('dyslexiaFont').checked,
      highContrast: document.getElementById('highContrast').checked,
      ttsOnSelect: document.getElementById('ttsOnSelect').checked
    };

    // Save to storage
    chrome.storage.sync.set(settings, function() {
      const status = document.getElementById('status');
      status.textContent = 'Paramètres sauvegardés!';
      status.style.color = '#4CAF50';
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'applySettings',
            settings: settings
          });
        }
      });
      
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    });
  });

  // TTS
  document.getElementById('readPage').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'readPage'});
      }
    });
  });

  document.getElementById('stopTts').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'stopTts'});
      }
    });
  });
});
