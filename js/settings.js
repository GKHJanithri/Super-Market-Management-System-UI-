/* ════════════════════════════════════════════════
   FreshMart — settings.js
   Handles tab switching + form save for Settings page.
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initSettingsTabs();
  initGeneralSettingsForm();
});

/* ── Tab switching ── */
function initSettingsTabs() {
  const navItems = document.querySelectorAll('.settings-nav-item');
  const panels = document.querySelectorAll('.settings-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${tab}`);
      });
    });
  });
}

/* ── General Settings form ── */
function initGeneralSettingsForm() {
  const form = document.getElementById('generalSettingsForm');
  if (!form) return;

  // Load any previously saved settings
  const saved = getSavedSettings();
  if (saved) applySettingsToForm(saved);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const settings = Object.fromEntries(formData.entries());

    saveSettings(settings);
    showSaveToast();
  });
}

function getSavedSettings() {
  try {
    const raw = localStorage.getItem('freshmart_general_settings');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Could not read saved settings:', err);
    return null;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem('freshmart_general_settings', JSON.stringify(settings));
  } catch (err) {
    console.warn('Could not save settings:', err);
  }
}

function applySettingsToForm(settings) {
  Object.entries(settings).forEach(([key, value]) => {
    const field = document.querySelector(`[name="${key}"]`);
    if (!field) return;

    if (field.type === 'radio') {
      const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
      if (radio) radio.checked = true;
    } else {
      field.value = value;
    }
  });
}

function showSaveToast() {
  let toast = document.getElementById('settingsToast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'settingsToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f9b8e;
      color: #fff;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      z-index: 999;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Settings saved successfully';

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  clearTimeout(showSaveToast._timer);
  showSaveToast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 2500);
}
