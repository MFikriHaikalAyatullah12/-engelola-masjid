# ✅ DATABASE BERHASIL DIALIHKAN!

## 🔄 Database URL Baru

Database sudah dialihkan ke:
```
postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 📝 Yang Sudah Diupdate

✅ File `.env` (untuk development lokal)
✅ File `DEPLOYMENT.md`
✅ File `QUICK_FIX_REGISTER.md`
✅ File `TROUBLESHOOTING_REGISTER.md`
✅ File `env-for-deployment.txt`

## 🚀 LANGKAH PENTING - Update di Vercel

**WAJIB dilakukan agar production berjalan!**

### 1. Buka Vercel Dashboard
- Login ke https://vercel.com
- Pilih project **engelola-masjid**

### 2. Update Environment Variable
- Klik tab **Settings**
- Pilih menu **Environment Variables**
- Cari variable **DATABASE_URL**

### 3. Edit DATABASE_URL
- Klik **Edit** pada DATABASE_URL
- Replace dengan nilai baru:
```
postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
- Klik **Save**

### 4. Redeploy
- Klik tab **Deployments**
- Pada deployment terbaru, klik menu (...) 
- Pilih **Redeploy**
- Tunggu sampai deployment selesai

## 🗄️ Setup Database Baru

Sebelum bisa digunakan, database baru perlu di-setup dengan schema:

### Option 1: Via Neon Console (Recommended)
1. Buka https://console.neon.tech
2. Login dan pilih project yang sesuai
3. Buka SQL Editor
4. Copy paste isi file `database/schema.sql`
5. Execute

### Option 2: Via Script (Jika psql terinstall)
```bash
# Setup schema
psql "postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" < database/schema.sql

# Setup data production
psql "postgresql://neondb_owner:npg_Zh9ymU4IzKDA@ep-polished-hat-a1o7cn3n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" < database/setup-production.sql
```

### Option 3: Via Node.js Script
```bash
# Di terminal lokal
npm run setup-db
```

## ✅ Checklist

Pastikan semua langkah berikut sudah dilakukan:

- [ ] Database URL diupdate di Vercel
- [ ] Vercel sudah di-redeploy
- [ ] Schema database sudah di-run di database baru
- [ ] Test register di production
- [ ] Test login di production

## 🧪 Test Database Connection

### Test Lokal
Server development sudah berjalan di http://localhost:3000

Coba:
1. Buka http://localhost:3000/register
2. Register user baru
3. Check apakah berhasil

### Test Production
Setelah redeploy Vercel:
1. Buka https://engelola-masjid.vercel.app/register
2. Register user baru
3. Check apakah berhasil

## ⚠️ Important Notes

1. **Database Lama vs Baru**
   - Database lama: `ep-still-resonance-a1bh691h`
   - Database baru: `ep-polished-hat-a1o7cn3n` ✅
   
2. **Data Migration**
   - Jika ada data penting di database lama, perlu di-migrate dulu
   - Export dari database lama → Import ke database baru

3. **Environment Variables Lain**
   - NEXTAUTH_SECRET tetap sama
   - NEXTAUTH_URL tetap sama
   - NODE_ENV tetap sama
   - Hanya DATABASE_URL yang berubah

## 📞 Next Steps

1. ✅ Update DATABASE_URL di Vercel
2. ✅ Redeploy Vercel
3. ✅ Setup schema di database baru
4. ✅ Test register & login
5. ✅ Migrate data lama (jika perlu)

---

**Status Lokal:** ✅ BERHASIL - Server running di http://localhost:3000

**Status Production:** ⏳ PENDING - Tunggu update DATABASE_URL di Vercel & redeploy
