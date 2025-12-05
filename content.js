// Wait for the page to fully load
window.addEventListener('load', function() {
  // Apply saved settings on page load
  chrome.storage.sync.get([
    'colorblindMode',
    'dyslexiaFont',
    'highContrast',
    'ttsOnSelect'
  ], function(settings) {
    if (Object.keys(settings).length > 0) {
      applySettings(settings);
    }
  });
  
  // Listen for selection events for TTS
  document.addEventListener('mouseup', handleTextSelection);
});

// Function to apply all settings
function applySettings(settings) {
  // Remove any existing style elements
  removeExistingStyles();
  
  // Apply colorblind simulation
  if (settings.colorblindMode && settings.colorblindMode !== 'none') {
    applyColorblindFilter(settings.colorblindMode);
  }
  
  // Apply dyslexia font
  if (settings.dyslexiaFont) {
    applyDyslexiaFont();
  }
  
  // Apply high contrast
  if (settings.highContrast) {
    applyHighContrast();
  }
}

// Remove existing style elements created by this extension
function removeExistingStyles() {
  const styles = document.querySelectorAll('[data-gaully-style]');
  styles.forEach(style => style.remove());
}

// Colorblind simulation filters
function applyColorblindFilter(mode) {
  const style = document.createElement('style');
  style.setAttribute('data-gaully-style', 'colorblind');
  
  let filter = '';
  switch(mode) {
    case 'protanopia':
      filter = 'url(#protanopia)';
      break;
    case 'deuteranopia':
      filter = 'url(#deuteranopia)';
      break;
    case 'tritanopia':
      filter = 'url(#tritanopia)';
      break;
    case 'achromatopsia':
      filter = 'grayscale(100%)';
      break;
  }
  
  if (mode !== 'achromatopsia') {
    // Create SVG filters for colorblind simulations
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    if (mode === 'protanopia') {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = 'protanopia';
      // Protanopia filter matrix (simplified)
      filter.innerHTML = `
        <feColorMatrix type="matrix"
          values="0.567, 0.433, 0, 0, 0
                  0.558, 0.442, 0, 0, 0
                  0,     0.242, 0.758, 0, 0
                  0,     0,     0,     1, 0"/>
      `;
      defs.appendChild(filter);
    } else if (mode === 'deuteranopia') {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = 'deuteranopia';
      // Deuteranopia filter matrix (simplified)
      filter.innerHTML = `
        <feColorMatrix type="matrix"
          values="0.625, 0.375, 0, 0, 0
                  0.7,   0.3,   0, 0, 0
                  0,     0.3,   0.7, 0, 0
                  0,     0,     0,   1, 0"/>
      `;
      defs.appendChild(filter);
    } else if (mode === 'tritanopia') {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = 'tritanopia';
      // Tritanopia filter matrix (simplified)
      filter.innerHTML = `
        <feColorMatrix type="matrix"
          values="0.95, 0.05,  0,    0, 0
                  0,    0.433, 0.567,0, 0
                  0,    0.475, 0.525,0, 0
                  0,    0,     0,     1, 0"/>
      `;
      defs.appendChild(filter);
    }
    
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }
  
  style.textContent = `
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      filter: ${filter} !important;
    }
    
    img, video, canvas, svg {
      filter: ${filter} !important;
    }
  `;
  
  document.head.appendChild(style);
}

// Dyslexia-friendly font
function applyDyslexiaFont() {
  const style = document.createElement('style');
  style.setAttribute('data-gaully-style', 'dyslexia');
  
  style.textContent = `
    * {
      font-family: "Comic Sans MS", "OpenDyslexic", "Andika", sans-serif !important;
      letter-spacing: 0.05em !important;
      line-height: 1.6 !important;
    }
    
    p, span, div, a, li, td, th {
      font-size: 1.1em !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      letter-spacing: 0.1em !important;
    }
  `;
  
  document.head.appendChild(style);
}

// High contrast mode
function applyHighContrast() {
  const style = document.createElement('style');
  style.setAttribute('data-gaully-style', 'highcontrast');
  
  style.textContent = `
    * {
      background-color: black !important;
      color: white !important;
      border-color: yellow !important;
    }
    
    a {
      color: #00ffff !important;
      text-decoration: underline !important;
    }
    
    a:visited {
      color: #ff00ff !important;
    }
    
    a:hover, a:focus {
      color: #ffff00 !important;
      background-color: #333 !important;
    }
    
    button, input, select, textarea {
      background-color: #222 !important;
      border: 2px solid yellow !important;
      color: white !important;
    }
    
    img, video {
      filter: contrast(1.5) brightness(1.2) !important;
    }
  `;
  
  document.head.appendChild(style);
}

let currentSpeech = null;

function handleTextSelection(event) {
  chrome.storage.sync.get(['ttsOnSelect'], function(result) {
    if (result.ttsOnSelect) {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText.length > 0) {
        speakText(selectedText);
      }
    }
  });
}

function speakText(text) {
  if (currentSpeech) {
    currentSpeech.cancel();
  }
  
  currentSpeech = new SpeechSynthesisUtterance(text);
  currentSpeech.lang = document.documentElement.lang || 'fr-FR';
  currentSpeech.rate = 1.0;
  currentSpeech.pitch = 1.0;
  currentSpeech.volume = 1.0;
  
  speechSynthesis.speak(currentSpeech);
}

function readEntirePage() {
  const pageText = document.body.innerText || '';
  if (pageText.trim().length > 0) {
    speakText(pageText.substring(0, 5000));
  }
}

function stopSpeech() {
  if (currentSpeech) {
    speechSynthesis.cancel();
    currentSpeech = null;
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch(request.action) {
    case 'applySettings':
      applySettings(request.settings);
      sendResponse({success: true});
      break;
      
    case 'readPage':
      readEntirePage();
      sendResponse({success: true});
      break;
      
    case 'stopTts':
      stopSpeech();
      sendResponse({success: true});
      break;
  }
  return true;
});