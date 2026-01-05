# Instruksi Troubleshooting: Error "column username does not exist"

## Masalah
Error ini muncul setelah deployment karena:
1. Environment variables di Vercel tidak tersinkronisasi
2. DATABASE_URL di Vercel mungkin menunjuk ke database yang berbeda atau belum di-setup

## Solusi

### Langkah 1: Verifikasi Environment Variables di Vercel

1. Buka dashboard Vercel: https://vercel.com
2. Pilih project "masjid-app" (atau nama project Anda)
3. Masuk ke **Settings** → **Environment Variables**
4. Pastikan variabel berikut sudah diatur untuk **Production**, **Preview**, dan **Development**:

```
DATABASE_URL=postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=8f2c4d6e9a1b3c5d7e9f0a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d

NEXTAUTH_URL=https://masjid-app.vercel.app

NODE_ENV=production

PORT=3000

DB_POOL_MAX=20

DB_POOL_IDLE_TIMEOUT=30000

DB_POOL_CONNECTION_TIMEOUT=2000
```

### Langkah 2: Setup Database di Neon (jika belum)

Jalankan script setup database:

```bash
node scripts/setup-database-production.js
```

### Langkah 3: Redeploy Aplikasi

Setelah environment variables diatur, trigger redeploy:

1. **Via Vercel Dashboard:**
   - Masuk ke tab **Deployments**
   - Klik tombol **...** pada deployment terakhir
   - Pilih **Redeploy**

2. **Via Git:**
   ```bash
   git commit --allow-empty -m "Trigger redeploy with correct env vars"
   git push
   ```

### Langkah 4: Test Registrasi

Setelah redeploy selesai:
1. Buka https://masjid-app.vercel.app/register
2. Coba buat akun baru
3. Jika masih error, check logs di Vercel

### Langkah 5: Check Logs di Vercel

Jika masih error:
1. Buka dashboard Vercel
2. Pilih deployment terakhir
3. Klik tab **Logs** atau **Runtime Logs**
4. Cari error message untuk detail lebih lanjut

### Troubleshooting Tambahan

#### Jika masih muncul error "column username does not exist":

1. **Verifikasi DATABASE_URL yang digunakan di production:**
   - Pastikan URL database di Vercel sama dengan yang ada di file `.env`
   
2. **Cek apakah database production sudah di-setup:**
   - Login ke Neon console: https://console.neon.tech
   - Pilih project Anda
   - Check apakah tabel `users` sudah ada dengan struktur yang benar

3. **Re-setup database jika perlu:**
   - Backup data existing (jika ada)
   - Jalankan setup script ulang
   
#### Jika menggunakan Neon Pooler Connection:

Pastikan menggunakan connection string dengan `-pooler` (sudah benar di DATABASE_URL):
```
ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech
```

## Catatan Penting

- Database lokal (development) sudah bekerja dengan baik ✓
- Kolom `username` sudah ada di tabel `users` ✓
- Masalah hanya terjadi di production/deployment

Kemungkinan besar setelah memperbaiki environment variables di Vercel dan redeploy, masalah akan terselesaikan.
