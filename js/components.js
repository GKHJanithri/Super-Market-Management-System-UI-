/* ════════════════════════════════════════════════
   FreshMart — components.js
   Loads sidebar, topbar, footer into every page.
   Works with Live Server AND file:// fallback.
   ════════════════════════════════════════════════ */

const FALLBACK = {

  sidebar: `<aside class="sidebar" id="sidebar">
  <div class="sidebar-brand">
    <div class="brand-icon"><i class="fa-solid fa-cart-shopping"></i></div>
    <div class="brand-text">
      <span class="brand-name">FreshMart</span>
      <span class="brand-sub">Super Market Management</span>
    </div>
  </div>
  <nav class="sidebar-nav">
    <a href="dashboard.html" class="nav-item" data-page="dashboard">
      <i class="fa-solid fa-table-columns"></i><span>Dashboard</span>
    </a>
    <a href="pos.html" class="nav-item" data-page="pos">
      <i class="fa-solid fa-cash-register"></i><span>POS</span>
    </a>
    <a href="products.html" class="nav-item" data-page="products">
      <i class="fa-solid fa-box"></i><span>Products</span>
    </a>
    <a href="categories.html" class="nav-item" data-page="categories">
      <i class="fa-solid fa-tags"></i><span>Categories</span>
    </a>
    <a href="sales.html" class="nav-item" data-page="sales">
      <i class="fa-solid fa-chart-line"></i><span>Sales</span>
    </a>
    <a href="suppliers.html" class="nav-item" data-page="suppliers">
      <i class="fa-solid fa-truck"></i><span>Suppliers</span>
    </a>
    <a href="reports.html" class="nav-item" data-page="reports">
      <i class="fa-solid fa-chart-column"></i><span>Reports</span>
    </a>
  </nav>
  <div class="sidebar-promo">
    <div class="promo-top">
      <p class="promo-title">Fresh Deals!</p>
      <span class="promo-badge">Weekend Offer</span>
    </div>
    <p class="promo-discount">20% OFF</p>
    <p class="promo-desc">on Fruits &amp; Vegetables</p>
    <button class="btn-promo"><i class="fa-solid fa-tag"></i> View Offers</button>
  </div>
</aside>`,

  topbar: `<header class="topbar">
  <div class="topbar-greeting">
    <h1 class="greeting-title" id="page-title">Good Morning Admin</h1>
    <p class="greeting-sub" id="page-sub">Here's what's happening with your store today.</p>
  </div>
  <div class="search-box">
    <i class="fa-solid fa-magnifying-glass"></i>
    <input type="text" placeholder="Search anything...">
  </div>
  <div class="topbar-actions">
    <button class="icon-btn"><i class="fa-regular fa-bell"></i></button>
    <button class="icon-btn"><i class="fa-solid fa-grip"></i></button>
    <button class="icon-btn" type="button" title="Settings" aria-label="Open settings" onclick="window.location.href='settings.html'"><i class="fa-solid fa-sun"></i></button>
  </div>
</header>`,

  footer: `<footer class="footer">
  <div class="footer-content">
    <div class="footer-brand-col">
      <div class="footer-brand-name">EgoTECH World</div>
      <p class="footer-brand-desc">Developing ready made and custom solutions for modern challenges.</p>
    </div>
    <div class="footer-nav-col">
      <h5 class="footer-col-title">Navigation</h5>
      <div class="footer-links-grid">
        <div class="footer-links-col">
          <a href="#">Home</a><a href="#">Job</a><a href="#">Services</a>
        </div>
        <div class="footer-links-col">
          <a href="#">Projects</a><a href="#">Contact</a><a href="#">About</a>
        </div>
      </div>
    </div>
    <div class="footer-divider-v"></div>
    <div class="footer-nav-col">
      <h5 class="footer-col-title">Resources</h5>
      <div class="footer-links-grid">
        <div class="footer-links-col">
          <a href="#">Documentation</a><a href="#">Pricing</a><a href="#">Support</a>
        </div>
        <div class="footer-links-col">
          <a href="#">Privacy &amp; Policy</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>
    <div class="footer-divider-v"></div>
    <div class="footer-social-col">
      <h5 class="footer-col-title">Stay Connected</h5>
      <div class="footer-social-icons">
        <a href="#" class="social-icon facebook" aria-label="Facebook">
          <i class="fa-brands fa-facebook-f"></i>
        </a>
        <a href="#" class="social-icon linkedin" aria-label="LinkedIn">
          <i class="fa-brands fa-linkedin-in"></i>
        </a>
      </div>
      <p class="footer-follow">Follow Us</p>
    </div>
  </div>
  <div class="footer-bottom">
    &copy; 2026 egotechworld.com &nbsp;&ndash;&nbsp; EGOTECHWORLD PVT LTD. All Rights Reserved.
  </div>
</footer>`
};

/* ── Load one component ── */
async function loadComponent(selector, filePath) {
  const target = document.querySelector(selector);
  if (!target) return;

  const key = filePath.includes('sidebar') ? 'sidebar'
            : filePath.includes('topbar')  ? 'topbar'
            : 'footer';

  /* file:// → always use fallback */
  if (location.protocol === 'file:') {
    target.innerHTML = FALLBACK[key];
    return;
  }

  /* Live Server / real server → fetch */
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`${res.status} ${filePath}`);
    target.innerHTML = await res.text();
  } catch (err) {
    console.warn('fetch failed, using fallback:', err.message);
    target.innerHTML = FALLBACK[key];
  }
}

/* ── Highlight active sidebar nav item ── */
function setActiveNav() {
  const page = document.body.dataset.page || '';
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if ((item.dataset.page || '') === page) {
      item.classList.add('active');
    }
  });
}

/* ── Set topbar title/subtitle from body data attrs ── */
function setPageMeta() {
  const title  = document.body.dataset.title;
  const sub    = document.body.dataset.sub;
  const elT    = document.getElementById('page-title');
  const elS    = document.getElementById('page-sub');
  if (title && elT) elT.textContent = title;
  if (sub   && elS) elS.textContent = sub;
}

/* ── Boot ── */
async function loadAllComponents() {
  await loadComponent('#sidebar-placeholder', 'components/sidebar.html');
  await loadComponent('#topbar-placeholder',  'components/topbar.html');
  await loadComponent('#footer-placeholder',  'components/footer.html');
  setActiveNav();
  setPageMeta();
}

document.addEventListener('DOMContentLoaded', loadAllComponents);