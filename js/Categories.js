/* ==========================================================================
   Categories Page Logic
   Renders the categories table + stat cards, wires up the search box, and
   handles the "Add Category" modal — new submissions are pushed into
   categoriesData and immediately re-rendered into the table.
   Replace `categoriesData` with a real API/database call whenever ready.
   ========================================================================== */

let categoriesData = [
  { name: "Beverages",     description: "Soft drinks, juices, teas, coffees and other beverage products.", products: 27, status: "Active",   icon: "fa-mug-hot",         color: "#1F9254" },
  { name: "Groceries",     description: "Daily cooking essentials like rice, sugar, flour, oils and more",  products: 53, status: "Active",   icon: "fa-basket-shopping", color: "#D14343" },
  { name: "Personal Care", description: "Personal hygiene and beauty care products.",                       products: 34, status: "Active",   icon: "fa-pump-soap",       color: "#B8860B" },
  { name: "Snacks",        description: "Chips, biscuits, cookies, chocolates and other snacks.",           products: 15, status: "Active",   icon: "fa-cookie",          color: "#B8720A" },
  { name: "Household",     description: "Cleaning products, laundry, and other household essentials.",     products: 30, status: "Inactive", icon: "fa-broom",           color: "#4B4D5A" },
  { name: "Frozen Foods",  description: "Frozen vegetables, meats, ice creams and other frozen items.",     products: 12, status: "Active",   icon: "fa-snowflake",       color: "#3468D1" },
  { name: "Baby Care",     description: "Baby food, diapers, wipes and other baby care products.",          products: 65, status: "Inactive", icon: "fa-baby",            color: "#C2185B" }
];

/* ---------------- Stat cards ---------------- */
function renderStats() {
  const total = categoriesData.length;
  const active = categoriesData.filter((c) => c.status === "Active").length;
  const inactive = total - active;
  const totalProducts = categoriesData.reduce((sum, c) => sum + Number(c.products), 0);

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statActive").textContent = active;
  document.getElementById("statInactive").textContent = inactive;
  document.getElementById("statProducts").textContent = totalProducts;
}

/* ---------------- Table rendering ---------------- */
function renderCategoriesTable() {
  const searchTerm = document.getElementById("tableSearch").value.trim().toLowerCase();

  const filtered = categoriesData.filter((c) =>
    searchTerm === "" ||
    c.name.toLowerCase().includes(searchTerm) ||
    c.description.toLowerCase().includes(searchTerm)
  );

  const tbody = document.getElementById("categoriesTableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5" style="text-align:center; padding:32px; color:#A9ABB6;">
        No categories match your search.
      </td></tr>`;
  } else {
    filtered.forEach((c, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="category-cell">
            <div class="category-icon" style="background:${c.color};"><i class="fa-solid ${c.icon}"></i></div>
            ${c.name}
          </div>
        </td>
        <td class="category-description">${c.description}</td>
        <td>${c.products}</td>
        <td><span class="status-badge status-${c.status.toLowerCase()}">${c.status}</span></td>
        <td>
          <div class="row-actions">
            <button class="action-edit" title="Edit" onclick="editCategory(${index})"><i class="fa-solid fa-pen"></i></button>
            <button class="action-view" title="View" onclick="viewCategory(${index})"><i class="fa-solid fa-eye"></i></button>
            <button class="action-delete" title="Delete" onclick="deleteCategory(${index})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("paginationSummary").textContent =
    `Showing 1 to ${filtered.length} of ${categoriesData.length} categories`;
}

/* ---------------- Row actions ---------------- */
function editCategory(index) { console.log("Edit category", categoriesData[index]); }
function viewCategory(index) { console.log("View category", categoriesData[index]); }

function deleteCategory(index) {
  const category = categoriesData[index];
  if (!confirm(`Delete "${category.name}"? This can't be undone.`)) return;
  categoriesData.splice(index, 1);
  renderCategoriesTable();
  renderStats();
}

/* ---------------- Add Category modal ---------------- */
function openAddCategoryModal() {
  document.getElementById("addCategoryOverlay").classList.add("open");
  document.getElementById("addCategoryError").textContent = "";
}

function closeAddCategoryModal() {
  document.getElementById("addCategoryOverlay").classList.remove("open");
  document.getElementById("addCategoryForm").reset();
  document.getElementById("addCategoryError").textContent = "";
}

function handleAddCategorySubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("addCategoryError");

  const name = document.getElementById("fieldCategoryName").value.trim();
  const description = document.getElementById("fieldDescription").value.trim();
  const iconSelect = document.getElementById("fieldIcon");
  const icon = iconSelect.value;
  const color = iconSelect.options[iconSelect.selectedIndex].dataset.color;
  const products = document.getElementById("fieldProducts").value || 0;
  const status = document.getElementById("fieldStatus").value;

  if (!name || !description) {
    errorEl.textContent = "Please fill in the category name and description.";
    return;
  }

  categoriesData.push({
    name, description,
    products: Number(products),
    status, icon, color
  });

  closeAddCategoryModal();
  renderCategoriesTable();
  renderStats();

  // This is where you'd call your real "create category" API. Example:
  // fetch("/api/categories", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ name, description, products, status, icon })
  // });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  renderCategoriesTable();

  document.getElementById("tableSearch").addEventListener("input", renderCategoriesTable);

  document.getElementById("openAddCategoryBtn").addEventListener("click", openAddCategoryModal);
  document.getElementById("closeAddCategoryBtn").addEventListener("click", closeAddCategoryModal);
  document.getElementById("cancelAddCategoryBtn").addEventListener("click", closeAddCategoryModal);
  document.getElementById("addCategoryForm").addEventListener("submit", handleAddCategorySubmit);

  document.getElementById("addCategoryOverlay").addEventListener("click", (e) => {
    if (e.target.id === "addCategoryOverlay") closeAddCategoryModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAddCategoryModal();
  });
});
