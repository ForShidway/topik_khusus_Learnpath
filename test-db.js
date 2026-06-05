const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Membaca file .env.local secara manual tanpa library tambahan
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
    console.log("✅ Berhasil memuat variabel dari .env.local");
  } else {
    console.log("❌ File .env.local tidak ditemukan!");
  }
} catch (e) {
  console.error("❌ Gagal membaca file env:", e.message);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI tidak diatur di .env.local!");
  process.exit(1);
}

// Sembunyikan password di console log agar aman
const safeUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log("🔍 Menghubungkan ke MongoDB URI:", safeUri);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Batalkan jika dalam 5 detik tidak konek
})
  .then(() => {
    console.log("\n🎉 KONEKSI BERHASIL! Aplikasi kamu sukses terhubung ke MongoDB Atlas.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ KONEKSI GAGAL!");
    console.error("Nama Error:", err.name);
    console.error("Pesan Error:", err.message);
    if (err.reason) {
      console.error("Penyebab:", err.reason);
    }
    
    console.log("\n💡 TIPS SOLUSI:");
    if (err.message.includes("bad auth") || err.message.includes("Authentication failed")) {
      console.log("- Password atau Username database di MONGODB_URI salah. Pastikan password yang kamu masukkan di .env.local sudah benar.");
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("ENOTFOUND") || err.name.includes("MongooseServerSelectionError")) {
      console.log("- Masalah Jaringan / IP. Pastikan kamu sudah menambahkan IP '0.0.0.0/0' (Allow access from anywhere) di MongoDB Atlas -> Network Access.");
    }
    process.exit(1);
  });
