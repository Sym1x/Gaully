document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    content.style.display = content.style.display === 'flex' ? 'none' : 'flex';
  });
});

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

document.getElementById("saveSettings").addEventListener("click", async () => {
  const settings = {
    colorblindMode: document.getElementById("colorblindMode").value,
    dyslexiaFont: document.getElementById("dyslexiaFont").checked,
    highContrast: document.getElementById("highContrast").checked
  };

  await chrome.storage.sync.set(settings);

  const status = document.getElementById("status");
  status.textContent = "Paramètres enregistrés !";
  setTimeout(() => status.textContent = "", 1500);
});
