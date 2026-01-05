# Troubleshooting Register Error di Production

## Error: "Terjadi kesalahan saat registrasi"

### Kemungkinan Penyebab & Solusi:

## 1. ✅ Cek Environment Variables di Vercel

Pastikan environment variables berikut sudah terset di Vercel Dashboard:

**Settings > Environment Variables**

```bash
DATABASE_URL=postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=masjid-zakat-management-system-2025-production-secret-key-very-secure

NEXTAUTH_URL=https://engelola-masjid.vercel.app

NODE_ENV=production
```

**Cara setting:**
1. Buka https://vercel.com/dashboard
2. Pilih project `engelola-masjid`
3. Settings > Environment Variables
4. Tambahkan satu per satu variable di atas
5. Pilih scope: Production, Preview, Development (pilih semua)
6. Klik Save
7. **PENTING:** Redeploy project setelah menambahkan env vars

## 2. 🗄️ Cek Database Connection

Test koneksi ke Neon database:

```bash
# Di terminal lokal, test koneksi:
psql "postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

Pastikan:
- ✅ Database bisa diakses
- ✅ Tabel `users` sudah ada
- ✅ Schema sudah terinstall

Jika tabel belum ada, jalankan:
```sql
-- Buat tabel users jika belum ada
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

## 3. 🔍 Cek Logs di Vercel

Untuk melihat error detail:

1. Buka https://vercel.com/dashboard
2. Pilih project > Deployments
3. Klik deployment terbaru
4. Klik tab **Runtime Logs** atau **Functions**
5. Coba register lagi
6. Lihat error yang muncul di logs

## 4. 📝 Test dengan cURL

Test API endpoint langsung:

```bash
curl -X POST https://engelola-masjid.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

Response yang diharapkan:
- ✅ Status 201: Registrasi berhasil
- ❌ Status 400: Validation error (email/username sudah ada)
- ❌ Status 500: Server error (cek database connection)

## 5. 🔄 Redeploy Setelah Fix

Setelah menambahkan/mengubah environment variables:

```bash
# Commit perubahan kode (jika ada)
git add .
git commit -m "fix: improve error logging for registration"
git push origin main

# Atau trigger redeploy manual di Vercel Dashboard
```

## 6. 🧪 Test Lokal Dulu

Sebelum push ke production, test dulu di lokal:

```bash
# Set environment variables
cp .env.example .env
# Edit .env dengan DATABASE_URL yang benar

# Install dependencies
npm install

# Run development server
npm run dev

# Test register di http://localhost:3000/register
```

## Error Messages & Solutions

| Error Message | Penyebab | Solusi |
|--------------|----------|--------|
| "Semua field harus diisi" | Form tidak lengkap | Isi semua field |
| "Password minimal 6 karakter" | Password terlalu pendek | Gunakan password >= 6 karakter |
| "Email sudah terdaftar" | Email duplikat | Gunakan email lain |
| "Username sudah terdaftar" | Username duplikat | Gunakan username lain |
| "Terjadi kesalahan saat registrasi" | Database connection error | Cek DATABASE_URL env var |
| "Terjadi kesalahan koneksi" | Network/CORS issue | Cek NEXTAUTH_URL setting |

## Quick Checklist

- [ ] DATABASE_URL sudah di-set di Vercel
- [ ] NEXTAUTH_SECRET sudah di-set di Vercel
- [ ] NEXTAUTH_URL sudah di-set di Vercel (dengan https://)
- [ ] NODE_ENV=production di Vercel
- [ ] Schema database sudah di-run
- [ ] Tabel `users` sudah ada di database
- [ ] Project sudah di-redeploy setelah setting env vars
- [ ] Cek runtime logs di Vercel untuk error detail

## Kontak Support

Jika masih error setelah cek semua di atas:
1. Screenshot error message
2. Screenshot Vercel env vars (tanpa nilai sensitif)
3. Copy paste runtime logs dari Vercel
4. Share untuk debugging lebih lanjut
