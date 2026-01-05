# QUICK FIX - Register Error di Vercel

## 🚨 Langkah Cepat untuk Fix Error Register

### Step 1: Cek Environment Variables di Vercel (PENTING!)

1. Buka https://vercel.com → pilih project `engelola-masjid`
2. Klik **Settings** → **Environment Variables**
3. Pastikan ada 4 variables ini:

```
DATABASE_URL
NEXTAUTH_SECRET  
NEXTAUTH_URL
NODE_ENV
```

4. Jika belum ada, tambahkan satu per satu dengan nilai berikut:

#### DATABASE_URL
```
postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### NEXTAUTH_SECRET
```
masjid-zakat-management-system-2025-production-secret-key-very-secure
```

#### NEXTAUTH_URL (GANTI dengan domain Vercel Anda!)
```
https://engelola-masjid.vercel.app
```

#### NODE_ENV
```
production
```

**⚠️ PENTING:** Pilih scope untuk **Production**, **Preview**, dan **Development**

### Step 2: Redeploy

Setelah menambahkan env vars:

1. Klik tab **Deployments**
2. Klik titik tiga (...) di deployment terbaru
3. Pilih **Redeploy**
4. Tunggu sampai selesai

### Step 3: Test Lagi

Coba register lagi di https://engelola-masjid.vercel.app/register

- Jika masih error, lanjut ke Step 4

### Step 4: Cek Runtime Logs

1. Di Vercel Dashboard, buka tab **Functions** atau **Runtime Logs**
2. Coba register sekali lagi
3. Refresh logs
4. Cari error message - sekarang akan muncul detail errornya

### Step 5: Cek Database

Pastikan database bisa diakses dan tabel sudah ada:

```bash
# Test koneksi (dari terminal lokal):
psql "postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Cek tabel users:
\dt users

# Jika tabel tidak ada, buat dengan:
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔍 Kemungkinan Penyebab Error

Berdasarkan screenshot, kemungkinan besar:

1. **DATABASE_URL tidak terset** (90% kemungkinan) ⚠️
   - Vercel tidak bisa connect ke Neon database
   - Solusi: Set env var DATABASE_URL di Vercel

2. **Tabel users belum ada** (5% kemungkinan)
   - Database belum di-setup dengan schema
   - Solusi: Jalankan schema.sql di Neon Console

3. **NEXTAUTH_URL salah** (5% kemungkinan)
   - URL tidak sesuai dengan domain Vercel
   - Solusi: Update NEXTAUTH_URL dengan domain yang benar

## 📱 Cara Cepat Cek

Test API langsung dengan browser:

1. Buka DevTools (F12) di browser
2. Masuk ke tab **Console**  
3. Paste code ini:

```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'test123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

4. Lihat response - sekarang akan ada detail error

## 💡 Yang Sudah Saya Perbaiki

Saya sudah menambahkan:
1. ✅ Better error logging di API
2. ✅ Detail error message di frontend
3. ✅ Database connection debugging
4. ✅ Console logs untuk troubleshooting

Sekarang jika ada error, Anda akan bisa lihat detail errornya di:
- Browser console (F12)
- Vercel runtime logs

## Setelah Fix

Commit dan push perubahan:

```bash
git add .
git commit -m "fix: improve error logging and handling for registration"
git push origin main
```

Vercel akan auto-deploy.

---

**Next Steps:** Setelah melakukan step 1-2 di atas, coba register lagi dan screenshot error baru yang muncul jika masih gagal. Error message baru akan lebih detail dan helpful untuk debugging.
