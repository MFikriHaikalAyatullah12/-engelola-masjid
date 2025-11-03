import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM settings ORDER BY key ASC');
    
    // If no settings exist, create default ones
    if (result.rows.length === 0) {
      const defaultSettings = [
        { key: 'nama_masjid', value: 'Masjid Al-Ikhlas', description: 'Nama masjid' },
        { key: 'alamat_masjid', value: 'Jl. Masjid No. 1, Jakarta', description: 'Alamat masjid' },
        { key: 'harga_beras', value: '15000', description: 'Harga beras per kg' },
        { key: 'nisab_emas', value: '85', description: 'Nisab emas dalam gram' },
        { key: 'nisab_uang', value: '85000000', description: 'Nisab uang dalam rupiah' }
      ];

      for (const setting of defaultSettings) {
        await pool.query(
          'INSERT INTO settings (key, value, description) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
          [setting.key, setting.value, setting.description]
        );
      }

      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { settings } = await request.json();
    
    for (const setting of settings) {
      await pool.query(
        'UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP WHERE key = $2',
        [setting.value, setting.key]
      );
    }
    
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}