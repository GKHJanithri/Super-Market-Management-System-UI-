/* ════════════════════════════════════════════
   FreshMart — products.js
   Products page: table, filters, modals
   ════════════════════════════════════════════ */

// ── Product data ──
const products = [
  {
    name: 'Sunflower Oil 1L',
    category: 'Oils',
    supplier: 'Sunshine Suppliers',
    price: 3950.00,
    stock: 85,
    status: 'In Stock',
    img: 'images/sun.jpg',
    emoji: '🫙',
    notes: ''
  },
  {
    name: 'White Sugar 100g',
    category: 'Groceries',
    supplier: 'Leka Foods (Pvt) Ltd',
    price: 950.00,
    stock: 110,
    status: 'In Stock',
    img: 'images/sugar.jpg',
    emoji: '🍬',
    notes: ''
  },
  {
    name: 'Coca Cola 1L',
    category: 'Beverages',
    supplier: 'Ceylon Beverages',
    price: 530.00,
    stock: 90,
    status: 'In Stock',
    img: 'images/cock.jpg',
    emoji: '🥤',
    notes: ''
  },
  {
    name: 'Shampoo 1L',
    category: 'Personal Care',
    supplier: 'Care & Glow Pvt',
    price: 9570.00,
    stock: 15,
    status: 'Low Stock',
    img: 'images/shampoo.jpg',
    emoji: '🧴',
    notes: ''
  },
  {
    name: 'Nestomalt 450g',
    category: 'Health & Drink',
    supplier: 'Lanka Foods (Pvt) Ltd',
    price: 970.00,
    stock: 10,
    status: 'Low Stock',
    img: 'images/nestomalt.jpg',
    emoji: '🥛',
    notes: ''
  },
  {
    name: 'Surf excel 500g',
    category: 'Household',
    supplier: 'Gold Suppliers',
    price: 960.00,
    stock: 0,
    status: 'Out Of Stock',
    img: 'images/surfexcel.jpg',
    emoji: '🧺',
    notes: ''
  },
  {
    name: 'Nutella 500g',
    category: 'Spread',
    supplier: 'Lanka Foods (Pvt) Ltd',
    price: 764.00,
    stock: 500,
    status: 'In Stock',
    img: 'images/nut.jpg',
    emoji: '🫙',
    notes: ''
  }
];

// ── DOM ──
const productsBody   = document.getElementById('productsBody');
const searchInput    = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const supplierFilter = document.getElementById('supplierFilter');
const statusFilter   = document.getElementById('statusFilter');
const resultsText    = document.getElementById('resultsText');

// ── Format price ──
function fmt(price) {
  return 'Rs. ' + price.toFixed(2);
}

// ── Status badge class ──
function getBadgeClass(status) {
  const map = {
    'In Stock':    'badge-in-stock',
    'Low Stock':   'badge-low-stock',
    'Out Of Stock':'badge-out-stock'
  };
  return map[status] || 'badge-in-stock';
}

// ── Auto-calc status from stock ──
function calcStatus(stock) {
  if (stock === 0) return 'Out Of Stock';
  if (stock <= 20) return 'Low Stock';
  return 'In Stock';
}

// ── Update KPI cards ──
function updateKPIs() {
  const total  = products.length;
  const active = products.filter(p => p.status === 'In Stock').length;
  const low    = products.filter(p => p.status === 'Low Stock').length;
  const out    = products.filter(p => p.status === 'Out Of Stock').length;

  document.getElementById('kpiTotal').textContent  = total;
  document.getElementById('kpiActive').textContent = active;
  document.getElementById('kpiLow').textContent    = low;
  document.getElementById('kpiOut').textContent    = out;
}

// ── Render table ──
function renderProducts(data) {
  productsBody.innerHTML = '';

  if (data.length === 0) {
    productsBody.innerHTML = `
      <tr><td colspan="7"
        style="text-align:center;padding:32px;color:var(--text-muted);">
        No products found.
      </td></tr>`;
    resultsText.textContent = 'Showing 0 products';
    updateKPIs();
    return;
  }

  data.forEach(prod => {
    const realIndex = products.indexOf(prod);
    const badgeCls  = getBadgeClass(prod.status);

    const imgCell = prod.img
      ? `<img class="prod-img" src="${prod.img}" alt="${prod.name}"
           onerror="this.parentElement.innerHTML='<div class=prod-img-placeholder>${prod.emoji}</div>'">`
      : `<div class="prod-img-placeholder">${prod.emoji}</div>`;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="prod-cell">
          ${imgCell}
          <span class="prod-name">${prod.name}</span>
        </div>
      </td>
      <td>${prod.category}</td>
      <td>${prod.supplier}</td>
      <td>${fmt(prod.price)}</td>
      <td>${prod.stock}</td>
      <td><span class="status-badge ${badgeCls}">${prod.status}</span></td>
      <td>
        <div class="action-cell">
          <button class="action-btn edit-btn"
            title="Edit" data-index="${realIndex}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="action-btn view-btn"
            title="View" data-index="${realIndex}">
            <i class="fa-regular fa-eye"></i>
          </button>
          <button class="action-btn del-btn"
            title="Delete" data-index="${realIndex}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    productsBody.appendChild(row);
  });

  resultsText.textContent = `Showing 1 to ${data.length} products`;
  attachListeners();
  updateKPIs();
}

// ── Attach row action listeners ──
function attachListeners() {

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.index));
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(btn.dataset.index));
  });

  document.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      if (confirm(`Delete "${products[i].name}"?`)) {
        products.splice(i, 1);
        applyFilters();
      }
    });
  });
}

// ── Filter logic ──
function applyFilters() {
  const search   = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const supplier = supplierFilter.value;
  const status   = statusFilter.value;

  const filtered = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search) ||
                          p.category.toLowerCase().includes(search);
    const matchCategory = !category || p.category === category;
    const matchSupplier = !supplier || p.supplier === supplier;
    const matchStatus   = !status   || p.status   === status;
    return matchSearch && matchCategory && matchSupplier && matchStatus;
  });

  renderProducts(filtered);
}

searchInput.addEventListener('input',    applyFilters);
categoryFilter.addEventListener('change', applyFilters);
supplierFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change',   applyFilters);

/* ════════════════════════════
   ADD / EDIT MODAL
════════════════════════════ */
const productModal  = document.getElementById('productModal');
const productForm   = document.getElementById('productForm');
const modalTitle    = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn= document.getElementById('cancelModalBtn');
const editProdIndex = document.getElementById('editProdIndex');
const prodImageFile  = document.getElementById('prodImageFile');
const imagePreview   = document.getElementById('imagePreview');
const imageUploadText= document.getElementById('imageUploadText');
let selectedImage = '';

function resetImageUpload(image = '') {
  selectedImage = image;
  prodImageFile.value = '';
  imagePreview.src = image;
  imagePreview.classList.toggle('visible', Boolean(image));
  imageUploadText.textContent = image ? 'Replace image' : 'Choose an image';
}

prodImageFile.addEventListener('change', () => {
  const file = prodImageFile.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please choose an image file.');
    resetImageUpload();
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => resetImageUpload(reader.result));
  reader.readAsDataURL(file);
});

document.getElementById('addProductBtn').addEventListener('click', () => {
  modalTitle.textContent = 'Add New Product';
  productForm.reset();
  editProdIndex.value = '';
  resetImageUpload();
  openModal(productModal);
});

function openEditModal(index) {
  const p = products[index];
  modalTitle.textContent = 'Edit Product';

  document.getElementById('prodName').value     = p.name;
  document.getElementById('prodCategory').value = p.category;
  document.getElementById('prodSupplier').value = p.supplier;
  document.getElementById('prodPrice').value    = p.price;
  document.getElementById('prodStock').value    = p.stock;
  document.getElementById('prodImage').value    = p.img || '';
  document.getElementById('prodNotes').value    = p.notes || '';
  resetImageUpload(p.img || '');

  editProdIndex.value = index;
  openModal(productModal);
}

closeModalBtn.addEventListener('click',  () => closeModal(productModal));
cancelModalBtn.addEventListener('click', () => closeModal(productModal));
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeModal(productModal);
});

productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name     = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const supplier = document.getElementById('prodSupplier').value;
  const price    = parseFloat(document.getElementById('prodPrice').value);
  const stock    = parseInt(document.getElementById('prodStock').value, 10);
  const img      = selectedImage || document.getElementById('prodImage').value.trim();
  const notes    = document.getElementById('prodNotes').value.trim();

  if (!name || !category || !supplier || isNaN(price) || isNaN(stock)) {
    alert('Please fill in all required fields.');
    return;
  }

  const prodData = {
    name, category, supplier, price, stock,
    status: calcStatus(stock),
    img, notes,
    emoji: '📦'
  };

  const idx = editProdIndex.value;
  if (idx !== '') {
    products[idx] = prodData;
  } else {
    products.push(prodData);
  }

  closeModal(productModal);
  applyFilters();
});

/* ════════════════════════════
   VIEW MODAL
════════════════════════════ */
const viewModal     = document.getElementById('viewModal');
const viewBody      = document.getElementById('viewBody');
const viewModalTitle= document.getElementById('viewModalTitle');
const closeViewBtn  = document.getElementById('closeViewBtn');
const closeViewBtn2 = document.getElementById('closeViewBtn2');
const editFromView  = document.getElementById('editFromViewBtn');
let currentViewIndex = null;

function openViewModal(index) {
  currentViewIndex = index;
  const p = products[index];
  const badgeCls = getBadgeClass(p.status);

  viewModalTitle.textContent = p.name;

  viewBody.innerHTML = `
    <div style="text-align:center;padding:16px 0;font-size:48px;">
      ${p.emoji}
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Product Name</span>
        <span class="view-value">${p.name}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Category</span>
        <span class="view-value">${p.category}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Supplier</span>
        <span class="view-value">${p.supplier}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Price</span>
        <span class="view-value">${fmt(p.price)}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Stock Qty</span>
        <span class="view-value">${p.stock}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Status</span>
        <span class="view-value">
          <span class="status-badge ${badgeCls}">${p.status}</span>
        </span>
      </div>
    </div>
    ${p.notes ? `
    <div class="view-field">
      <span class="view-label">Notes</span>
      <span class="view-value">${p.notes}</span>
    </div>` : ''}
  `;

  openModal(viewModal);
}

closeViewBtn.addEventListener('click',  () => closeModal(viewModal));
closeViewBtn2.addEventListener('click', () => closeModal(viewModal));
viewModal.addEventListener('click', (e) => {
  if (e.target === viewModal) closeModal(viewModal);
});

editFromView.addEventListener('click', () => {
  closeModal(viewModal);
  openEditModal(currentViewIndex);
});

/* ════════════════════════════
   MODAL HELPERS
════════════════════════════ */
function openModal(modal) {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    [productModal, viewModal].forEach(m => {
      if (m.classList.contains('show')) closeModal(m);
    });
  }
});

/* ── Init ── */
applyFilters();