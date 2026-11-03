"use strict";

// Data produk Donat Manis
const produkUmkm = [
  { nama: "Donat Original", kategori: "Original", harga: 10000, stok: 12 },
  { nama: "Donat Kentang", kategori: "Kentang", harga: 12000, stok: 4 },
  { nama: "Paket Donat Mix", kategori: "Bundling", harga: 25000, stok: 0 },
  { nama: "Donat Cokelat", kategori: "Cokelat", harga: 13000, stok: 8 }
];

console.table(produkUmkm);

const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

console.log(formatRupiah.format(produkUmkm[0].harga));

function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

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

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");

  if (!grid || !ringkasan) {
    return;
  }

  let jumlahTersedia = 0;
  let markup = "";

  for (const produk of produkUmkm) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);
    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

    if (produk.stok > 0) {
      jumlahTersedia = jumlahTersedia + 1;
    }

    markup = markup + `
      <article class="js-product-card">
        <h3>${produk.nama}</h3>
        <p>${kategori}</p>
        <p class="price">${formatRupiah.format(produk.harga)}</p>
        <span class="stock-badge ${status.className}">${status.label}</span>
        <p>${labelAksi}</p>
      </article>
    `;
  }

  grid.innerHTML = markup;
  ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);