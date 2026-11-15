
"use strict";

// Data produk Donat Manis
const produkUmkm = [
  {
    nama: "Donat Original",
    kategori: "Original",
    harga: 10000,
    stok: 12,
    unggulan: true,
  },
  {
    nama: "Donat Kentang",
    kategori: "Kentang",
    harga: 12000,
    stok: 4,
    unggulan: false,
  },
  {
    nama: "Paket Donat Mix",
    kategori: "Paket Mix",
    harga: 25000,
    stok: 0,
    unggulan: false,
  },
  {
    nama: "Donat Cokelat",
    kategori: "Cokelat",
    harga: 13000,
    stok: 8,
    unggulan: false,
  },
];

// Debugging setiap data produk
produkUmkm.forEach((produk) => {
  console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});

// Menampilkan seluruh data dalam bentuk tabel
console.table(produkUmkm);

// Function format rupiah
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

// Function menentukan status stok
function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "warning" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

// Function membuat kartu produk
function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p class="category-note">${produk.kategori}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
    </article>
  `;
}

// buatElemenProduk
function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  card.append(title, category, price, stock);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
  });

  card.append(removeButton);
  return card;
}

// Function label kategori
function labelKategori(kategori) {
  switch (kategori) {
    case "Original":
      return "Donat rasa klasik";
    case "Kentang":
      return "Donat berbahan kentang";
    case "Paket Mix":
      return "Paket Donat Mix";
    default:
      return "Produk UMKM";
  }
}

// Contoh penggunaan ternary
for (const produk of produkUmkm) {
  const labelAksi = produk.stok > 0
    ? "Siap dipesan"
    : "Hubungi admin";

  console.log(produk.nama, labelAksi);
}

// DOM selection
const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

// empty state
function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

// Function render produk (dengan guard)
function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

// event listener
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});

renderProduk();