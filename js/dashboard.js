/* ════════════════════════════════════════════
   FreshMart — dashboard.js
   Charts + data injection for Dashboard page
   ════════════════════════════════════════════ */

// ── Category data ──
const categories = [
  { name: 'Occupied',    pct: 45, amt: 'Rs. 11,500', color: '#00B8A9' },
  { name: 'Beverages',   pct: 22, amt: 'Rs. 22,700', color: '#f59e0b' },
  { name: 'Snacks',      pct: 15, amt: 'Rs. 13,850', color: '#8b5cf6' },
  { name: 'Dairy & Eggs',pct: 10, amt: 'Rs. 25,706', color: '#d1d5db' },
  { name: 'Others',      pct:  8, amt: 'Rs. 19,952', color: '#e2e8f0' }
];

// ── Top selling products ──
const topProducts = [
  { rank: 1, name: 'Apple red',  price: 'LKR 840.00', qty: '500g', emoji: '🍎' },
  { rank: 2, name: 'Banana',     price: 'LKR 375.00', qty: '500g', emoji: '🍌' },
  { rank: 3, name: 'Bread',      price: 'LKR 135.00', qty: '500g', emoji: '🍞' },
  { rank: 4, name: 'Carrot',     price: 'LKR 170.00', qty: '500g', emoji: '🥕' }
];

// ── Low stock items ──
const lowStockItems = [
  { rank: 1, name: 'Butter 200g',  price: 'LKR 950.00',  emoji: '🧈' },
  { rank: 2, name: 'Grapes 100g',  price: 'LKR 295.00',  emoji: '🍇' },
  { rank: 3, name: 'Eggs',         price: 'LKR 40.00',   emoji: '🥚' },
  { rank: 4, name: 'Biscuit',      price: 'LKR 150.00',  emoji: '🍪' }
];

// ── Recent transactions ──
const transactions = [
  { id: 'INV- 10025', name: 'Kasu Perera',  amount: 'Rs. 3500', time: '10.30 AM' },
  { id: 'INV- 10026', name: 'Mala Kumari',  amount: 'Rs. 8570', time: '10.45 AM' },
  { id: 'INV- 10026', name: 'Geetha Silva', amount: 'Rs. 2879', time: '10.49 AM' },
  { id: 'INV- 10026', name: 'Sithimi Malki',amount: 'Rs. 7930', time: '11.00 AM' }
];

/* ── Donut Chart — Sales by Category ── */
function initCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.map(c => c.name),
      datasets: [{
        data: categories.map(c => c.pct),
        backgroundColor: categories.map(c => c.color),
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });

  /* Render legend */
  const legend = document.getElementById('categoryLegend');
  if (!legend) return;
  legend.innerHTML = '';

  categories.forEach(cat => {
    const row = document.createElement('div');
    row.className = 'legend-row';
    row.innerHTML = `
      <div class="legend-dot" style="background:${cat.color};"></div>
      <span class="legend-name">${cat.name}</span>
      <span class="legend-pct">${cat.pct} %</span>
      <span class="legend-amt">${cat.amt}</span>
    `;
    legend.appendChild(row);
  });
}

/* ── Line Chart — Sales Overview ── */
function initOverviewChart() {
  const ctx = document.getElementById('overviewChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales',
        data: [5000, 10000, 8000, 11000, 9000, 10500, 20000],
        borderColor: '#00B8A9',
        backgroundColor: 'rgba(0,184,169,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#00B8A9',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' Rs. ' + ctx.parsed.y.toLocaleString()
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            callback: v => v >= 1000 ? (v / 1000) + 'K' : v,
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
}

/* ── Top Selling Products ── */
function renderTopProducts() {
  const container = document.getElementById('topProductList');
  if (!container) return;
  container.innerHTML = '';

  topProducts.forEach(p => {
    const row = document.createElement('div');
    row.className = 'product-row';
    row.innerHTML = `
      <div class="product-rank">${p.rank}</div>
      <div class="product-img" style="display:flex;align-items:center;
        justify-content:center;font-size:22px;">${p.emoji}</div>
      <div class="product-info">
        <p class="product-name">${p.name}</p>
        <p class="product-price">${p.price}</p>
      </div>
      <span class="product-qty">${p.qty}</span>
    `;
    container.appendChild(row);
  });
}

/* ── Low Stock Alerts ── */
function renderLowStock() {
  const container = document.getElementById('stockList');
  if (!container) return;
  container.innerHTML = '';

  lowStockItems.forEach(item => {
    const row = document.createElement('div');
    row.className = 'stock-row';
    row.innerHTML = `
      <div class="stock-rank">${item.rank}</div>
      <div class="stock-img" style="display:flex;align-items:center;
        justify-content:center;font-size:22px;">${item.emoji}</div>
      <div class="stock-info">
        <p class="stock-name">${item.name}</p>
        <p class="stock-price">${item.price}</p>
      </div>
      <span class="badge-low">Low</span>
    `;
    container.appendChild(row);
  });
}

/* ── Recent Transactions ── */
function renderTransactions() {
  const container = document.getElementById('transactionsList');
  if (!container) return;
  container.innerHTML = '';

  transactions.forEach(txn => {
    const row = document.createElement('div');
    row.className = 'txn-row';
    row.innerHTML = `
      <div class="txn-icon">
        <i class="fa-solid fa-cart-shopping"></i>
      </div>
      <div class="txn-info">
        <p class="txn-id">${txn.id}</p>
        <p class="txn-name">${txn.name}</p>
      </div>
      <div class="txn-right">
        <p class="txn-amount">${txn.amount}</p>
        <p class="txn-time">${txn.time}</p>
      </div>
    `;
    container.appendChild(row);
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initCategoryChart();
    initOverviewChart();
  }, 300);
  renderTopProducts();
  renderLowStock();
  renderTransactions();
});