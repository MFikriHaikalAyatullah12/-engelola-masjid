import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, getUserByUsername } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Cek apakah username sudah terdaftar
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username sudah terdaftar' },
        { status: 400 }
      );
    }

    // Buat user baru (default role adalah 'user')
    const newUser = await createUser({
      username,
      email,
      password,
      role: 'user',
    });

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
