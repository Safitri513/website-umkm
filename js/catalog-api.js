"use strict";

// Lokasi file JSON
const DATA_URL = "data/products.json";

// Mengambil elemen HTML berdasarkan ID
const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");

// Mengambil seluruh tombol filter kategori
const tombolFilter = document.querySelectorAll("[data-filter]");

// Menyiapkan data produk dan kategori aktif
let products = [];
let activeCategory = "Semua"; // menyimpan kategori yang sedang dipilih pengguna

// Function untuk mengatur status katalog
function setStatus(state, message) {
  catalogStatus.className = "catalog-status";

  if (state) {
    catalogStatus.classList.add(state);
  }

  catalogStatus.textContent = message;
}

// Function untuk mengambil data produk dari JSON
async function loadProducts() {
  try {
    setStatus("loading", "Memuat data produk...");
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    products = await response.json();
    renderProducts(products);
    // Menampilkan status jika produk berhasil dimuat
    if (products.length > 0) {
    setStatus("success", `${products.length} produk berhasil dimuat.`);
    }
  } catch (error) {
    setStatus("error", `Gagal memuat produk: ${error.message}`);
  }
}

// Function untuk menampilkan pesan jika data kosong
function createEmptyState() {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = "Belum ada produk yang tersedia.";

  return empty;
}

// Function untuk menampilkan daftar produk
function renderProducts(items) {
  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(createEmptyState());
    produkRingkasan.textContent = "0 produk ditemukan.";
    setStatus("success", "Request berhasil, tetapi data kosong.");
    return;
  }

  items.forEach((product) => {
    produkGrid.append(createProductCard(product));
  });

  produkRingkasan.textContent =
    `${items.length} produk ditampilkan.`;
}

// Function untuk mengubah angka menjadi format Rupiah
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

// Function untuk membuat elemen kartu produk
function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  // Membuat nama produk
  const name = document.createElement("h3");
  name.textContent = product.name;

  // Membuat kategori produk
  const category = document.createElement("p");
  category.textContent = `Kategori: ${product.category}`;

  // Membuat harga produk
  const price = document.createElement("p");
  price.textContent = formatRupiah(product.price);

  // Membuat informasi stok
  const stock = document.createElement("p");
  stock.textContent = `Stok: ${product.stock}`;

  // Membuat deskripsi produk
  const description = document.createElement("p");
  description.textContent = product.description;

  // Memasukkan seluruh elemen ke dalam kartu
  card.append(name, category, price, stock, description);

  return card;
}

// Function untuk menyaring produk berdasarkan kategori
function applyFilter(category) {
  activeCategory = category;

  const filtered = category === "Semua"
    ? products
    : products.filter((product) => product.category === category);

  renderProducts(filtered);
}

// Menghubungkan tombol filter dengan function applyFilter
tombolFilter.forEach((button) => {
  button.addEventListener("click", (event) => {
    tombolFilter.forEach((item) => item.classList.remove("is-active"));

    event.currentTarget.classList.add("is-active");

    applyFilter(event.currentTarget.dataset.filter ?? "Semua");
  });
});

// Memuat data produk dari file JSON
loadProducts();