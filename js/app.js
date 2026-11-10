
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
    kategori: "Bundling",
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

// Function label kategori
function labelKategori(kategori) {
  switch (kategori) {
    case "Original":
      return "Donat rasa klasik";
    case "Kentang":
      return "Donat berbahan kentang";
    case "Bundling":
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

// Function render produk
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  // Memastikan semua elemen HTML tersedia
  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  // Mengambil produk yang memiliki stok
  const produkTersedia = produkUmkm.filter(
    (produk) => produk.stok > 0
  );

  // Mencari produk unggulan
  const produkUnggulan = produkUmkm.find(
    (produk) => produk.unggulan === true
  );

  // Mengubah data produk menjadi HTML
  const markupProduk = produkTersedia
    .map(buatKartuProduk)
    .join("");

  // Menampilkan produk ke halaman
  grid.innerHTML = markupProduk;

  // Menampilkan ringkasan produk
  ringkasan.textContent =
    `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

  // Menampilkan produk unggulan
  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";

  // Menampilkan data untuk debugging
  console.table(produkUmkm);
}

// Menjalankan render setelah HTML selesai dimuat
document.addEventListener("DOMContentLoaded", renderProduk);