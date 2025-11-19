# Sistem Autentikasi - Login & Register

Sistem autentikasi telah ditambahkan ke aplikasi Pengelola Masjid menggunakan NextAuth.js.

## Fitur yang Ditambahkan

### 1. Halaman Register (`/register`)
- Form pendaftaran user baru
- Validasi:
  - Semua field wajib diisi
  - Password minimal 6 karakter
  - Konfirmasi password harus sama
  - Email tidak boleh duplikat
- Redirect otomatis ke halaman login setelah berhasil

### 2. Halaman Login (`/login`)
- Form login dengan email dan password
- Session management menggunakan JWT
- Redirect otomatis ke dashboard setelah login
- Pesan error yang jelas jika kredensial salah

### 3. Middleware Protection
File: `src/middleware.ts`
- Semua halaman aplikasi dilindungi dengan autentikasi
- User yang belum login akan diarahkan ke `/login`
- Halaman public: `/login` dan `/register`

### 4. Sidebar dengan Info User
- Menampilkan nama user dan email yang sedang login
- Badge role (Admin/User)
- Tombol logout yang berfungsi

### 5. API Register
Endpoint: `POST /api/auth/register`

Request body:
```json
{
  "username": "Nama User",
  "email": "user@example.com",
  "password": "password123"
}
```

Response sukses:
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "username": "Nama User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Cara Menggunakan

### 1. Registrasi User Baru
1. Buka `http://localhost:3000/register`
2. Isi form:
   - Nama Pengguna
   - Email
   - Password (min 6 karakter)
   - Konfirmasi Password
3. Klik tombol "Daftar"
4. Akan diarahkan ke halaman login dengan pesan sukses

### 2. Login
1. Buka `http://localhost:3000/login`
2. Masukkan email dan password
3. Klik tombol "Login"
4. Akan diarahkan ke dashboard

### 3. Logout
1. Klik tombol "Keluar" di sidebar
2. Session akan dihapus dan diarahkan ke halaman login

## File yang Ditambahkan/Dimodifikasi

### File Baru:
- `src/app/login/page.tsx` - Halaman login
- `src/app/login/layout.tsx` - Layout untuk halaman login
- `src/app/register/page.tsx` - Halaman register
- `src/app/register/layout.tsx` - Layout untuk halaman register
- `src/app/api/auth/register/route.ts` - API endpoint register
- `src/app/SessionProvider.tsx` - Provider untuk NextAuth session
- `src/middleware.ts` - Middleware untuk proteksi route
- `src/components/ConditionalSidebar.tsx` - Sidebar conditional
- `src/components/ConditionalMain.tsx` - Main layout conditional

### File yang Dimodifikasi:
- `src/app/layout.tsx` - Menambahkan SessionProvider
- `src/components/Sidebar.tsx` - Menambahkan info user dan logout

## Catatan Penting

### Environment Variables
Pastikan file `.env.local` memiliki variabel berikut:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

Generate NEXTAUTH_SECRET dengan command:
```bash
openssl rand -base64 32
```

### Default Role
Semua user yang register otomatis mendapat role `user`. Untuk membuat admin, ubah langsung di database.

### Session
- Session menggunakan JWT strategy
- Token disimpan di cookie
- Expire time mengikuti default NextAuth (30 hari)

## Testing

1. **Test Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

2. **Test Login:**
Buka browser dan akses `http://localhost:3000/login`

3. **Test Protected Routes:**
Akses `http://localhost:3000` tanpa login, akan diarahkan ke `/login`

## Troubleshooting

### Error: "ECONNREFUSED"
- Database tidak berjalan atau DATABASE_URL salah
- Pastikan PostgreSQL sudah running
- Cek koneksi database

### Error: "Email sudah terdaftar"
- Email sudah ada di database
- Gunakan email lain atau hapus user dari database

### Tidak bisa logout
- Clear browser cookies
- Restart development server

### Session tidak persist
- Cek NEXTAUTH_SECRET di `.env.local`
- Pastikan tidak ada error di console browser
