document.addEventListener('DOMContentLoaded', async () => {
  const toggleSponsored = document.getElementById('toggle-sponsored');
  const toggleDeals = document.getElementById('toggle-deals');
  const toggleBanners = document.getElementById('toggle-banners');
  const blockedCountEl = document.getElementById('blocked-count');
  const statusPill = document.getElementById('status-pill');
  const statusText = document.getElementById('status-text');

  // ۱. بارگذاری تنظیمات ذخیره شده از حافظه کروم
  const defaultSettings = {
    hideSponsored: true,
    hideDeals: true,
    hideBanners: true
  };

  const stored = await chrome.storage.local.get(defaultSettings);
  toggleSponsored.checked = stored.hideSponsored;
  toggleDeals.checked = stored.hideDeals;
  toggleBanners.checked = stored.hideBanners;

  updateStatusUI();

  // ۲. دریافت آمار لایو از تب فعال دیجی کالا
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab && activeTab.id && activeTab.url && activeTab.url.includes('digikala.com')) {
      chrome.tabs.sendMessage(activeTab.id, { action: 'getStats' }, (response) => {
        if (!chrome.runtime.lastError && response && typeof response.blockedCount === 'number') {
          blockedCountEl.textContent = response.blockedCount.toLocaleString('fa-IR');
        }
      });
    }
  } catch (e) {
    console.debug('Active tab communication skipped:', e);
  }

  // ۳. هندلر تغییر تنظیمات و ذخیره خودکار
  async function saveAndSync() {
    const newSettings = {
      hideSponsored: toggleSponsored.checked,
      hideDeals: toggleDeals.checked,
      hideBanners: toggleBanners.checked
    };

    await chrome.storage.local.set(newSettings);
    updateStatusUI();

    // مخابره تنظیمات به تمام تب های باز دیجی کالا
    const tabs = await chrome.tabs.query({ url: '*://*.digikala.com/*' });
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'settingsChanged',
        settings: newSettings
      }).catch(() => {});
    });
  }

  function updateStatusUI() {
    const isAnyActive = toggleSponsored.checked || toggleDeals.checked || toggleBanners.checked;
    if (isAnyActive) {
      statusPill.classList.remove('disabled');
      statusText.textContent = 'فعال';
    } else {
      statusPill.classList.add('disabled');
      statusText.textContent = 'غیرفعال';
    }
  }

  toggleSponsored.addEventListener('change', saveAndSync);
  toggleDeals.addEventListener('change', saveAndSync);
  toggleBanners.addEventListener('change', saveAndSync);
});
