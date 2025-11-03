'use client';

import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        alert('Pengaturan berhasil disimpan!');
      } else {
        alert('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Terjadi kesalahan saat menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Informasi Masjid */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Masjid</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Masjid
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      value={settings.find(s => s.key === 'nama_masjid')?.value || 'Masjid Al-Ikhlas'}
                      onChange={(e) => updateSetting('nama_masjid', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Masjid
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      rows={3}
                      value={settings.find(s => s.key === 'alamat_masjid')?.value || 'Jl. Masjid No. 1, Jakarta'}
                      onChange={(e) => updateSetting('alamat_masjid', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pengaturan Zakat */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Zakat</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Beras per KG (Rp)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      value={settings.find(s => s.key === 'harga_beras')?.value || '15000'}
                      onChange={(e) => updateSetting('harga_beras', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nisab Emas (gram)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      value={settings.find(s => s.key === 'nisab_emas')?.value || '85'}
                      onChange={(e) => updateSetting('nisab_emas', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nisab Uang (Rp)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      value={settings.find(s => s.key === 'nisab_uang')?.value || '85000000'}
                      onChange={(e) => updateSetting('nisab_uang', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
