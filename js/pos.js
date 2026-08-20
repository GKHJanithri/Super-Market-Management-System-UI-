/* ════════════════════════════════════════════════
   FreshMart — pos.js
   Handles Point of Sale: product grid, cart, totals,
   payment, and recent transactions.
   ════════════════════════════════════════════════ */

/* ── Product catalog ──
   "image" = path to the product photo (put files in images/products/).
   "icon"/"color" are kept as a fallback tile shown automatically
   if the image is missing or fails to load. */
const PRODUCTS = [
  { id: 'PRD001', name: 'Sunflower Oil 1L',   price: 3950.00, category: 'groceries',     image: 'images/sun.jpg',  icon: 'fa-bottle-droplet', color: '#e0a900' },
  { id: 'PRD002', name: 'White Sugar 100g',    price: 950.00,  category: 'groceries',     image: 'images/sugar.jpg',    icon: 'fa-cube',           color: '#9ca3af' },
  { id: 'PRD003', name: 'Coca Cola 1L',        price: 950.00,  category: 'beverages',     image: 'images/cock.jpg',      icon: 'fa-bottle-water',   color: '#dc2626' },
  { id: 'PRD004', name: 'Shampoo 1L',          price: 4950.00, category: 'personal-care', image: 'images/shampoo.jpg',        icon: 'fa-pump-soap',      color: '#db2777' },
  { id: 'PRD005', name: 'Nestomalt 450g',      price: 1100.00, category: 'groceries',     image: 'images/nestomalt.jpg',      icon: 'fa-mug-hot',        color: '#92400e' },
  { id: 'PRD006', name: 'Surf excel 500g',     price: 700.00,  category: 'personal-care', image: 'images/surfexcel.jpg',     icon: 'fa-soap',           color: '#2563eb' },
  { id: 'PRD007', name: 'Nutella 500g',        price: 5500.00, category: 'groceries',     image: 'images/nut.jpg',        icon: 'fa-jar',            color: '#78350f' },
  { id: 'PRD008', name: 'White flour 1kg',     price: 350.00,  category: 'groceries',     image: 'images/white_flour.jpg',    icon: 'fa-wheat-awn',      color: '#d6d3d1' },
  { id: 'PRD009', name: 'Dove soap 100g',      price: 250.00,  category: 'personal-care', image: 'images/soap.jpg',      icon: 'fa-soap',           color: '#f472b6' },
  { id: 'PRD010', name: 'Nescafe 500g',        price: 1050.00, category: 'beverages',     image: 'images/nescafe.jpg',        icon: 'fa-mug-saucer',     color: '#78350f' },
  { id: 'PRD011', name: 'CreamCracker 100g',   price: 225.00,  category: 'groceries',     image: 'images/ck.jpg',  icon: 'fa-cookie',         color: '#d97706' },
  { id: 'PRD012', name: 'Tooth Paste 100g',    price: 650.00,  category: 'personal-care', image: 'images/closeup.jpg',    icon: 'fa-tooth',          color: '#0ea5e9' },
  { id: 'PRD013', name: 'Milk Powder 400g',    price: 1110.00, category: 'dairy',         image: 'images/anchor.jpg',    icon: 'fa-cow',            color: '#f3f4f6' },
  { id: 'PRD014', name: 'Olive Oil 1L',        price: 7950.00, category: 'groceries',     image: 'images/oliveoil.jpg',      icon: 'fa-bottle-droplet', color: '#65a30d' },
  { id: 'PRD015', name: 'Nadu Rice 5kg',       price: 150.00,  category: 'groceries',     image: 'images/rice.jpg',      icon: 'fa-bowl-rice',      color: '#fbbf24' },
];

/* ── State ── */
let cart = [];               // [{ id, name, price, qty }]
let currentCategory = 'all';
let currentSearch = '';
let selectedPaymentMethod = 'Cash';

const TAX_RATE = 0.05;
const DISCOUNT = 0;

/* Recent transactions (starts with sample data, newest first) */
let recentTransactions = [
  { receiptId: '#POS-001', dateTime: '16 July 2026, 7:19 AM',  items: 5, amount: 3250.00, status: 'Paid' },
  { receiptId: '#POS-002', dateTime: '16 July 2026, 11:20 AM', items: 2, amount: 780.00,  status: 'Paid' },
  { receiptId: '#POS-003', dateTime: '16 July 2026, 11:25 AM', items: 1, amount: 280.00,  status: 'Paid' },
];
let totalTransactionCount = 25; // shown in "Showing 1 to 3 of 25 transactions"
let nextReceiptNumber = 4;

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
  renderRecentTransactions();

  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    currentCategory = e.target.value;
    renderProducts();
  });

  document.getElementById('productSearch').addEventListener('input', (e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  document.getElementById('clearCartBtn').addEventListener('click', clearCart);
  document.getElementById('payBtn').addEventListener('click', handlePay);

  document.querySelectorAll('.pm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pm-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPaymentMethod = btn.dataset.method;
    });
  });
});

/* ── Product grid ── */
function renderProducts() {
  const grid = document.getElementById('productGrid');

  const filtered = PRODUCTS.filter(p => {
    const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
    const matchesSearch = !currentSearch
      || p.name.toLowerCase().includes(currentSearch)
      || p.id.toLowerCase().includes(currentSearch);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="no-products">No products match your search.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-thumb" style="background:${p.color}">
        <img
          src="${p.image}"
          alt="${p.name}"
          class="product-img"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <i class="fa-solid ${p.icon} product-icon-fallback" style="display:none"></i>
      </div>
      <p class="product-name">${p.name}</p>
      <p class="product-code">${p.id}</p>
      <p class="product-price">Rs.${p.price.toFixed(2)}</p>
    </div>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const product = PRODUCTS.find(p => p.id === card.dataset.id);
      addToCart(product);
    });
  });
}

/* ── Cart logic ── */
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function renderCart() {
  const tbody = document.getElementById('cartTableBody');
  const emptyMsg = document.getElementById('cartEmpty');
  const payBtn = document.getElementById('payBtn');

  if (cart.length === 0) {
    tbody.innerHTML = '';
    emptyMsg.classList.add('visible');
    payBtn.disabled = true;
  } else {
    emptyMsg.classList.remove('visible');
    payBtn.disabled = false;

    tbody.innerHTML = cart.map(item => `
      <tr data-id="${item.id}">
        <td class="cart-item-name">${item.name}</td>
        <td>Rs.${item.price.toFixed(2)}</td>
        <td>
          <div class="qty-control">
            <button class="qty-btn qty-minus" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
          </div>
        </td>
        <td>
          Rs.${(item.price * item.qty).toFixed(2)}
          <button class="remove-item-btn" data-id="${item.id}" title="Remove item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.qty-minus').forEach(btn =>
      btn.addEventListener('click', () => changeQty(btn.dataset.id, -1)));
    tbody.querySelectorAll('.qty-plus').forEach(btn =>
      btn.addEventListener('click', () => changeQty(btn.dataset.id, 1)));
    tbody.querySelectorAll('.remove-item-btn').forEach(btn =>
      btn.addEventListener('click', () => removeFromCart(btn.dataset.id)));
  }

  updateSummary();
}

function updateSummary() {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subTotal * TAX_RATE;
  const total = subTotal - DISCOUNT + tax;

  document.getElementById('cartItemCount').textContent = itemCount;
  document.getElementById('subTotal').textContent = `Rs. ${subTotal.toFixed(2)}`;
  document.getElementById('discount').textContent = `Rs. ${DISCOUNT.toFixed(2)}`;
  document.getElementById('tax').textContent = `Rs. ${tax.toFixed(2)}`;
  document.getElementById('grandTotal').textContent = `Rs. ${total.toFixed(2)}`;
}

/* ── Pay ── */
function handlePay() {
  if (cart.length === 0) return;

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subTotal - DISCOUNT + subTotal * TAX_RATE;

  const receiptId = `#POS-${String(nextReceiptNumber).padStart(3, '0')}`;
  nextReceiptNumber += 1;
  totalTransactionCount += 1;

  const now = new Date();
  const dateTime = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  recentTransactions.unshift({
    receiptId,
    dateTime,
    items: itemCount,
    amount: total,
    status: 'Paid'
  });
  recentTransactions = recentTransactions.slice(0, 3);

  renderRecentTransactions();
  showToast(`Payment received via ${selectedPaymentMethod} — ${receiptId}`);
  clearCart();
}

/* ── Recent transactions ── */
function renderRecentTransactions() {
  const tbody = document.getElementById('recentTransactionsBody');

  tbody.innerHTML = recentTransactions.map(tx => `
    <tr>
      <td>${tx.receiptId}</td>
      <td>${tx.dateTime}</td>
      <td>${tx.items} items</td>
      <td>Rs.${tx.amount.toFixed(2)}</td>
      <td><span class="status-badge status-${tx.status.toLowerCase()}">${tx.status}</span></td>
    </tr>
  `).join('');

  document.getElementById('transactionsFooter').textContent =
    `Showing 1 to ${recentTransactions.length} of ${totalTransactionCount} transactions`;
}

/* ── Toast ── */
function showToast(message) {
  let toast = document.getElementById('posToast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'posToast';
    toast.className = 'pos-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  toast.classList.add('visible');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('visible'), 2800);
}