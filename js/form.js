const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");

// Mengambil semua field yang akan divalidasi
const fields = [
  "nama",
  "email",
  "whatsapp",
  "produk",
  "pesan",
  "setuju"
].map((id) => document.querySelector(`#${id}`));

// Mengambil pilihan topik
const topikInputs = document.querySelectorAll(
  'input[name="topik"]'
);

// LOCAL STORAGE PREFERENSI KONTAK (E07)
const STORAGE_KEY = "donat-manis-preferensi-kontak";

// FUNCTION MENGAMBIL PESAN ERROR
function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) return "Bagian ini wajib diisi.";
  if (validity.typeMismatch) return "Format data belum sesuai.";
  if (validity.tooShort) {
    return `Isi minimal ${field.minLength} karakter.`;
  }
  if (validity.patternMismatch) {
    return "Format belum sesuai contoh yang diminta.";
  }

  return "";
}

// FUNCTION MENAMPILKAN ERROR
function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);

  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

// FUNCTION VALIDASI FIELD
function validasiField(field) {
  field.setCustomValidity("");

  const pesan = getFieldError(field);
  tampilkanError(field, pesan);

  return pesan === "";
}

// FUNCTION MENYIMPAN PREFERENSI
function simpanPreferensi() {
  const data = new FormData(form);

  const preferensi = {
    produk: data.get("produk"),
    topik: data.get("topik"),
    waktuKontak: data.get("waktu-kontak"),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(preferensi)
  );
}

// FUNCTION MEMUAT PREFERENSI
function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);

    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    // Memuat kembali produk
    document.querySelector("#produk").value = preferensi.produk ?? "";

    // Memuat kembali topik
    const topik = document.querySelector(
      `input[name="topik"][value="${preferensi.topik}"]`
    );

    if (topik) {
      topik.checked = true;
    }

    // Memuat kembali waktu kontak
    const waktuKontak = document.querySelector(
      `input[name="waktu-kontak"][value="${preferensi.waktuKontak}"]`
    );

    if (waktuKontak) {
      waktuKontak.checked = true;
    }
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

// FUNCTION MENAMPILKAN PREVIEW (E06)
function tampilkanPreview() {
  const data = new FormData(form);

  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${data.get("whatsapp")}`,
    `Produk: ${data.get("produk")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu Kontak: ${data.get("waktu-kontak")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  // Memunculkan area preview
  preview.hidden = false;
  // Pesan berhasil
  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

// VALIDASI SAAT FORM DIKIRIM (E05)
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // Memeriksa semua field
  const hasilValidasi = fields.map((field) => validasiField(field));
  const semuaValid = hasilValidasi.every(Boolean);
  // Memeriksa pilihan topik
  const topikValid = Array.from(topikInputs).some(
    (input) => input.checked
  );

  const topikPertama = topikInputs[0];

  if (topikPertama) {
    topikPertama.setCustomValidity(
      topikValid ? "" : "Pilih minimal satu topik."
    );
  }
  // Menampilkan pesan error topik
  const topikError = document.querySelector("#topik-error");

  if (topikError) {
    topikError.textContent = topikValid
      ? ""
      : "Pilih minimal satu topik.";
  }
  // Jika masih ada kesalahan
  if (!semuaValid || !topikValid || !form.checkValidity()) {
    formFeedback.textContent ="Periksa kembali bagian yang ditandai.";
    formFeedback.classList.remove("success");
    // Menyembunyikan preview
    preview.hidden = true;
    // Menampilkan pesan validasi browser
    form.reportValidity();
    // Fokus ke field pertama yang tidak valid
    form.querySelector(":invalid")?.focus();

    return;
  }

  // Jika semua data valid
  simpanPreferensi();
  tampilkanPreview();
});

// Memuat preferensi ketika halaman dibuka
muatPreferensi();
